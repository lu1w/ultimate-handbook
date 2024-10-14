'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import axios from 'axios';

import { Button } from '@/components/ui/button';
import SubjectCard from '@/components/common/subjectCard';
import EmptySubjectCard from '@/components/planner/emptySubjectCard';
import subjectPlanner from '@/mock-data/courseData';

import { SERVER_URL } from '@/lib/utils';

interface Subject {
  header: string;
  code: string;
  level: string;
  points: string;
  name: string;
  studyPeriods: string[];
  coordinatorName: string;
}

enum Term {
  summer = 'su',
  sem1 = 's1',
  winter = 'wi',
  sem2 = 's2',
}
type Year = 'y1' | 'y2' | 'y3';

enum TermDisplay {
  'su' = 'Summer Term',
  's1' = 'Semester 1',
  'wi' = 'Winter Term',
  's2' = 'Semester 2',
}

const PlannerPage: React.FC = () => {
  const [visibleTerms, setVisibleTerms] = useState<Record<string, boolean>>({});

  const [planner, setPlanner] = useState({});

  const years: Year[] = ['y1', 'y2', 'y3'];
  const terms: Term[] = Object.values(Term);

  useEffect(() => {
    const initialVisibleTerms: Record<string, boolean> = {};
    years.forEach((year) => {
      ['summer', 'winter'].forEach((term) => {
        const key = `${year}${term}` as keyof typeof subjectPlanner;
        const termData = subjectPlanner[key];
        if (termData) {
          const hasNonEmptySubject = Object.values(termData).some(
            (subject) => subject && Object.keys(subject).length > 0,
          );
          initialVisibleTerms[`${year}${term}`] = hasNonEmptySubject;
        }
      });
    });
    setVisibleTerms(initialVisibleTerms);
  }, []);

  /* Initialize planner data from backend */
  useEffect(() => {
    const fetchPlanner = async () => {
      try {
        const planner = await axios.get(`${SERVER_URL}/v1/course/main`);
        setPlanner(planner);
      } catch (err) {
        // TODO: handle error
      }
    };
    fetchPlanner();
  }, []);

  const getSubject = (
    year: Year,
    term: Term,
    period: string,
  ): Subject | null | undefined => {
    const key = `${year}${term}` as keyof typeof subjectPlanner;
    const termData = subjectPlanner[key];
    if (!termData) return undefined;
    const subject = termData[period as keyof typeof termData];
    return subject && Object.keys(subject).length > 0
      ? (subject as Subject)
      : subject === undefined
        ? undefined
        : null;
  };

  const router = useRouter();

  const addSubject = (year: Year, term: Term, period: string) => {
    router.push(`/search/?slot=${year}${term}${period}`);
    const newSubject: Subject = {
      header: 'DISCIPLINE',
      code: 'SUBJ1001',
      level: '1',
      points: '12.5',
      name: 'New Subject',
      studyPeriods: ['Semester 1'],
      coordinatorName: 'TBA',
    };
    const key = `${year}${term}` as keyof typeof subjectPlanner;
    if (subjectPlanner[key]) {
      (subjectPlanner[key] as any)[period] = newSubject;
    }
    setVisibleTerms((prev) => ({ ...prev, [`${year}${term}`]: true }));
  };

  const removeSubject = (year: Year, term: Term, period: string) => {
    const key = `${year}${term}` as keyof typeof subjectPlanner;
    if (subjectPlanner[key]) {
      (subjectPlanner[key] as any)[period] = {};
    }
    // Check if there are any non-empty subjects left in the term
    const termData = subjectPlanner[key];
    const hasNonEmptySubject = Object.values(termData).some(
      (subject) => subject && Object.keys(subject).length > 0,
    );
    setVisibleTerms((prev) => ({
      ...prev,
      [`${year}${term}`]: hasNonEmptySubject,
    }));
  };

  const toggleTerm = (year: Year, term: Term) => {
    setVisibleTerms((prev) => ({
      ...prev,
      [`${year}${term}`]: !prev[`${year}${term}`],
    }));
  };

  const getYear = (year: Year) => {
    switch (year) {
      case 'y1':
        return 2024;
      case 'y2':
        return 2025;
      case 'y3':
        return 2026;
      default:
        return 2024;
    }
  };

  const getAvailablePeriods = (year: Year, term: Term): string[] => {
    const key = `${year}${term}` as keyof typeof subjectPlanner;
    const termData = subjectPlanner[key];
    if (!termData) return [];
    return ['p1', 'p2', 'p3', 'p4'].filter((p) => p in termData);
  };

  return (
    <div className="flex flex-col space-y-4">
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

      {/* Content */}
      <div className="grid grid-cols-[4fr_1fr] gap-8 pl-12 pr-8 pb-8">
        {/* Planner Grid */}
        <div className="space-y-4">
          {years.map((year) => (
            <React.Fragment key={year}>
              {terms.map((term) => (
                <div key={`${year}-${term}`} className="mb-8">
                  <div className="flex items-center mb-2">
                    <div className="font-bold">
                      {getYear(year)} {TermDisplay[term]}
                    </div>
                    {(term === Term.summer || term === Term.winter) && (
                      <Button
                        onClick={() => toggleTerm(year, term)}
                        variant="outline"
                        size="sm"
                        className="ml-2 font-bold"
                      >
                        {visibleTerms[`${year}${term}`] ? 'Remove' : 'Add'}
                      </Button>
                    )}
                  </div>
                  {((term !== Term.summer && term !== Term.winter) ||
                    visibleTerms[`${year}${term}`]) && (
                    <div className="grid grid-cols-4 gap-4 min-h-[50%]">
                      {getAvailablePeriods(year, term).map((period) => (
                        <div
                          key={`${year}-${term}-${period}`}
                          className="min-h-[15rem]"
                        >
                          {getSubject(year, term, period) === null ? (
                            <EmptySubjectCard
                              onAdd={() => addSubject(year, term, period)}
                            />
                          ) : getSubject(year, term, period) ? (
                            <SubjectCard
                              {...(getSubject(year, term, period)! as Subject)}
                              handleClick={() =>
                                removeSubject(year, term, period)
                              }
                              button="✕"
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-full bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Plan Checklist</h2>
          <ul className="space-y-2">
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
          </ul>
        </div>
      </div>

      <footer className="bg-planner-header text-white h-[7rem] p-4 flex items-center justify-center"></footer>
    </div>
  );
};

export default PlannerPage;
