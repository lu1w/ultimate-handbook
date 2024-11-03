import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import axios from 'axios';

import SubjectCard from '@/components/common/subjectCard';
import { Subject } from '@/lib/objectSchema';
import { SERVER_URL } from '@/lib/utils';
import RepeatedSubjectAlert from '../common/repeatedSubjectAlert';

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
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const slot: string = searchParams.get('slot')!;

  async function handleAdd(subject: Subject) {  
    try {
      const newSubjectInfo: { [slot: string]: Subject } = {};
      newSubjectInfo[slot] = subject;
      
      const res = await axios.post(
        `${SERVER_URL}/v1/course/user/${userId}/add`,
        newSubjectInfo,
      );

      // Redirect if the addition was successful
      if (res.status === 200) {
        router.push(`/planner/${userId}`);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorResponse = err.response;
        if (errorResponse && errorResponse.status === 400) {
          // Set the error message to display the dialog
          setErrorMessage(errorResponse.data.error);
        } else {
          console.error('Axios Error:', err); 
        }
      } else {
        console.error('Unexpected error:', err);
      }
    }
  }

  return (
    <div className={className}>
      {/* Render the alert dialog if there is an error message */}
      {errorMessage && (
        <RepeatedSubjectAlert
          message={errorMessage}
          onClose={() => setErrorMessage(null)}  // Reset error message on close
        />
      )}

      {/* Text message - number of results */}
      <p className="w-full text-center bg-search-muted text-white p-2 rounded-xl">
        {subjects.length} results found
      </p>

      {/* Subject results */}
      <div className="h-lvh overflow-y-scroll overflow-x-hidden px-4 pb-56">
        <div className="py-4 grid grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              header={subject.subjectCode.substring(0, 4)}
              subjectName={subject.subjectName}
              subjectCode={subject.subjectCode}
              level={subject.level}
              points={subject.points}
              studyPeriod={
                subject.studyPeriod
                  ? subject.studyPeriod.map((sp) => sp.toString())
                  : []
              }
              handleClick={() => handleAdd(subject)}
              button="+"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
