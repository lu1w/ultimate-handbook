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
- The customised computation logic for each degree is currently in: `src/service/progressionService.js`

## Testing (backend/test)

Our backend application includes three main test suites, each designed to verify different aspects of the system to ensure reliability and correctness.

### 1. Course Route Tests (`course.route.test.mjs`)

**Purpose:** This test suite focuses on the core functionalities of the course-related API endpoints, ensuring that users can effectively manage their course planners.

**Key Tests:**

- **User Info Initialization:**
  - Verifies that the `/v1/course/main` endpoint correctly initializes user information, including degree and major.
  - Checks that the response includes the correct degree, major, compulsory subjects, and core subjects.
- **Adding a Subject:**
  - Tests the ability to add a subject to the planner at a specified slot using the `/v1/course/user/:userId/add` endpoint.
  - Ensures that the subject is correctly added to the planner and stored in the correct position.
- **Semester Validation:**
  - Checks that the system correctly flags a semester error when a subject is scheduled in a semester it's not offered.
  - Confirms that the `semesterError` flag is set when applicable.
- **Subject Type Determination:**
  - Verifies that the system correctly identifies the type of a subject (e.g., compulsory, core, discipline, breadth) when added to the planner.
  - Ensures that the `header` property reflects the correct subject type.
- **Removing a Subject:**
  - Tests the ability to remove a subject from the planner using the `/v1/course/user/:userId/remove/:slot` endpoint.
  - Ensures that the subject is properly removed and the planner is updated accordingly.

### 2. Progression Route Tests (`progression.route.test.mjs`)

**Purpose:** This test suite validates the progression rules and ensures that the system accurately calculates and displays the degree progression status for users.

**Key Test:**

- **Empty Planner Progression Check:**
  - Tests that the progression status is correctly displayed for a user with an empty planner.
  - Verifies that all progression requirements are identified and that the `fulfilled` status is correctly set (usually `false` for an empty planner).
  - Ensures that the system properly initializes progression categories such as `general`, `levelsRules`, `overall`, `discipline`, `breadth`, `degreeProgression`, and `distinctStudyArea`.

### 3. Search Route Tests (`search.route.test.mjs`)

**Purpose:** This test suite ensures that the search functionality works correctly, allowing users to search for subjects by code, name, and apply various filters to refine their search results.

**Key Tests:**

- **Loading All Subjects:**
  - Verifies that the `/v1/search/` endpoint correctly loads all subjects from the database when the search page is accessed.
  - Checks that the total number of subjects matches the expected count.
- **Search by Subject Code (Case-Insensitive):**
  - Tests the ability to search for a subject using its code, regardless of the case (e.g., "comp10002" should match "COMP10002").
  - Ensures that the correct subject is returned in the search results.
- **Search by Subject Name:**
  - Verifies that searching by subject name returns relevant subjects (e.g., searching for "linear algebra" should return subjects with that phrase in their name).
  - Checks that the returned subjects match the search criteria.
- **Search with Filters:**
  - Tests the functionality of applying filters such as levels, study periods, and study areas to the search query.
  - Ensures that the subjects returned meet all the specified filter conditions.
- **Combined Search and Filter Query:**
  - Confirms that the system handles combined input queries and filters properly, returning accurate and relevant results.
  - Verifies that the search results match both the input query and the applied filters.

# Backend Introduction

The backend of our application implements four main modules:

1. **Custom Planner**
2. **Search**
3. **Resolve**
4. **Display**

Each module serves specific functionalities that are integral to the overall system. Below is a detailed description of each module, including key algorithms, data handling mechanisms, and important routes.

## Custom Planner

The Custom Planner module allows users to manage their course plans by adding or removing subjects, viewing their planner, and initializing their basic information.

### Key Routes and Middlewares

- **Add Term to Planner**

  ```javascript
  router.post('/user/:userId/addTerm/:term', addTerm);
  ```

  Adds a new term to the user's planner.

- **Remove Term to Planner**

  ```javascript
  router.post('/user/:userId/removeTerm/:term', removeTerm);
  ```

  Removes a new term to the user's planner.

- **Remove Subject**

  ```javascript
  router.delete('/user/:userId/remove/:slot', removeSubject);
  ```

  This route allows a user to remove a subject from their planner by specifying the `userId` and the `slot` (position in the planner). The `removeSubject` middleware handles the logic for removing the subject.

- **Add Subject**

  ```javascript
  router.post(
    '/user/:userId/add',
    loadUserPlanner,
    addSubject,
    isValidAdd,
    giveTypeOfSubject,
    savePlanner
  );
  ```

  This route enables a user to add a subject to their planner. It uses a series of middlewares to ensure data integrity and proper handling:

  1. **loadUserPlanner**: Attempts to find the user's planner in the database and attaches it to the request object.
  2. **addSubject**: Adds the specified subject to the planner at the given slot.
  3. **isValidAdd**: Checks for any conflicts, such as time or semester errors, when adding the subject.
  4. **giveTypeOfSubject**: Determines the type of the subject (e.g., compulsory, elective, breadth, or discipline) by comparing it with the user's profile, which includes the major and faculty information saved during the planner's initialization.
  5. **savePlanner**: Saves the updated planner back to the MongoDB database.

### Key Algorithms and Logic

- **Subject Type Determination**

  The `giveTypeOfSubject` middleware plays a vital role in categorizing subjects. By comparing the subject being added with the user's degree and major information, it assigns the appropriate type. This is essential for validating the planner against degree requirements.

- **Conflict Detection**


  The `isValidAdd` middleware checks for scheduling conflicts, prerequisite issues, and ensures that give the error type to frontend 


## Resolve

The Resolve module is designed to address and fix any errors or conflicts in the user's course planner, such as scheduling conflicts or unmet prerequisites.

### Key Routes and Middlewares

- **Resolve Planner Issues**

  ```javascript
  router.post(
    '/user/:userId/resolve',
    loadUserPlanner,
    resolveMiddleware,
    checkOutComeAfterResolve
  );
  ```

  This route attempts to resolve issues in the user's planner. The middlewares involved are:

  1. **loadUserPlanner**: Loads the user's planner from the database.
  2. **resolveMiddleware**: Contains the logic to rearrange subjects and fix conflicts.
  3. **checkOutComeAfterResolve**: Checks the outcome of the resolution process and responds accordingly.

### Key Algorithms

- **Conflict Resolution Algorithm**

  The `resolveMiddleware` employs algorithms to rearrange subjects in the planner to satisfy all constraints, such as prerequisites and time slots, ensuring that the planner is valid and feasible.

## Search

The Search module allows users to retrieve subjects from the database based on various criteria such as subject name, subject code, levels, study periods, and study areas. It serves as the entry point for users to explore available subjects and refine their search using filters.

### Key Routes

- **Retrieve All Subjects**

  ```javascript
  router.get('/', async (req, res) => {
    // Fetches all subjects from the database
  });
  ```

- **Search Subjects with Conditions**

  ```javascript
  router.get('/conditions', async (req, res) => {
    // Searches for subjects based on query parameters
  });
  ```

- **Retrieve Study Areas**

  ```javascript
  router.get('/studyareas', async (req, res) => {
    // Retrieves all study areas from the database
  });
  ```

### Data Handling and Key Algorithms

- **Search Query Construction:**

  - The search functionality constructs MongoDB queries dynamically based on the user's input and selected filters.
  - It leverages MongoDB's query operators like `$in`, `$elemMatch`, and regular expressions to perform flexible and efficient searches.

## Display

The Display module provides endpoints for retrieving and displaying various data, such as core subjects for a major, prerequisites for a subject, and progression statistics.

### Key Routes

- **Get Planner**

  ```javascript
  router.get('/user/:userId/planner', getPlanner);
  ```

  This route retrieves the user's current planner based on the provided `userId`.

- **Initialize User Basic Information**

  ```javascript
  router.post('/main', setBasicInfo);
  ```

  This route initializes the user's basic information, including their degree and major, which are crucial for determining compulsory and core subjects.

- **Get User Basic Information**

  ```javascript
  router.get('/main/user/:userId', getBasicInfo);
  ```

  Retrieves the user's basic information based on their `userId`.


- **Get Progression Statistics**

  ```javascript
  router.get('/user/:userId/progressions', async (req, res) => {
    const { userId } = req.params;
    try {
      const progressions = await getProgressions(userId);
      res.status(200).send({ progressions });
    } catch (err) {
      res.status(500).send({ message: `Server error: ${err}` });
    }
  });
  ```


  Provides detailed progression statistics for a user, helping them understand their degree completion st   atus.


- **Get Core Subjects for a Major**

  ```javascript
  router.get('/cores/:major', async (req, res, next) => {
    // Fetches core subjects based on the major
  });
  ```

  Retrieves all core subjects associated with a given major.


- **Get Subject Prerequisites**

  ```javascript
  router.get('/prerequisites/:subjectCode', async (req, res, next) => {
    // Retrieves prerequisites for a given subject code
  });
  ```

  Returns all prerequisites for a specified subject code.

### Data Import Mechanism

- **Third-Party Data Integration**

  - The backend interacts with MongoDB collections such as `Subject`, `Major`, and `User` to retrieve and store data.
  - The backend ensures data consistency and integrity during these operations.

## Application Layers and Key Classes

The backend application is structured using Express.js and follows a modular approach with clear separation of concerns.

### Layers

1. **Routing Layer**

   - Defines the endpoints and associates them with the appropriate middleware functions.
   - Example:

     ```javascript
     router.post(
       '/user/:userId/add',
       loadUserPlanner,
       addSubject,
       isValidAdd,
       giveTypeOfSubject,
       savePlanner
     );
     ```

2. **Middleware Layer**

   - Contains functions that process requests and responses, such as `loadUserPlanner`, `addSubject`, and `isValidAdd`.
   - These middlewares handle data validation, business logic, and error handling.

3. **Controller Layer**

   - Functions that act as controllers to handle the core logic for each route.
   - Examples include `removeSubject`, `getPlanner`, and `setBasicInfo`.

4. **Data Access Layer**

   - Interacts with the MongoDB database using the `mongoClient`.
   - Functions retrieve and update data in collections like `Subject`, `Major`, and `User`.

### Key Classes and Functions

- **mongoClient**

  - A module that provides a connection to the MongoDB database and methods to access collections.
  - Ensures a single point of interaction with the database, promoting reusability and maintainability.

- **Middleware Functions**

  - **loadUserPlanner(req, res, next)**

    - Loads the user's planner from the database and attaches it to the request object.

  - **addSubject(req, res, next)**

    - Adds a subject to the user's planner.

  - **isValidAdd(req, res, next)**

    - Validates the addition of a subject to ensure no conflicts.

  - **giveTypeOfSubject(req, res, next)**

    - Determines the subject type based on the user's degree and major.

  - **savePlanner(req, res, next)**

    - Saves the updated planner back to the database.

- **Error Handling**

  - Custom error classes like `ApiError` are used to handle errors consistently across the application.
  - Errors are passed to the next middleware or sent as responses with appropriate status codes.

## Key Algorithms

- **Progression Calculation**

  - The `getProgressions` function calculates the user's degree progression status, considering compulsory subjects, breadth requirements, and level rules.
  - It aggregates data from the user's planner and compares it against degree requirements to provide detailed statistics.

  - **Example Output:**

    ```json
    {
      "progressions": {
        "general": {
          "compulsory": {
            "stats": "Compulsory Subject: SCIE10005",
            "fulfilled": true
          },
          "breadth": {
            "stats": "0 / 50(min) to 62.5(max) Credit Points of Breadth Subject",
            "fulfilled": false
          }
        },
        "levelsRules": {
          "overall": {
            "level1": {
              "stats": "0 / 125(max) Credit Points of Level 1 Subject",
              "fulfilled": true
            }
          },
          "discipline": {
            "level1": {
              "stats": "0 / 62.5(min) Credit Points of Level 1 Discipline Subject",
              "fulfilled": false
            },
            "level2": {
              "stats": "0 / 62.5(min) Credit Points of Level 2 Discipline Subject",
              "fulfilled": false
            },
            "level3": {
              "stats": "0 / 75(min) Credit Points of Level 3 Discipline Subject",
              "fulfilled": false
            }
          },
          "breadth": {
            "level1": {
              "stats": "0 / 25(max) Credit Points of Level 1 Breadth Subject",
              "fulfilled": true
            }
          },
          "degreeProgression": {},
          "distinctStudyArea": {}
        }
      }
    }
    ```

- **Prerequisite Checking**

  - When adding a subject, the system checks for prerequisites by querying the `Subject` collection.
  - Ensures that the user has met all prerequisites before allowing the addition of a subject.

- **Conflict Resolution Algorithm**

  - The `resolveMiddleware` rearranges subjects in the planner to satisfy all constraints.
  - It addresses scheduling conflicts, prerequisite issues, and ensures that the planner is valid and feasible.

## Data Importing Mechanism

- **Third-Party Data Integration**

  - Data from third-party systems (e.g., university course catalogs) is imported into the MongoDB collections.
  - Scripts or services are used to fetch and parse data, which is then stored in collections like `Subject` and `Major`.
  - Regular updates ensure that the data remains current.

- **Data Consistency**

  - The backend ensures data consistency and integrity during import operations.
  - Validations are performed to prevent duplicate entries and maintain data quality.
