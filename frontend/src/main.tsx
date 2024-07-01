import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Shell from "./components/layout/Shell.tsx";
import GuestBooking from "./pages/GuestBooking.tsx";
import GuestBookingTable from "./pages/GuestBookingTable.tsx";
import GuestConfirmation from "./pages/GuestConfirmation.tsx";
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
    path: "/guestbooking",
    element: <GuestBooking />,
  },
  {
    path: "/tableReservation",
    element: <GuestBookingTable />,
  },
  {
    path: "/confirmation",
    element: <GuestConfirmation />,
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
