import React from 'react';
import courseData from '../../mock-data/courseData';
import CourseCard from '../../components/Common/subject-card';

const PlannerPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courseData.map((course, index) => (
          <div key={index} className="w-full">
            <CourseCard
              type={course.type}
              code={course.code}
              level={course.level}
              name={course.name}
              points={course.points}
              term={course.term}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlannerPage;
