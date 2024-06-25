import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Settings", href: "/settings" },
];
const userNavigation = [{ name: "Sign out", href: "#" }];

function classNames(...classes: Array<String>) {
  return classes.filter(Boolean).join(" ");
}

export default function Shell() {
  return (
    <>
      <div className="min-h-full">
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img className="block h-8 w-auto lg:hidden" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                  <img className="hidden h-8 w-auto lg:block" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive ? "border-indigo-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                          "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                        )
                      }>
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="h-8 w-8 p-2 bg-gray-200 rounded-full flex items-center justify-center text-indigo-400 font-semibold hover:bg-gray-300">R</MenuButton>
                  </div>
                  <Transition
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          {({ focus }: { focus: boolean }) => (
                            <a href={item.href} className={classNames(focus ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                              {item.name}
                            </a>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden"></div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{<Outlet />}</div>
          </main>
        </div>
      </div>
    </>
  );
}
