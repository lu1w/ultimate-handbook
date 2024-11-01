import React from 'react';
import Image from 'next/image';
import InfoForm from '@/components/home/infoForm';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <header className="bg-planner-header text-white w-full p-6 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <Image
            src="/unimelb.svg"
            alt="University of Melbourne"
            width={60}
            height={60}
          />
          <h1 className="text-3xl font-bold">My Course Planner</h1>
        </div>
      </header>
      <main className="flex flex-col items-center mt-8 space-y-4">
        <h1 className="text-2xl font-semibold">Welcome to the Course Planner</h1>
        <p className="text-center">Please fill in your enrollment details.</p>
        <InfoForm />
      </main>
    </div>
  );
}
