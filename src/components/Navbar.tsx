import React from "react";
import { NavItems } from "../../data/data";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow">
      <div className="flex justify-between items-center px-4">
        <h1>Job Application Tracker</h1>
        <ul className="flex justify-between items-center space-x-12">
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
