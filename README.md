# ultimate-handbook

Unimelb COMP30020 IT Project

## Project Overview

This project aims to modernize and enhance the University of Melbourne course planner by providing a more intuitive user interface (UI) and enhanced functionality. The application is designed to simplify the process of planning, searching, and adding subjects by offering a streamlined and user-friendly experience.

## Features

- **New UI**: A redesigned, more user-friendly interface for easier navigation and planning.
- **Prerequisite Management**: New functionality allows users to quickly view and add prerequisite subjects to their course plan, without switching between pages
- **Conflict Resolution**: Provide a resolve button that solves scheduling conflicts automatically.
- (view more of this in frontend README)

## Demo
### Home Page: `/app/page.tsx`

Home page is the entry point of the website. It prompts the user to select a degree and an optional major. All relevant component files can be found under **/components/home**.
![image](https://github.com/user-attachments/assets/e0b1db81-6261-447f-bfb0-b90de0eeacf3)

#### Key Features

- **Degree Selection**: Rather than using course templates written manually, an better alternative is to dynamically generate degree options from the database. This facilitates future expansion of courses of degrees. Currently, the database is incomplete, so users cannot choose all degrees offered by the University of Melbourne.
- **Degree Based Major Selection**: Majors displayed are filtered based on the selected degree, ensuring only applicable majors are shown.
- Users must select a degree before entering the planner page. Choosing a major is optional, but if the user skips the major selection, an alert will notify them before proceeding.


### Planner Page: `/app/planner/{userId}/page.tsx`

The planner page retains the core features of the existing University of Melbourne course planner, including subject addition and semester-based subject organization. However, several key improvements have been introduced:
![image](https://github.com/user-attachments/assets/9bc816ee-4bbe-4bc6-a598-1ce014d858cf)


#### Key Features

- **Detailed Subject Information**: Subject cards now display extra information, including coordinator names for each study period. The related component can be found at **/components/common/subjectCard.tsx**.
- **Error Indicators**: Separate icons now distinguish between prerequisite and study period errors. Each icon is color-coded and shaped differently, with tooltips to identify them when hovered over. Access the component at **/components/planner/errorButton.tsx**.
- **Quick Add from Prerequisites**: Users can add prerequisite subjects directly from the prerequisites icon, which displays a list of needed subjects with a plus button. This automatically assigns the subject to the earliest available slot in the planner, streamlining the process by skipping steps like searching and manual addition. Relevant components are **/components/planner/prereqDisplay.tsx** and **/components/planner/subjectFetcher.tsx**.
![image](https://github.com/user-attachments/assets/500d9341-8471-4145-8b9f-fe6bc35cbf0f)
- **Visible Add Semester Option**: o address feedback that adding summer or winter terms was unclear, these options are now prominently displayed on screen.
- **Automated Resolve Functionality**: For any planner errors (e.g., arranging "Foundations of Algorithms" before "Foundations of Computing" or placing "IT Project" in semester 1), users can click "Resolve" to have these conflicts automatically corrected. Backend details on this functionality are available in backend documentation.
- **Better Degree Checklist**: The Degree Checklist now organizes requirements by different rules and displays the current credit points against minimum and maximum requirements, offering clearer progress tracking. For accessibility, checkmarks and crosses are used alongside colors to support colorblind users.

### Search Page: `/app/search/{userId}/page.tsx`

The Search Page is designed to help users efficiently find and add subjects to their planner.
![image](https://github.com/user-attachments/assets/4a5659d5-13ad-4cf5-b826-268f40189d57)

#### Key Features

- **Enhanced Filtering**: The filtering options are displayed flat on the page rather than hidden in dropdowns, allowing users to quickly scan and apply filters without extra clicks. By keeping all options visible, users can immediately see all available filtering choices and make adjustments on the fly, which enhances usability and speeds up the selection process.


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
