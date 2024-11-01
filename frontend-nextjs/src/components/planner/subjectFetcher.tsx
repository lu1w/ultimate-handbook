import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { SubjectCardProps } from '../common/subjectCard';
import SubjectCard from '../common/subjectCard';
import { SERVER_URL } from '@/lib/utils';
import { useRouter} from 'next/navigation';


interface SubjectFetcherProps {
  subjectCode: string;
  userId?: string;
}

const SubjectFetcher: React.FC<SubjectFetcherProps> = ({ subjectCode, userId}) => {
  const router = useRouter();
  const [subjectData, setSubjectData] = useState<SubjectCardProps | null>(null);

  const handleClick = async () => {
    try {
      const url = `${SERVER_URL}/v1/course/user/${userId}/prerequisites/${subjectCode}/autoassign`;
      await axios.get(url);
      location.reload();
    } catch (error) {
      console.error('Error during auto-assign:', error);
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

  return subjectData ? <SubjectCard {...subjectData} className='min-h-[12rem]' /> : null;
};

export default SubjectFetcher;
