import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Shell from "./components/Shell.tsx";
import Settings from "./pages/Settings.tsx";
import NewBooking from "./pages/NewBooking.tsx";
import Booking from "./pages/Booking.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Shell />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/booking",
        element: <NewBooking />,
      },
      {
        path: "/booking/view",
        element: <Booking />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
