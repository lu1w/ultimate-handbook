'use client';

import React from 'react';
import axios from 'axios';

import { SERVER_URL } from '@/lib/utils';
import { Level, Availability } from '@/lib/constants';

import SearchBar from '@/components/search/searchBar';
import SearchFilters from '@/components/search/searchFilters';
import SearchResults from '@/components/search/searchResults';

// TODO: remove this mock data after the display is correctly set up
// this is for local testing only, for testing the display of the result grid
// let mockData = [
//   {
//     type: '',
//     subjectCode: 'SCIE10005',
//     level: '1',
//     subjectName: "Today's Science, Tomorrow's World",
//     points: '12.5',
//     availability: ['Summer term', 'Semester 1', 'Semester 2'],
//   },
//   {
//     type: '',
//     subjectCode: 'MAST10006',
//     level: '1',
//     subjectName: 'Calculus 2',
//     points: '12.5',
//     availability: ['Summer term', 'Semester 1', 'Semester 2'],
//   },
//   {
//     type: '',
//     subjectCode: 'COMP10002',
//     level: '1',
//     subjectName: 'Algorithms',
//     points: '12.5',
//     availability: ['Semester 2'],
//   },
//   {
//     type: '',
//     subjectCode: 'COMP10001',
//     level: '1',
//     subjectName: 'FOC',
//     points: '12.5',
//     availability: ['Summer term', 'Semester 1', 'Semester 2'],
//   },
//   {
//     type: '',
//     subjectCode: 'SWEN20003',
//     level: '2',
//     subjectName: 'Object Oriented',
//     points: '12.5',
//     availability: ['Summer term', 'Semester 1', 'Semester 2'],
//   },
//   {
//     type: '',
//     subjectCode: 'COMP30022',
//     level: '3',
//     subjectName: 'IT Project',
//     points: '12.5',
//     availability: ['Semester 2'],
//   },
// ];

let allStudyAreas: Array<string> = [];

export default function SearchPage() {
  /* Input query */
  const [input, setInput] = React.useState('');
  // const [query, setQuery] = React.useState('');
  const [result, setResult] = React.useState([]);

  /* Filter */
  const [levels, setLevels] = React.useState<Array<Level>>([1]);
  const [availabilities, setAvailabilities] = React.useState<
    Array<Availability>
  >(['Summer_Term', 'Semester_1', 'Winter_Term', 'Semester_2']);
  const [studyAreas, setStudyAreas] = React.useState<Array<String>>([]);

  /* Fetch subject data when the component mounts */
  React.useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/v1/search/`);
        setResult(response.data.subjects);
      } catch (err) {
        // TODO: Handle error
      }
    };
    fetchSubjects();
  }, []); // Empty dependency array - this effect only runs once when the component mounts

  /* Fetch study areas data when component mounts */
  React.useEffect(() => {
    const fetchStudyAreas = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/v1/search/studyarea`);
        console.log(`INFO -- study areas ${response.data.studyAreas}`);
        allStudyAreas = response.data.studyAreas; // initialization
        allStudyAreas.sort();
        setStudyAreas(allStudyAreas);
      } catch (err) {
        // TODO: Handle error
      }
    };
    fetchStudyAreas();
  }, []); // Empty dependency array - this effect runs once when the component mounts

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
        `input=${input}&levels=${levels}&availabilities=${availabilities}&studyAreas=${studyAreas}`;
      console.log(`INFO try sending query ${url} to the backend`);
      const res = await axios.get(url);
      setResult(res.data.subjects);
      // setQuery(input);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  }

  async function handleLevel() {}

  async function handleTerms() {}

  async function handleStudyArea() {}

  return (
    // <div className="flex flex-col h-screen">
    <div className="h-lvh">
      <div className="grid grid-rows-[1fr_10fr] grid-cols-[5fr_1fr] gap-4 pb-6 overflow-hidden h-full">
        <SearchBar
          className="col-span-2 col-start-1 -col-end-1"
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          input={input}
        />
        {/* <div className="grid grid-cols-[5fr_1fr] gap-8 pl-12 pr-8 my-6 overflow-scroll h-full"> */}
        <SearchResults className="ml-8 overflow-hidden" subjects={result} />
        <SearchFilters
          className="mr-8 overflow-y-scroll"
          allStudyAreas={allStudyAreas}
          handleLevel={handleLevel}
          handleTerms={handleTerms}
          handleStudyArea={handleStudyArea}
        />
        {/* </div> */}
        {/* <SearchResults searchResults={mockData} /> */}
      </div>
    </div>
  );
}
