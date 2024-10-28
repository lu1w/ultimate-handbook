import React from 'react';
import InfoForm from '@/components/home/infoForm';

export default function Home() {
  return (
    <div className="flex justify-center flex-col items-center">
      <h1>Welcome to the Course Planner</h1>
      <p>Please fill in your enrollment details.</p>
      <InfoForm />
    </div>
  );
}
