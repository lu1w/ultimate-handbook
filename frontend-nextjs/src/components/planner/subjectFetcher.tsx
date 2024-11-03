import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { SubjectCardProps } from '../common/subjectCard';
import SubjectCard from '../common/subjectCard';
import { SERVER_URL } from '@/lib/utils';
import RepeatedSubjectAlert from '../common/repeatedSubjectAlert';


interface SubjectFetcherProps {
  subjectCode: string;
  userId?: string;
}

const SubjectFetcher: React.FC<SubjectFetcherProps> = ({ subjectCode, userId}) => {
  const [subjectData, setSubjectData] = useState<SubjectCardProps | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      const url = `${SERVER_URL}/v1/course/user/${userId}/prerequisites/${subjectCode}/autoassign`;
      const res = await axios.get(url);
      const [slot] = Object.keys(res.data);
      const subjectData = res.data[slot];
  
      const newSubjectInfo = { [slot]: subjectData };
      const nextRes = await axios.post(
        `${SERVER_URL}/v1/course/user/${userId}/add`,
        newSubjectInfo,
      );
      
      if (nextRes.status === 200) {
        location.reload();
      } else if (nextRes.status === 400) {
        setErrorMessage(nextRes.data.error);
        location.reload();
      }  
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        // Set the error message to display the dialog
        setErrorMessage(err.response.data.error);
      } else {
        console.error(err); 
      }
    }
  };


  useEffect(() => {
    const fetchSubject = async () => {
      console.log(`Fetching subject for code ${subjectCode}`);
      const levels = [parseInt(subjectCode.charAt(4), 10)];
      const studyPeriods = ['Summer Term', 'Semester 1', 'Winter Term', 'Semester 2'];
      const studyAreas = subjectCode.slice(0, 4);

      try {
        const url = `${SERVER_URL}/v1/search/conditions?input=${subjectCode}&levels=${levels}&studyPeriods=${studyPeriods.map(
          (sp) => sp.split(' ').join('_')
        )}&studyAreas=${studyAreas}`;

        const res = await axios.get(url);
        const result = res.data.subjects;

        if (result && result.length > 0) {
          setSubjectData({
            ...result[0],
            header: studyAreas,
            handleClick: handleClick,
            button: '+',
          });
        } else {
          setSubjectData(null);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubject();
  }, [subjectCode]);

  return (
    <>
      {subjectData && <SubjectCard {...subjectData} className="min-h-[12rem]" />}
      {errorMessage && (
        <RepeatedSubjectAlert
          message={errorMessage}
          onClose={() => setErrorMessage(null)} // Reset error message on close
        />
      )}
    </>
  );
};

export default SubjectFetcher;
