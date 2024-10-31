This is the frontend of the University of Melborune subject planner.

## Overview of the Project

There are 3 pages in this project, as listed and explained below.

### Home Page: `/`

The entry point of the website, for user to choose a degree and major on this page.

- The degree choices are dynamically generated based on the data in the database. Currently the database is not complete, thus the user cannot choose all available degree that the University of Melbourne offers.
- The major choices are based on course information in the database, so only the major under the degree selected can be choosed.
- The user have to choose a degree before entering the planner page, but the user can enter without choosing a major. An alert will be generated if the user does not choose a major.

### Planner Page: `/planner/{userId}`

The main planning page with subjects in different semester slot.

### Search Page: `/search/{userId}`

The subject searching page for adding new subject.

## Run the Project

### Locally

To run the frontend server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment

This project is currently deployed on Vercel: [https://ultimate-handbook.vercel.app/](https://ultimate-handbook.vercel.app/)

## Future Improvement Considerations

Home page:

- Allow users to choose a major after the alert of missing major choice.

Planner page:

- Display degree and major on the planner page, and allow user to change the degree and/or major on the planner page.

Search page:

- Allow user to close the search page and go back to the home page using a button

## Learn More

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more deployment details.
