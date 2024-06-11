import { Link } from "react-router-dom";
import Page from "../components/Page";

export default function Dashboard() {
  //TODO: Alle Bookings für einen bestimmten tag
  const bookings = [
    { name: "Lindsay Walton", start: "2024-04-10 10Uhr", end: "2024-04-10 13Uhr", table: "1", guests: "4", note: "Das ist eine notiz" },

    // More people...
  ];

  return (
    <Page
      title="Dashboard"
      actionItems={
        <Link to="/booking" className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            New booking
          </button>
        </Link>
      }>
      <div className="sm:flex sm:items-center"></div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Start
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    End
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Table
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Guests
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Note
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.name}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{booking.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.start}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.end}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.table}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.guests}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{booking.note}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link to="/booking/view" className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {booking.name}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Page>
  );
}
