'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SERVER_URL, CLIENT_URL } from '@/lib/utils';
import axios from 'axios';

import SelectPanel from './selectPanel';
import { Button } from '../ui/button';

export default function CourseForm() {
  const degreeRef = useRef<string>('');
  const majorRef = useRef<string>('');

  const [allDegrees, setAllDegrees] = useState<Array<string>>([]);
  const [majors, setMajors] = useState<Array<string>>([]);

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

  async function handleSubmit() {
    if (degreeRef.current === '' || majorRef.current === '') {
      alert('Please select a degree and a major for your best experience'); // TODO-future: make this alert box better
    }
    try {
      const url = `${SERVER_URL}/v1/course/main?degree=${degreeRef.current}&majorName=${majorRef.current}`;
      const res = await axios.get(url);

      /* Selected degree and major, go to planner */
      redirect(`localhost:3000/planner`);
    } catch (err) {
      // TODO: handle error
    }
  }

  return (
    <form
      className="bg-home-background p-10 rounded-lg flex flex-col"
      onSubmit={handleSubmit}
    >
      {/* Degree Selection */}
      <h1>Select your degree</h1>
      <SelectPanel
        placeholder="Select your degree"
        allOptions={allDegrees}
        handleSelection={handleDegreeSelection}
      />

      {/* Major Selection */}
      <h1>Select your major</h1>
      <SelectPanel
        placeholder="Select your major"
        allOptions={majors}
        handleSelection={(major) => {
          majorRef.current = major;
        }}
      />

      {/* Submit button */}
      <Button variant="search" className="m-8 font-bold" type="submit">
        Start Planning
      </Button>
    </form>
  );
}
