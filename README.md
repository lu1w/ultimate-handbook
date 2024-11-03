# ultimate-handbook

Unimelb COMP30020 IT Project

## Project Overview

This project aims to modernize and enhance the University of Melbourne course planner by providing a more intuitive user interface (UI) and enhanced functionality. The application is designed to simplify the process of planning, searching, adding subjects and resolve conflicts by offering a streamlined and user-friendly experience.

## New Features

### Summary
- **New timeline UI**: Highlight the potential to add summer and winter term by making the buttons visible by default.
- **New Progression Rules Display**: Group the progression rules, and provide statistics to count current and required credit points. Crosses or ticks for whether rule has been fulfilled, accounting for colourbline persons' needs.
- **New Search Filters UI**: Filtering options are displayed flat on the page rather than hidden in dropdowns
- **Different Error Iconss**: Different icons for prerequisite and semester errors, easier to distinguish and view error. 
- **Prerequisite Management**: New functionality allows users to quickly view and add prerequisite subjects to their course plan, without switching between pages
- **Conflict Resolution**: Provide a resolve button that solves scheduling conflicts automatically.

### Links to Confluence
- [Sprint I](https://yilu-wang.atlassian.net/wiki/spaces/UH/pages/10911745/Aug+15+-+Sprint+I)
- [Sprint II](https://yilu-wang.atlassian.net/wiki/spaces/UH/pages/12976129/Aug+22+-+Sprint+II)
- [Sprint III](https://yilu-wang.atlassian.net/wiki/spaces/UH/pages/21626881/Sep+5+-+Sprint+III)
- [Sprint IV](https://yilu-wang.atlassian.net/wiki/spaces/UH/pages/26738703/Sep+19+-+Sprint+IV)
- [Sprint V](https://yilu-wang.atlassian.net/wiki/spaces/UH/pages/36634625/Oct+3+-+Sprint+V)
- [Sprint VI](https://yilu-wang.atlassian.net/wiki/spaces/UH/pages/45711361/Oct+17+-+Sprint+VI)


## Demo
### Link to Deployment
This project is currently deployed on Vercel: https://ultimate-handbook.vercel.app/

### Home Page

Home page is the entry point of the website. It prompts the user to select a degree and an optional major. All relevant component files can be found under **/components/home**.
![image](https://github.com/user-attachments/assets/e0b1db81-6261-447f-bfb0-b90de0eeacf3)

#### Key Features

- **Degree Selection**: Rather than using course templates written manually, an better alternative is to dynamically generate degree options from the database. This facilitates future expansion of courses of degrees. Currently, the database is incomplete, so users cannot choose all degrees offered by the University of Melbourne.
- **Degree Based Major Selection**: Majors displayed are filtered based on the selected degree, ensuring only applicable majors are shown.
- Users must select a degree before entering the planner page. Choosing a major is optional, but if the user skips the major selection, an alert will notify them before proceeding.
![image](https://github.com/user-attachments/assets/94ed5cbd-f7ad-47a7-99ec-f6c716f6263e)



### Planner Page

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
- **Resolve Functionality**: With just one click of the 'Resolve' button, our course planner magically rearranges your subjects to minimize rule violations. Select the courses you love and let us handle the complex rules—no more worries about compliance!
### Search Page

The Search Page is designed to help users efficiently find and add subjects to their planner.
![image](https://github.com/user-attachments/assets/4a5659d5-13ad-4cf5-b826-268f40189d57)

#### Key Features

- **Enhanced Filtering**: The filtering options are displayed flat on the page rather than hidden in dropdowns, allowing users to quickly scan and apply filters without extra clicks. By keeping all options visible, users can immediately see all available filtering choices and make adjustments on the fly, which enhances usability and speeds up the selection process.

## Documentation
Documentation is on Confluence, access through [Confluence](https://yilu-wang.atlassian.net/wiki/spaces/UH/overview?homepageId=131295)


## System requirements (Dependency)
- node version ">= 12.0.0"
- express version "^4.17.1"
- mongodb version "^6.8.0"
- mongoose verstion "^8.4.4"
- react version "^18"
- next version "14.2.13"

## Installation guide
See frontend and backend README

## Changelog
1.0.0
- Adding basic frontend components of the webpage (including SubjectCard and SearchBar)
- Setting up the connection to the database 
- Successful communication between frontend and backend 
- Implementation of subject-searching functionality

1.1.0
- Deployment of backend to Heroku 
- Organize search page layout 
- Change frontend from Javascript to Typescript 

1.1.1
- Adding and removing subjects 

1.2.0
- Organize planner page layout with timeline 
- Adding and removing summer and winter terms 
- Resolver server implementation 

1.3.0
- Home page functionality 
- Add and removing terms 
- Add degree progression checks 
- Integrate frontend, backend, and the resolve server 

1.3.1
- Design of the home page 

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
