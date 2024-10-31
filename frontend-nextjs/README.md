This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Overview of the Project

There are 3 pages in this project, as listed and explained below.

### Home Page: `/`

User choose a degree and major on this page.

- The degree choices are dynamically generated based on the data in the database. Currently the database is not complete, thus the user cannot choose all available degree that the University of Melbourne offers.
- The major choices are based on course information in the database, so only the major under the degree selected can be choosed.
- The user have to choose a degree before entering the planner page, but the user can enter without choosing a major. An alert will be generated if the user does not choose a major.

Future development:

- Allow users to choose a major after the alert.

### Planner Page: `/planner/{userId}`

The main planning page with subject put in different semester slot.

Future development:

- Display degree and major on the planner page, and allow user to change the degree and/or major on the planner page.

### Search Page: `/search/{userId}`

Subject searching page when the user wants to add new subject.
