'use client';

import React, { useRef, useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';

import { SERVER_URL, CLIENT_URL } from '@/lib/utils';
import axios from 'axios';

import SelectPanel from './selectPanel';
import { Button } from '../ui/button';

const SELECT_PROMPT_CSS = 'mb-4 mt-10';

export default function CourseForm() {
  const degreeRef = useRef<string>('');
  const majorRef = useRef<string>('');

  const [allDegrees, setAllDegrees] = useState<Array<string>>([]);
  const [majors, setMajors] = useState<Array<string>>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/v1/home`);
        if (allDegrees.length === 0) {
          setAllDegrees(res.data.courseNames);
          console.log(`"courses after push" ${allDegrees}`);
          allDegrees.sort();
        }
      } catch (err) {
        // TODO: handle error
      }
    };
    fetchCourses();
  }, []);

  async function handleDegreeSelection(degree: string) {
    degreeRef.current = degree;
    console.log(
      `INFO handle degree change triggered with degree ${degreeRef.current}`,
    );
    const res = await axios.get(
      `${SERVER_URL}/v1/home/majors?degree=${degreeRef.current}`,
    );
    setMajors(res.data.majors);
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    // router.push('/planner');
    if (degreeRef.current === '' || majorRef.current === '') {
      alert('Please select a degree and a major for your best experience'); // TODO-future: make this alert box better
    }
    try {
      // TODO: uncomment this when the backend API is fixed
      // const url = `${SERVER_URL}/v1/course/main?degree=${degreeRef.current}&majorName=${majorRef.current}`;
      // const res = await axios.get(url);

      /* Selected degree and major, go to planner */
      router.replace('/planner');
    } catch (err) {
      // TODO: handle error
      console.log(err);
    }
  }

  return (
    <form
      className="bg-home-background w-1/3 px-10 rounded-lg flex flex-col"
      onSubmit={handleSubmit}
    >
      {/* Degree Selection */}
      <h1 className={SELECT_PROMPT_CSS}>Select your degree</h1>
      <SelectPanel
        placeholder="Select your degree"
        allOptions={allDegrees}
        handleSelection={handleDegreeSelection}
      />

      {/* Major Selection */}
      <h1 className={SELECT_PROMPT_CSS}>Select your major</h1>
      <SelectPanel
        placeholder="Select your major"
        allOptions={majors}
        handleSelection={(major) => {
          majorRef.current = major;
        }}
      />

      {/* Submit button */}
      <Button variant="search" className="w-full my-20 font-bold" type="submit">
        Start Planning
      </Button>
    </form>
  );
}
