// import '@styles/SearchResults.css';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import axios from 'axios';

import SubjectCard from '@/components/common2/subjectCard';
import { Subject } from '@/lib/objectSchema';
import { SERVER_URL } from '@/lib/utils';

interface SearchResultsProps {
  className?: string | undefined;
  subjects: Array<Subject>;
  userId: string;
}

export default function SearchResults({
  className,
  subjects,
  userId,
}: SearchResultsProps) {
  // let subject = searchResults[0];
  console.log(
    `INFO: searchResults passed into SearchResults<> is has length ${subjects.length} ${JSON.stringify(subjects)}`,
  );

  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const searchParams = useSearchParams();
  // const userId = pathname;
  const slot: string = searchParams.get('slot')!;
  // const userIds = searchParams.get('userId');

  async function handleAdd(subject: Subject) {
    try {
      const newSubjectInfo: { [slot: string]: Subject } = {};
      newSubjectInfo[slot] = subject;
      await axios.post(
        `${SERVER_URL}/v1/course/user/${userId}/add`,
        newSubjectInfo,
      );
      router.push(`/planner/${userId}`);
    } catch (err) {
      console.error(err);
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