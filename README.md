# ultimate-handbook

Unimelb COMP30020 IT Project

## Project Overview

This project aims to modernize and enhance the University of Melbourne course planner by providing a more intuitive user interface (UI) and enhanced functionality. The application is designed to simplify the process of planning, searching, and adding subjects by offering a streamlined and user-friendly experience.

## Features

- **New UI**: A redesigned, more user-friendly interface for easier navigation and planning.
- **Prerequisite Management**: New functionality allows users to quickly add prerequisite subjects to their course plan.
- **Conflict Resolution**: Provide a resolve button that solves scheduling conflicts automatically.
- **Responsive Design**: Use the app on any device.

## To run backend server locally at `localhost:4000`:

1. Go to the backend directory: `cd backend/`
2. Install the packages (skip this step if you have the packages already): `npm i`
3. Run the server: `npm run dev`

## To connect a frontend client locally at `localhost:3000`:

1. Go to the frontend directoyr: `cd frontend-nextjs/`
2. Install the packages (skip this step if you have the packages already): `npm i`
3. Start the react project: `npm run dev`

To link to local backend server, go to `/frontend-nextjs/src/lib/utils.ts` and change the `SERVER_URL` to the localhost with corresponding port number.

## Test backend

1. Go to the backend directory
2. Run command `npm run mocha`

## Tech Stack

**Frontend**

- React framework: Next.js
- Tailwind CSS + typescript + HTML
- Component library: shadcn

**Backend**

- Node.js
- PyGad

**Database**

- MongoDB
