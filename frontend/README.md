## Project Directory Structure
The Frontend is organized into the following directories:

```
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   |   ├── feedback/
│   │   |   ├── finput/
│   │   |   ├── layout/
│   │   |   └── pages/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   │   |   ├── csrt.ts
│   │   |   └── mySWR.ts
│   ├── index.css
│   ├── main.tsx
│   ├── package.json
│   ├── README.md
│   └── ... (other React files)
```
## Project Overview

### components/

The `components/` directory contains reusable React components organized into specific categories:

- **feedback/**: Components designed to provide user feedback through labels and notifications.
  
- **input/**: Components for various form inputs including buttons, calendars, input fields, selection fields, and time fields.
  
- **layout/**: Components that define the overall appearance and structure of the application, including page styles and components.
  
- **pages/**: Components representing different subpages of the application, particularly focused on settings.

### hooks/

The `hooks/` directory houses custom React hooks that encapsulate specific logic for reuse throughout the application.

### pages/

The `pages/` directory contains main page components that compose the core user interface of the application.

### types/

The `types/` directory defines TypeScript structures for organizing elements related to booking periods and vacations.

### utils/

The `utils/` directory includes utility functions that streamline common tasks such as handling cookies and making HTTP requests with CSRF protection, enhancing the application's functionality and security. It also includes `mySWR`, a custom React hook that integrates SWR (React Hooks for data fetching) with Axios for managing asynchronous data fetching, updating, and caching while ensuring CSRF token inclusion for secure HTTP requests.

### Other Files

- **index.css**: The main CSS file defining global styles for the application.
  
- **main.tsx**: The entry point for the React application, responsible for rendering the main React component and mounting it to the DOM.


## Technologies Overview
- **React with TypeScript**: React is a JavaScript library for building user interfaces, enhanced with TypeScript for static typing, enabling developers to catch errors early and improve code quality.

- **Vite**: Vite is a fast front-end build tool optimized for modern JavaScript frameworks like React and TypeScript. It provides instant server start, fast hot module replacement (HMR), and optimized production builds.

- **Templates**: Utilizing templates in our React frontend ensures consistency, reduces repetitive code, and enhances maintainability. Templates define reusable components, standardize common UI elements and layouts, facilitate global updates, and promote code reusability and collaboration among developers.
  
- **Tailwind UI**: Tailwind UI offers a comprehensive set of pre-designed components and utility classes built with Tailwind CSS. It accelerates UI development by enabling rapid prototyping and styling without custom CSS, ensuring consistent design and facilitating maintenance and updates following best practices in web design and accessibility.

- **SWR (Stale-While-Revalidate)** SWR is a React Hooks library for efficient data fetching, seamlessly integrating with TypeScript and offering caching strategies like stale-while-revalidate to optimize data management and application performance.

