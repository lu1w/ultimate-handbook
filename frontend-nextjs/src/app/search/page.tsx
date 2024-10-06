'use client';

import React from 'react';
import axios from 'axios';

import { SERVER_URL } from '@/lib/utils';
import { Level, Availability } from '@/lib/constants';

import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';

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

function SearchPage() {
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
    // Create an async function to fetch data
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/v1/search/`);
        setResult(response.data.subjects);
      } catch (err) {
        // TODO: Handle error
      }
    };
    fetchData();
  }, []); // Empty dependency array - this effect only runs once when the component mounts

  /* Fetch study areas data when component mounts */
  React.useEffect(() => {
    // Create an async function to fetch data
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/v1/search/studyarea`);
        console.log(`INFO -- study areas ${response.data.studyAreas}`);
        setStudyAreas(response.data.studyAreas);
      } catch (err) {
        // TODO: Handle error
      }
    };
    fetchData();
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

  async function handleCheck() {}

  return (
    <div>
      <SearchBar
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        input={input}
      />
      <SearchFilters handleCheck={handleCheck} />
      <SearchResults subjects={result} />
      {/* <SearchResults searchResults={mockData} /> */}
    </div>
  );
}

export default SearchPage;
