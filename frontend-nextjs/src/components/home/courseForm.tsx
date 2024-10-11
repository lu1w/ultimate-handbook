'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SERVER_URL, CLIENT_URL } from '@/lib/utils';
import axios from 'axios';

import SelectPanel from './selectPanel';
import { Button } from '../ui/button';

const allCourses = ['Science', 'Commerce'];
const allMajors: Array<string> = [];

export default function CourseForm() {
  const degreeRef = useRef<string>('');
  const majorRef = useRef<string>('');

  async function handleSubmit() {
    if (degreeRef.current === '' || majorRef.current === '') {
      alert('Please select a degree and a major for your best experience'); // TODO-future: make this alert box better
    }
    try {
      const url = `${SERVER_URL}/v1/course/main?degree=${degreeRef.current}&majorName=${majorRef.current}`;
      const res = await axios.get(url); // get the major core options

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
        allOptions={allCourses}
        handleSelection={(degree) => {
          degreeRef.current = degree;
        }}
      />

      {/* Major Selection */}
      <h1>Select your major</h1>
      <SelectPanel
        placeholder="Select your major"
        allOptions={allMajors}
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
