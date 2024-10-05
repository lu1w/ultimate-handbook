'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import SubjectCard from '@/components/Common/subjectCard';
import EmptySubjectCard from '@/components/planner/emptySubjectCard';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import courseData from '@/mock-data/courseData';

interface SubjectCard {
  type: string;
  code: string;
  level: string;
  points: string;
  name: string;
  term: string[];
  coordinatorName: string;
}

const PlannerPage: React.FC = () => {
  const numSubjects = 32;
  const numRows = numSubjects / 4;
  const [subjects, setSubjects] = React.useState<(SubjectCard | null)[]>(
    Array(numSubjects)
      .fill(null)
      .map((_, index) => courseData[index] || null),
  );

  const handleClose = (index: number) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = null;
    setSubjects(updatedSubjects);
  };

  const handleAddSubject = (index: number) => {
    const newSubject: SubjectCard = {
      type: 'DISCIPLINE',
      code: 'NEW10001',
      level: '1',
      points: '12.5',
      name: 'New Subject',
      term: ['Semester 1'],
      coordinatorName: 'John Doe',
    };
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = newSubject;
    setSubjects(updatedSubjects);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
    gap: '1rem',
  };

  return (
    <div className="flex flex-col space-y-7">
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
      <div className="grid grid-cols-[4fr_1fr] gap-8 pl-12 pr-8">
        {/* Planner Grid */}
        <div style={gridStyle}>
          {subjects.map((subject, index) => (
            <div key={index}>
              {subject ? (
                <SubjectCard {...subject} onClose={() => handleClose(index)} />
              ) : (
                <EmptySubjectCard onAdd={() => handleAddSubject(index)} />
              )}
            </div>
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
    </div>
  );
};

export default PlannerPage;
