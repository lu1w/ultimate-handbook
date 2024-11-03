# Overview of the Project

The frontend comprises of 3 pages, each implemented with new features and improved UI. Details of features and relevant code files are listed below.

## Home Page: `/app/page.tsx`

Home page is the entry point of the website. It prompts the user to select a degree and an optional major. All relevant component files can be found under **/components/home**.
![image](https://github.com/user-attachments/assets/e0b1db81-6261-447f-bfb0-b90de0eeacf3)

### Key Features

- **Degree Selection**: Rather than using course templates written manually, an better alternative is to dynamically generate degree options from the database. This facilitates future expansion of courses of degrees. Currently, the database is incomplete, so users cannot choose all degrees offered by the University of Melbourne.
- **Degree Based Major Selection**: Majors displayed are filtered based on the selected degree, ensuring only applicable majors are shown.
- Users must select a degree before entering the planner page. Choosing a major is optional, but if the user skips the major selection, an alert will notify them before proceeding.


## Planner Page: `/app/planner/{userId}/page.tsx`

The planner page retains the core features of the existing University of Melbourne course planner, including subject addition and semester-based subject organization. However, several key improvements have been introduced:
![image](https://github.com/user-attachments/assets/9bc816ee-4bbe-4bc6-a598-1ce014d858cf)


### Key Features

- **Detailed Subject Information**: Subject cards now display extra information, including coordinator names for each study period. The related component can be found at **/components/common/subjectCard.tsx**.
- **Error Indicators**: Separate icons now distinguish between prerequisite and study period errors. Each icon is color-coded and shaped differently, with tooltips to identify them when hovered over. Access the component at **/components/planner/errorButton.tsx**.
- **Quick Add from Prerequisites**: Users can add prerequisite subjects directly from the prerequisites icon, which displays a list of needed subjects with a plus button. This automatically assigns the subject to the earliest available slot in the planner, streamlining the process by skipping steps like searching and manual addition. Relevant components are **/components/planner/prereqDisplay.tsx** and **/components/planner/subjectFetcher.tsx**.
![image](https://github.com/user-attachments/assets/500d9341-8471-4145-8b9f-fe6bc35cbf0f)
- **Visible Add Semester Option**: o address feedback that adding summer or winter terms was unclear, these options are now prominently displayed on screen.
- **Automated Resolve Functionality**: For any planner errors (e.g., arranging "Foundations of Algorithms" before "Foundations of Computing" or placing "IT Project" in semester 1), users can click "Resolve" to have these conflicts automatically corrected. Backend details on this functionality are available in backend documentation.
- **Better Degree Checklist**: The Degree Checklist now organizes requirements by different rules and displays the current credit points against minimum and maximum requirements, offering clearer progress tracking. For accessibility, checkmarks and crosses are used alongside colors to support colorblind users.

## Search Page: `/app/search/{userId}/page.tsx`

The Search Page is designed to help users efficiently find and add subjects to their planner.
![image](https://github.com/user-attachments/assets/4a5659d5-13ad-4cf5-b826-268f40189d57)

### Key Features

- **Enhanced Filtering**: The filtering options are displayed flat on the page rather than hidden in dropdowns, allowing users to quickly scan and apply filters without extra clicks. By keeping all options visible, users can immediately see all available filtering choices and make adjustments on the fly, which enhances usability and speeds up the selection process.


# Run the Project

## Locally

To run the frontend server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is currently deployed on Vercel: [https://ultimate-handbook.vercel.app/](https://ultimate-handbook.vercel.app/)

# Future Improvement Considerations

**Home page:**

- Allow users to select a major after receiving an alert for missing major selection, or allow them to make this choice after entering the .
- Add options for starting year and semester, allowing users to access information tailored to their specific intake year.

**Planner page:**

- Display the selected degree and major on the planner page for quick reference, with options to easily change the degree or major directly within the planner.
- Introduce a feature to lock a semester or subject, so that resolve will not be adding or removing these subjects or semester. 

**Search page:**

- Add a “Back to Home” button, enabling users to return to the homepage smoothly.
- Optimize search functionality to enhance speed and responsiveness, particularly for filtering.
- Implement a “Recently Searched” or “Frequently Added Subjects” section to allow users quick access to commonly added subjects.

## Learn More

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more deployment details.
