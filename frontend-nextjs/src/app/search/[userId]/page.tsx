'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

import { SERVER_URL } from '@/lib/utils';
import { Level, StudyPeriod } from '@/lib/constants';

import SearchBar from '@/components/search/searchBar';
import SearchFilters from '@/components/search/searchFilters';
import SearchResults from '@/components/search/searchResults';

const allLevels: Array<Level> = Object.values(Level);
const allStudyPeriod: Array<StudyPeriod> = Object.values(StudyPeriod);
const allStudyAreas: Array<string> = [];

export default function SearchPage({ params }: { params: { userId: string } }) {
  /* Input query */
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState([]);

  /* Filter */
  const [levels, setLevels] = useState<Set<Level>>(new Set<Level>(allLevels));
  const [studyPeriods, setStudyPeriods] = useState<Set<StudyPeriod>>(
    new Set<StudyPeriod>(allStudyPeriod),
  );
  const [studyAreas, setStudyAreas] = useState<Set<string>>(new Set<string>());

  /* Fetch subject data when the component mounts */
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/v1/search/`);
        setResult(response.data.subjects);
      } catch (err) {
        // TODO: Handle error
      }
    };
    fetchSubjects();
  }, []);

  /* Fetch study areas data when component mounts */
  useEffect(() => {
    const fetchStudyAreas = async () => {
      try {
        /* Get studyareas from database */
        const res = await axios.get(`${SERVER_URL}/v1/search/studyareas`);

        /* Every component is called twice to check for side effects, thus 
          we want to make sure the the array is cleared before initialize */
        allStudyAreas.splice(0, allStudyAreas.length);
        res.data.studyAreas.map((area: string) => allStudyAreas.push(area));
        allStudyAreas.sort();

        setStudyAreas(new Set<string>(allStudyAreas));
      } catch (err) {
        // TODO: Handle error
      }
    };
    fetchStudyAreas();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(
      `INFO handleChange(): event.target.value: ${event.target.value}`,
    );
    setInput(event.target.value);
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    console.log(`INFO handleSubmit()`);
    event.preventDefault(); // prevent the default refresh behavior of the event from the <form> element

    // Send the input query to the backend for database access
    try {
      const url =
        `${SERVER_URL}/v1/search/conditions?` + // URL on two lines since it's too long
        // TODO-fix: maybe i dont neex the mapping from ' ' to '_'?
        `input=${input}&levels=${Array.from(levels)}&studyPeriods=${Array.from(studyPeriods).map((sp) => sp.split(' ').join('_'))}&studyAreas=${Array.from(studyAreas)}`;
      console.log(`INFO try sending query ${url} to the backend`);
      const res = await axios.get(url);
      setResult(res.data.subjects);
      // setQuery(input);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  }

  return (
    <div className="flex flex-col h-lvh">
      {/* <div className="h-lvh pb-10"> */}
      {/* <div className="grid grid-rows-[1fr_10fr] grid-cols-[5fr_1fr] pd-10 gap-4 overflow-hidden h-lvh"> */}
      <SearchBar
        // className="col-span-2 col-start-1 -col-end-1"
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        input={input}
      />
      <div className="grid grid-cols-[5fr_1fr] gap-8 pl-8 pr-6 my-6 overflow-hidden h-full">
        <SearchResults
          className="h-3/4"
          subjects={result}
          userId={params.userId}
        />
        <SearchFilters
          className="overflow-y-scroll mb-48"
          allStudyAreas={allStudyAreas}
          handleLevel={(event, level) =>
            event.target.checked ? levels.add(level) : levels.delete(level)
          }
          handleStudyPeriod={(event, studyPeriod) =>
            event.target.checked
              ? studyPeriods.add(studyPeriod)
              : studyPeriods.delete(studyPeriod)
          }
          handleStudyArea={(event, studyArea) =>
            event.target.checked
              ? studyAreas.add(studyArea)
              : studyAreas.delete(studyArea)
          }
          clearLevels={() => levels.clear()}
          clearStudyPeriods={() => studyPeriods.clear()}
          clearStudyAreas={() => studyAreas.clear()}
        />
      </div>
    </div>
    // </div>
  );
}
