**Welcome to the Frontend for the Unimelb Course Planner!**

## Table of Content

- [Table of Content](#table-of-content)
- [About The Project](#about-the-project)
- [Run the Project](#run-the-project)
  - [Locally](#locally)
  - [Deployment](#deployment)
- [For Developers](#for-developers)
  - [Home Page](#home-page)
  - [Planner Page](#planner-page)
    - [1. Subject Card](#1-subject-card)
    - [2. Empty Subject Card](#2-empty-subject-card)
    - [3. Prerequisite Display](#3-prerequisite-display)
    - [4. Progression Rules](#4-progression-rules)
    - [5. Planner Page](#5-planner-page)
  - [Search Page](#search-page)
    - [1. Search Bar and Search Filters](#1-search-bar-and-search-filters)
    - [2. Search Results](#2-search-results)
    - [3. Search Page](#3-search-page)
  - [Styling](#styling)
    - [tailwind.config.ts](#tailwindconfigts)
    - [constants and utils.ts](#constants-and-utilsts)
  - [Future Improvement Considerations](#future-improvement-considerations)

## About The Project

This is the frontend for Unimelb Course Planner web app.

The frontend comprises of 3 pages:

- Home page
- Planner page
- Search page

## Run the Project

### Locally

To run the frontend server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment

This project is currently deployed on Vercel: [https://ultimate-handbook.vercel.app/](https://ultimate-handbook.vercel.app/)

## For Developers

### Home Page

- The home page acts as an entry point, and allows users to select their degree and an optional major.
- Main display of the page is defined in `src/app/page.tsx`.
- User cannot proceed without a degree. If the user skips the major selection, an alert will notify them before entering planner.
- This logic is defined in `src/components/home/infoForm.tsx`. This component communicates with backend to gather degree and major information, record selection, and render it with selectPanel component in `src/components/home/selectPanel.tsx`

### Planner Page

#### 1. Subject Card

**Purpose:** The **Subject Card** component is designed to display subject information in a card format, for use in various contexts such as planner subject slots, the search page, and prerequisite displays.

- **Header**: The header indicates the subject type, which can be one of four categories: **Compulsory, Major Core, Discipline, or Breadth**. This categorization is computed by comparing the subject's study area with the selected major. Each type is associated with a distinct color for immediate recognition.
- **Header button**: In the search page and prerequisite display, a "+" button is rendered to signify the option to add the subject. Conversely, on the planner page, this changes to an "X" to indicate the functionality for removing the subject.
- **Card Description**: Key information, including the subject code, level, and credit points
- **Card Title**: Subject Name
- **Error Icons**: When applicable, error icons are displayed inline and to the right of the card title. There are two types of errors: prerequisite errors and semester errors with different icons (`/src/components/planner/errorButton.tsx`).
- **Card Footer**: The footer maps the available study periods alongside the corresponding subject coordinator names.
- Component can be found at `src/components/common/subjectCard.tsx`

#### 2. Empty Subject Card

**Purpose:** The **Empty Subject Card** component serves as a placeholder for adding new subjects within the planner or subject selection interface.

- **Card Structure**: The card is designed to be flexible and centered, taking up the full width and height of its container while maintaining a minimum width.
- **Add Button**: A circled add button centered using plus icon, for triggering search page to add a subject.
- Component can be found at `src/components/planner/emptySubjectCard.tsx`.

#### 3. Prerequisite Display

**Purpose:** The **PrereqDisplay** component is designed to fetch and display the prerequisites for a specific subject, providing a way to quickly add prerequisite subjects.

- **Trigger**: The prerequisites are shown in a scrollable sliding panel (the Sheet component) that can be triggered by an ErrorButton.
- **Data Fetching**: Upon mounting, the component fetch prerequisites from the backend server. The fetched data is in array of arrays of subject codes for formatting.
- **Prerequisite Formatting**: Function uses Subject Fetcher component (`src/components/planner/subjectFetcher.tsx`) to render subject card out of fetched subject codes. Structure of fetched data indicate "and" and "one of" relationships.
- **Quick Add**: Click on the header button will autoassign this prerequisite subject into the planner. It will fall into the earliest avaiable study period in current planner. If available semesters are fully booked, it will be assigned to the earliest empty slot.
- **Adding Existing Subjects**: If prerequisite subject already exists in planner, clicking add will trigger an alert dialog and forbid the addition. This is judged and rendered in `src/components/planner/subjectFetcher.tsx`.
- Component can be found at `src/components/planner/prereqDisplay.tsx`.

#### 4. Progression Rules

**Purpose:** The **RulesGeneral** and **RulesLevels** components are designed to display subject planning rules necessary for students to graduate.

- **RulesGeneral**: The component checks whether breadth and compulsory rules have been met. Component can be found at`src/components/planner/rulesGeneral.tsx`.
- **RulesLevels**: The component checks other rules that are specific to subject levels. Component can be found at `src/components/planner/rulesLevels.tsx`.
- **Design**: For each rule, there is an indicator of whether the rule has been fulfilled (✔) or not (✘), accompanied by the respective statistics (e.g. 0/125 credit points fulfilled).

#### 5. Planner Page

**Purpose:** The **Planner Page** brings all components together, allowing students to visualize their current subjects organized by semester.

- **Header**: Displays University of Melbourne logo alongside title "My Course Planner"
- **Main Content Area**: A responsive grid layout to organize subjects by year and study period. An alternative considered is using flexbox layout, but was rejected for alignment problems and the need for consistency across semesters.
- **Semester Rows**: Each semester row is dynamically generated based on the user's current plan. The layout adapts based on whether the semester is a standard semester (with four slots) or a short-term (summer/winter) semester (with two slots).
  - **Subject Cards**: Each subject is represented by a SubjectCard component. If no subject is assigned to a slot, an EmptySubjectCard is displayed, providing the option to add a new subject directly from the planner.
  - **Add/Remove Term Buttons**: Users can dynamically manage their study periods by adding or removing sumemr and winter terms. This functionality is built into the interface, allowing for immediate interaction.
- **Sidebar**: The sidebar provides additional functionalities, including a RESOLVE button which automatically resolves semester errors and certain prerequisite errors in planner (detailed algorithm in backend). Progression rules are displayed here to allow users to finalize their plans based on progression rules.
- The code can be found at `src/app/planner/[userId]/page.tsx`

### Search Page

#### 1. Search Bar and Search Filters

**Purpose**: **Search Bar and Search Filters** components allows users to search for subjects, one featuring input field for specific search, one using filter fields to list all subjects meeting the requirements.

- **Search Input**: Allows incomplete inputs, allows both subject name and subject code as input.
- **Filters**: Three filters are available: **Level, Study Peirod and Study Area Filters**. Students can select as many or as few filters as desired.
- The componetns can be found at `src/components/search/searchBar.tsx` and `src/components/search/searchFilters.tsx`

#### 2. Search Results

**Purpose**: The **Search Results** component is designed to display a list of subjects based on user search criteria.

- **Display Results**: The results are displayed in a responsive grid layout using subject cards.
- **Adding Subjects**: Users can add a subject to their planner by clicking the corresponding "+" button on each SubjectCard. If successful, the user is redirected to their planner page.
- **Error Handling**: If adding a subject fails (e.g., due to a duplicate entry), an error message is displayed using the RepeatedSubjectAlert component (`src/components/common/reapeatedSubjectAleart.tsx`). This alert provides immediate feedback, allowing users to understand what went wrong and take corrective action.

#### 3. Search Page

**Purpose**: The **Search Page** combines all search components and display search screen fo students.

- **Search Bar**: Located at the top, users can key inputs into here. When submit button is triggered, the component constructs a query string with the input and selected filters, then sends it to the backend
- **Main Content Area**: The main content is organized into two primary sections:
  - **Search Results**: This section displays the list of subjects returned from the search query. Users can interact with the results to add subjects to their planner directly.
  - **Search Filters**: Located on the right side, this section includes filters for Levels, Study Periods, and Study Areas. Users can select or clear filters, allows for targeted search.
- **Dynamic Loading of Data**: The component fetches a list of study areas from the backend on mount and updates the available Study Areas filter options accordingly. Allows for future extension of database.
- The code can be found at `src/app/search/[userId]/page.tsx`.

### Styling

#### tailwind.config.ts

- This file is a centralized configuration file where custom styles, particularly colors, are defined to maintain visual consistency across the project.
- For example bg-search-header for the dark blue defined by the University of Melbourne styling guide.
- This is to ensure consistency and to adhere to standards outlined by the University of Melbourne’s official styling guide.

#### constants and utils.ts

- `src/lib/constants.ts` define enum values of levels and study periods
- `src/lib/utils.ts` used to store backend link in one centralized place, so any changes to backend deployment only affects one file.

### Future Improvement Considerations

**Home page:**

- Allow users to select a major after receiving an alert for missing major selection, or allow them to make this choice after entering the .
- Add options for starting year and semester, allowing users to access information tailored to their specific intake year.

**Planner page:**

- Display the selected degree and major on the planner page for quick reference, with options to easily change the degree or major directly within the planner.
- Introduce a feature to lock a semester or subject, so that resolve will not be adding or removing these subjects or semester.
- Add overload possiblity, make semesters have 5 subject slots.

**Search page:**

- Add a “Back to Home” button, enabling users to return to the homepage smoothly.
- Optimize search functionality to enhance speed and responsiveness, particularly for filtering.
- Implement a “Recently Searched” or “Frequently Added Subjects” section to allow users quick access to commonly added subjects.
