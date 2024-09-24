import React from 'react';
import courseData from '@/mock-data/courseData';
import SubjectCard from '@components/common/subjectCard';
import EmptySubjectCard from '@/components/planner/emptySubjectCard';

const PlannerPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courseData.map((course, index) => (
          <div key={index} className="w-full">
            <SubjectCard
              type={course.type}
              code={course.code}
              level={course.level}
              name={course.name}
              points={course.points}
              term={course.term}
            />
          </div>
        ))}
        <EmptySubjectCard></EmptySubjectCard>
      </div>
    </div>
    
  );
};

export default PlannerPage;
