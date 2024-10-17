from pymongo.mongo_client import MongoClient
import numpy as np
import random
import pygad
from flask import Flask, jsonify, request
import copy

app = Flask(__name__)
@app.route('/resolve', methods=['POST'])
def resolve():
    def json_to_course_planner(json_planner):
        semester_conversion = {"s1": "Semester 1", "s2": "Semester 2", "wi": "Winter Term", "su": "Summer Term"}
        course_planner = {}
        for year_sem, subjects in json_planner.items():
            year, sem = year_sem[:-2], semester_conversion[year_sem[-2:]]
            if year in course_planner:
                course_planner[year][sem] = []
            else:
                course_planner[year] = {}
                course_planner[year][sem] = []
            for subject in subjects.values():
                if subject:
                    course_planner[year][sem].append(subject["subjectCode"])
                else:
                    course_planner[year][sem].append("")
        return course_planner
    
    def get_credits(level):
        credit = 0
        for year in course_planner.values():
            for subjects in year.values():
                levels = [int(subject[4]) for subject in subjects if subject]
                if max(levels, default=0) > level:
                    return credit
                credit += sum([subject_credits[subject] for subject in subjects if subject and int(subject[4]) == level])    
        return credit

    def original_diff_penalty(X):
        return sum(1 for x, y in zip(original, X) if x != y) / 2 * 0.05
        
    def progression_rule_penalty():
        penalty = 0
        for level, threshold in progression_rule.items():
            if get_credits(level) < threshold:
                penalty += 1
        return penalty

    def before(a, b):
        # check if subject a is taken before class b
        for year in course_planner.values():
            for subjects in year.values():
                if b in subjects:
                    return False
                elif a in subjects:
                    return True


    def concurrent(a, b):
        # check if subject a is taken concurrently with class b
        for year in course_planner.values():
            for subjects in year.values():
                if a in subjects:
                    return b in subjects
                
                
    def array_to_course_planner(X):
        X = [int_to_subject[idx] for idx in X]
        for year_num, year in course_planner.items():
            for sem, subjects in year.items():
                course_planner[year_num][sem] = X[:len(subjects)]
                X = X[len(subjects):]
                    

    def unavailable_sem():
        penalty = 0
        for year in course_planner.values():
            for sem, subjects in year.items():
                for subject in subjects:
                    if subject and sem not in available_sem[subject]:
                        penalty += 1000
        return penalty


    def option_satisfied(option, subject):
        # option takes the form ['a', 'b', ...]
        for prereq_subject in option:
            if before(prereq_subject, subject):
                return True
        return False


    def prereq_satisfied(subject, prereq):
        for option in prereq:
            if not option_satisfied(option, subject):
                return False
        return True


    def prereq_violations():
        penalty = 0
        for subject, prereq in prereqs.items():
            # prereq takes the form [[...], [...]]
            if not prereq_satisfied(subject, prereq):
                penalty += 1
        return penalty


    def coreq_violations():
        penalty = 0
        for subject, coreq_subjects in coreqs.items():
            if subject in all_subjects:
                for core_subject in coreq_subjects:
                    if not concurrent(subject, core_subject):
                        penalty += 1
                        break
        return penalty

                                                                                                                    
    def f(ga, X, X_idx):    
        array_to_course_planner(X)
        fitness = 0
        fitness -= original_diff_penalty(X) + unavailable_sem() + prereq_violations() + coreq_violations() + progression_rule_penalty() 
        return fitness


    def mutation_func(offspring, ga_instance):
        offspring = offspring.flatten()
        semesters = []
        for year in course_planner.values():
            for subjects in year.values():
                semesters.append(offspring[:len(subjects)])
                offspring = offspring[len(subjects):]
        # Select two different semesters
        group1_idx, group2_idx = random.sample(range(len(semesters)), 2)

        # Select one random subject from each semester
        elem1_idx = random.randint(0, len(semesters[group1_idx]) - 1)
        elem2_idx = random.randint(0, len(semesters[group2_idx]) - 1)

        # Swap the subjects
        semesters[group1_idx][elem1_idx], semesters[group2_idx][elem2_idx] = (
            semesters[group2_idx][elem2_idx],
            semesters[group1_idx][elem1_idx],
        )
        return np.array([subject for sem in semesters for subject in sem]).reshape(1, -1)
    
    def find_subject_by_code(subjectCode):
        if subjectCode == "":
            return {}
        for subjects in json_planner.values():
            for subject in subjects.values():
                if subject and subject["subjectCode"] == subjectCode:
                    return subject
                
    data = request.json  # Receive data sent in the POST request
    course = data.get('courseName')
    json_planner = data.get('coursePlanner')
    course_planner = json_to_course_planner(json_planner)
    all_subjects = set(subject for sem in course_planner.values() for subjects in sem.values() for subject in subjects)
    subject_to_int = {subject: idx for idx, subject in enumerate(all_subjects)}
    int_to_subject = {idx: subject for subject, idx in subject_to_int.items()}
    progression_rule = {}
    prereqs = {}
    coreqs = {}
    available_sem = {}
    subject_credits = {}

    # fetch data from database

    uri = "mongodb+srv://073:UltimateHandbook073@comp30022-073.v76xfnt.mongodb.net/?retryWrites=true&w=majority&appName=COMP30022-073"
    client = MongoClient(uri)
    try:
        client.admin.command('ping')
        for subject in all_subjects:
            if subject:
                record = client['Unimelb_Handbook']['Subject'].find_one({"subjectCode": subject})
                prereqs[subject] = record['prerequisites']
                coreqs[subject] = record['corequisites']
                available_sem[subject] = record['studyPeriod']
                subject_credits[subject] = record['points']
        course_object = client['Unimelb_Handbook']['Course'].find_one({"courseName": course})
        progression_rule[1] = course_object["progression1"]
        progression_rule[2] = course_object["progression2"]
        client.close()
        
    except Exception as e:
        print(e)

    # compress to 1d list (required for GA input)
    initial_population = []
    for sems in course_planner.values():
        initial_population.extend(sems.values())
    initial_population = [subject_to_int[subject] for sem in initial_population for subject in sem]
    original = initial_population.copy()
    

    model = pygad.GA(initial_population = [initial_population, initial_population],
                    fitness_func = f,
                    num_generations = 1000,
                    num_parents_mating = 1, 
                    crossover_probability = 0,
                    mutation_probability = 0.6,
                    mutation_type = mutation_func)

    model.run()  
    course_planner = [int_to_subject[idx] for idx in model.best_solution()[0]]
    resolved_planner = copy.deepcopy(json_planner)
    i = 0
    for sem, subjects in resolved_planner.items():
        for pos in subjects:
            resolved_planner[sem][pos] = find_subject_by_code(course_planner[i])
            i += 1
    return jsonify(resolved_planner), 200

if __name__ == '__main__':
    # Run the app on localhost at port 5000
    app.run(host='0.0.0.0', port=5000)