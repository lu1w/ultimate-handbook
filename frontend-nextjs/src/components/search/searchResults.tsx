// import '@styles/SearchResults.css';

import React from 'react';

import SubjectCard from '@/components/common/subjectCard';
import { SubjectFields } from '@/lib/dbSchema';

interface SearchResultsProps {
  className?: string | undefined;
  subjects: Array<SubjectFields>;
}

export default function SearchResults({
  className,
  subjects,
}: SearchResultsProps) {
  // let subject = searchResults[0];
  console.log(
    `INFO: searchResults passed into SearchResults<> is has length ${subjects.length} ${JSON.stringify(subjects)}`,
  );
  return (
    <div className={className}>
      {/* Text message - number of results */}
      <p className="w-full text-center bg-search-muted text-white p-2 rounded-xl">
        {subjects.length} results found
        {/* {query
          ? `${subjects.length} results found`
          : 'please enter your subject'} */}
      </p>

      {/* Subject results  */}
      <div className="py-4 grid grid-cols-4 gap-4 h-lvh overflow-x-hidden">
        {/* <h1>Subjects:{JSON.stringify(subjects)}</h1> */}
        {subjects.map((subject) => (
          <SubjectCard
            key={subject._id}
            // TODO-future: mapping code to study area
            header={subject.subjectCode.substring(0, 4)}
            name={subject.subjectName}
            code={subject.subjectCode}
            level={subject.level}
            points={subject.points}
            availability={
              subject.availability // TODO: ask Weihan why are some subject availability empty
                ? subject.availability.map((t) => t.toString())
                : []
            }
            coordinatorName={
              subject.coordinator ? Object.values(subject.coordinator)[0] : null
            }
          />
        ))}
      </div>
    </div>
  );
}
