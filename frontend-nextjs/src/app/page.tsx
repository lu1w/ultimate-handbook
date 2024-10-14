import React from 'react';
import Link from 'next/link';
import InfoForm from '@/components/home/infoForm';

export default function Home() {
  return (
    <div className="flex justify-center flex-col items-center">
      <h1>Welcome to the Course Planner</h1>
      <p>Please fill in your enrollment details.</p>
      <InfoForm />
      <nav>
        <ul>
          <li>
            <Link href="/planner">Go to Planner</Link>
          </li>
          <li>
            <Link href="/search">Go to Search</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
