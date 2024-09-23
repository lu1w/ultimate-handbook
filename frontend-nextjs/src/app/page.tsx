import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Course Planner</h1>
      <p>Please fill in your enrollment details.</p>
      <nav>
        <ul>
          <li>
            <Link href="/PlannerPage">Go to Planner</Link>
          </li>
          <li>
            <Link href="/SearchPage">Go to Search</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
