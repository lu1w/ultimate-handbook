'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import axios from 'axios';

import { Button } from '@/components/ui/button';
import SubjectCard from '@/components/common/subjectCard';
import EmptySubjectCard from '@/components/planner/emptySubjectCard';
import Rules from '@/components/planner/rules';
// import subjectPlanner from '@/mock-data/courseData';

import { Progressions } from '@/lib/objectSchema';

import { SERVER_URL } from '@/lib/utils';
import { Subject } from '@/lib/objectSchema';

enum StudyPeriodType {
  'su' = 'Summer Term',
  's1' = 'Semester 1',
  'wi' = 'Winter Term',
  's2' = 'Semester 2',
}

type StudyPeriod = keyof typeof StudyPeriodType;
type Year = 'y1' | 'y2' | 'y3';

const PlannerPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const [planner, setPlanner] = useState({});
  const [progressions, setProgressions] = useState<Progressions>({
    overall: {},
    discipline: {},
    breadth: {},
    degreeProgression: {},
  });

  const years: Year[] = ['y1', 'y2', 'y3'];
  const intakeYear = 2024;
  const studyPeriods: StudyPeriod[] = ['su', 's1', 'wi', 's2'];

  const getStudyPeriodName = (period: StudyPeriod) => {
    switch (period) {
      case 's1':
        return 'Semester 1';
      case 's2':
        return 'Semester 2';
      case 'su':
        return 'Summer Term';
      case 'wi':
        return 'Winter Term';
    }
  };

  const getYearName = (year: Year) => {
    switch (year) {
      case 'y1':
        return intakeYear;
      case 'y2':
        return intakeYear + 1;
      case 'y3':
        return intakeYear + 2;
    }
  };

  /* Initialize planner data from backend */
  useEffect(() => {
    console.log(`enter useEffect() to fetch planner`);
    const fetchPlanner = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/v1/course/user/${userId}/planner`,
        );
        setPlanner(res.data);
        console.log(`my planner is: ${JSON.stringify(res.data)}`);
      } catch (err) {
        // TODO: handle error
        console.error('Cannot fetch planner from backend');
      }
    };
    fetchPlanner();
  }, []);

  /* Initialize progression rules data from backend */
  useEffect(() => {
    console.log(`enter useEffect() to fetch planner`);
    const fetchProgressions = async () => {
      try {
        const res = await axios.get(
          `${SERVER_URL}/v1/course/user/${userId}/progressions`,
        );
        setProgressions(res.data);
        console.log(`my progressions are: ${JSON.stringify(res.data)}`);
      } catch (err) {
        // TODO: handle error
        console.error('Cannot fetch progressions from backend');
      }
    };
    fetchProgressions();
  }, []);

  const addSubject = (
    year: Year,
    studyPeriod: StudyPeriod,
    position: string,
  ) => {
    router.push(
      `/search/?userId=${userId}&slot=${year}${studyPeriod}${position}`,
    );
  };

  const removeSubject = async (
    year: Year,
    studyPeriod: StudyPeriod,
    position: string,
  ) => {
    const resPlanner = await axios.delete(
      `${SERVER_URL}/v1/course/user/${userId}/remove/${year}${studyPeriod}${position}`,
    );
    setPlanner(resPlanner.data);

    const resProgressions = await axios.get(
      `${SERVER_URL}/v1/course/user/${userId}/progressions`,
    );
    setProgressions(resProgressions.data);
    console.log(
      `my planner after removing ${year}${studyPeriod}${position} is ${JSON.stringify(planner)}`,
    );
  };

  const addStudyPeriod = async (year: Year, studyPeriod: StudyPeriod) => {
    const url = `${SERVER_URL}/v1/course/user/${userId}/addTerm/${year}${studyPeriod}`;
    try {
      const res = await axios.post(url);
      setPlanner(res.data.planner);
    } catch (err) {
      console.error(`Failed in handling POST ${url}`);
    }
  };

  const removeStudyPeriod = (year: Year, studyPeriod: StudyPeriod) => {
    router.push('');
  };

  const callResolve = async () => {
    const res = await axios.post(
      `${SERVER_URL}/v1/course/user/${userId}/resolve`,
    );
    const planner = res.data;
    console.log(planner);
    setPlanner(planner);
  };

  const getSubject = (
    year: Year,
    studyPeriod: StudyPeriod,
    position: string,
  ): Subject | null | undefined => {
    const key = `${year}${studyPeriod}` as keyof typeof planner;
    const termData = planner[key];
    // If there's no data for this term, return undefined
    if (!termData) return undefined;
    const subject = termData[position as keyof typeof termData]; // Get the subject at the given position
    // If the subject exists and is a valid object, return the subject.
    // If the subject is explicitly null, return null (meaning the slot is intentionally empty).
    // If there's no subject data at all, return undefined.
    return subject && Object.keys(subject).length > 0
      ? (subject as Subject)
      : subject === undefined
        ? undefined
        : null;
  };

  const getSemesterRow = (year: Year, studyPeriod: StudyPeriod) => {
    const title = (
      <h2 className="text-xl font-semibold mb-2">{`${getYearName(year)} ${getStudyPeriodName(studyPeriod)}`}</h2>
    );
    // Handle normal and two-slot positions
    if (['su', 'wi'].includes(studyPeriod)) {
      // Handle 'su' and 'wi' terms with twoSlotPositions
      const subject1 = getSubject(year, studyPeriod, 'p1');
      const subject2 = getSubject(year, studyPeriod, 'p2');
      // If summer or winter term isn't added
      if (subject1 === undefined && subject2 === undefined) {
        return (
          <div className="flex items-center">
            <span className="text-lg">{title}</span>
            <Button
              variant={'planner'}
              className="ml-4 mb-1 font-semibold"
              onClick={() => addStudyPeriod(year, studyPeriod)} // Replace with your button logic
            >
              Add Term
            </Button>
          </div>
        );
        // If summer or winter term is added
      } else {
        return (
          <div>
            <div className="flex items-center pb-2">
              {title}
              <Button
                variant={'planner'}
                className="ml-4 mb-1 font-semibold"
                onClick={() => removeStudyPeriod(year, studyPeriod)} // Replace with your button logic
              >
                Remove Term
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 min-h-[15rem]">
              {/* Render Subject Cards or Empty Subject Cards based on subject existence */}
              {['p1', 'p2'].map((position, index) => {
                const subject = getSubject(year, studyPeriod, position); // Get the subject for the current position
                return subject ? (
                  <SubjectCard
                    key={position}
                    {...subject}
                    handleClick={() =>
                      removeSubject(year, studyPeriod, position)
                    }
                    button="x"
                  />
                ) : (
                  <EmptySubjectCard
                    key={position}
                    onAdd={() => addSubject(year, studyPeriod, position)}
                  />
                );
              })}
            </div>
          </div>
        );
      }
    } else if (['s1', 's2'].includes(studyPeriod)) {
      if (['s1', 's2'].includes(studyPeriod)) {
        const subject1 = getSubject(year, studyPeriod, 'p1');
        const subject2 = getSubject(year, studyPeriod, 'p2');
        const subject3 = getSubject(year, studyPeriod, 'p3');
        const subject4 = getSubject(year, studyPeriod, 'p4');
        return (
          <div>
            {title}
            <div className="grid grid-cols-4 gap-4 pb-2 min-h-[15rem]">
              {/* Render Subject Cards or Empty Subject Cards based on subject existence */}
              {['p1', 'p2', 'p3', 'p4'].map((position, index) => {
                const subject = getSubject(year, studyPeriod, position); // Get the subject for the current position
                return subject ? (
                  <SubjectCard
                    key={position}
                    {...subject}
                    handleClick={() =>
                      removeSubject(year, studyPeriod, position)
                    }
                    button="x"
                  />
                ) : (
                  <EmptySubjectCard
                    key={position}
                    onAdd={() => addSubject(year, studyPeriod, position)}
                  />
                );
              })}
            </div>
          </div>
        );
      }
    }
    return null; // Default return in case something is undefined
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-planner-header text-white p-4 flex items-center">
        <div className="flex items-center space-x-4">
          <Image
            src="/unimelb.svg"
            alt="University of Melbourne"
            width={100}
            height={100}
          />
          <h1 className="text-3xl font-bold">My Course Planner</h1>
        </div>
      </header>

      {/* Main content area with grid */}
      <div className="flex-grow grid grid-cols-5 gap-4 p-8 pl-10">
        {/* Content - takes up 4 columns */}
        <div className="col-span-4 overflow-auto">
          {years.map((year) =>
            studyPeriods.map((studyPeriod) => {
              const semesterRow = getSemesterRow(year, studyPeriod);
              return semesterRow ? (
                <div
                  key={`${year}-${studyPeriod}`}
                  className="semester-row mb-6"
                >
                  {semesterRow}
                </div>
              ) : null;
            }),
          )}
        </div>

        {/* Sidebar - takes up 1 column */}
        <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-center mb-3">
            <Button
              variant={'resolve'}
              className="my-3 font-semibold text-lg"
              onClick={() => callResolve()} // Replace with your button logic
            >
              Resolve
            </Button>
          </div>
          <h2 className="text-lg font-bold mb-4">Degree Checklist</h2>
          <Rules progressions={progressions} ruleType="overall" />
          <Rules progressions={progressions} ruleType="discipline" />
          <Rules progressions={progressions} ruleType="breadth" />
          {/* <ul className="space-y-2">
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Complete core subjects</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Select major</span>
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Add electives</span>
            </li>
          </ul> */}
        </div>
      </div>

      <footer className="bg-planner-header text-white h-[7rem] p-4 flex items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default PlannerPage;
