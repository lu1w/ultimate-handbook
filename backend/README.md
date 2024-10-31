# About The Project

This is the backend for Unimelb Course Planner web app.

## Run Locally

1. Make sure you are in the directory `ultimate-handbook/backend`
2. Install all the dependencies using `npm install`
3. Run the server locally `npm run dev`

## API Documentation

1. Run the server locally
2. View the public API documentations at `http://localhost:4000/api-docs/`

## For Developers

### Course Progression Computation

- Currently there are only progression calculations for Bachelor of Science.
- The rules are communicated in a generalized way, but there might be other types of progression rule in other degrees which are not considered in the current codebase.
- Add customised computation logic for other degrees in `src/service/progressionService.js`
