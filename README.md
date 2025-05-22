This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project Overview
This project is a full-stack application built using Next.js 15, designed to serve as a task management portal for companies. The application allows administrators to assign and manage tasks for employees, ensuring that each user can only view their own tasks. A central dashboard provides an overview of all users' tasks, enhancing the management experience.

## Purpose
The primary goal of this project is to develop a robust application that incorporates authentication, data storage via Backend as a Service (BaaS), and adheres to modern framework principles. The focus is on individual capability to develop, structure, and test an application within a framework.

## Features
Core Features:
* Next.js Framework: The project is built using Next.js with the App Router for efficient routing and rendering.

* User Authentication: Users must log in to access the application, utilizing a third-party authentication service (e.g., Firebase, Clerk).

* Role-Based Access Control: Only administrators can assign tasks to users, ensuring proper access management.

* Task Management: Users can view and mark their own tasks as complete.

* Deadline Management: Each task has an associated deadline to ensure timely completion.

* Data Storage: Task data is stored in a BaaS solution (e.g., Firebase, Convex, Supabase).

* Responsive Design: The application is designed to be responsive, providing a seamless experience across devices.

## Advanced Features
* Admin Dashboard: Administrators have access to a dashboard that displays a column view of all users' tasks, with the ability to mark tasks as complete.

* Real-Time Updates: The dashboard reflects real-time updates when tasks are added or marked as complete, enhancing user experience and task management.

* Unit Testing: The application includes at least one unit test to ensure code reliability and functionality.

## Getting Started
To run this project locally, follow these steps:

1. Clone the repository:
* git clone <repository-url>
* cd arbetsuppgiftsportal

2. Install the dependencies:
* npm install
  
3. Run the development server:

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Technologies Used
* Next.js 15: For building the application.
* Firebase/Convex: For authentication and data storage.
* React: For building user interfaces.
* CSS/Styled, Tailwind Components: For styling the application.
* Jest: For unit testing.

## Conclusion
This project demonstrates the ability to create a full-stack application with essential features for task management, focusing on user authentication, role-based access, and real-time updates. The implementation of a responsive design ensures usability across various devices, making it a practical solution for companies looking to manage tasks efficiently.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
