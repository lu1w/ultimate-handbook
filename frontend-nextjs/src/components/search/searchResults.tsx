// import '@styles/SearchResults.css';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import axios from 'axios';

import SubjectCard from '@/components/common/subjectCard';
import { Subject } from '@/lib/objectSchema';
import { SERVER_URL } from '@/lib/utils';
import assert from 'assert';

interface SearchResultsProps {
  className?: string | undefined;
  subjects: Array<Subject>;
}

export default function SearchResults({
  className,
  subjects,
}: SearchResultsProps) {
  // let subject = searchResults[0];
  console.log(
    `INFO: searchResults passed into SearchResults<> is has length ${subjects.length} ${JSON.stringify(subjects)}`,
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const slot: string = searchParams.get('slot')!;

  async function handleAdd(subject: Subject) {
    try {
      const newSubjectInfo: any = {};
      newSubjectInfo[slot] = subject;
      await axios.post(`${SERVER_URL}/v1/course/add`, newSubjectInfo);
      router.push('/planner');
    } catch (err) {
      // TODO: handle error
    }
    return;
  }
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
      <div className="h-lvh overflow-y-scroll overflow-x-hidden px-4 pb-56">
        <div className="py-4 grid grid-cols-4 gap-4">
          {/* <h1>Subjects:{JSON.stringify(subjects)}</h1> */}
          {subjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              // TODO-future: mapping code to study area
              header={subject.subjectCode.substring(0, 4)}
              subjectName={subject.subjectName}
              subjectCode={subject.subjectCode}
              level={subject.level}
              points={subject.points}
              studyPeriod={
                subject.studyPeriod // TODO: ask Weihan why are some subject availability empty
                  ? subject.studyPeriod.map((sp) => sp.toString())
                  : []
              }
              // TODO: the coordinator is going to be in the semester bubble, so we should be passing only coordinator name
              // coordinatorName={
              //   subject.coordinator
              //     ? Object.values(subject.coordinator)[0]
              //     : null
              // }
              handleClick={() => handleAdd(subject)}
              button="+"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
