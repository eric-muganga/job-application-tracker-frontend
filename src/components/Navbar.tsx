import React, { useState } from "react";
import { NavItems } from "../../data/data";
import { NavLink, useNavigate } from "react-router-dom";

import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate("/login"); // Redirect to the login page
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 shadow">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-lg font-bold">Job Application Tracker</h1>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex justify-between items-center space-x-12">
            {NavItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-400 font-semibold"
                      : "hover:text-blue-300"
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600"
              >
                Logout
              </button>
            </li>
          </ul>
          {/* Hamburger Menu */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <GiHamburgerMenu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setIsMenuOpen(false)}
        >
          <ImCross className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold p-4">Menu</h2>
        <ul className="space-y-4 p-4">
          {NavItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "hover:text-blue-300"
                }
                onClick={() => setIsMenuOpen(false)} // Close sidebar on link click
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          {/* Logout Button */}
          <li>
            <button
              onClick={() => {
                setIsMenuOpen(false); // Close sidebar
                handleLogout();
              }}
              className="w-full bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
