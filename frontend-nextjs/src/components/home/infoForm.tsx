'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { SERVER_URL } from '@/lib/utils';
import axios from 'axios';

import SelectPanel from './selectPanel';
import { Button } from '../ui/button';

const SELECT_PROMPT_CSS = 'mb-4 mt-10';

export default function InfoForm() {
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
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  async function handleDegreeSelection(degree: string) {
    degreeRef.current = degree;
    const res = await axios.get(
      `${SERVER_URL}/v1/home/majors?degree=${degreeRef.current}`,
    );
    setMajors(res.data.majors);
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    if (degreeRef.current === '') {
      alert('Please select a degree'); // TODO-future: make this alert box better
      return;
    } else if (majorRef.current === '') {
      alert(
        'Please select a major to make sure your major core is included in the plan',
      ); // TODO-future: make this alert box better
      return;
    }

    try {
      const res = await axios.post(
        `${SERVER_URL}/v1/course/main?degree=${degreeRef.current}&major=${majorRef.current}`,
      );

      /* Selected degree and major, go to planner with unique user ID */
      router.push(`/planner/${res.data.userId}`);
    } catch (err) {
      // TODO: handle error
      console.error(err);
    }
  }

  return (
    <form
      className="bg-home-background w-full px-10 rounded-lg flex flex-col"
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
      <Button variant="search" className="w-full my-10 font-bold" type="submit">
        Start Planning
      </Button>
    </form>
  );
}
