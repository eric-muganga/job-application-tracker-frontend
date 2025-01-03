import React from "react";
import { Link } from "react-router-dom";

const DashboardActions: React.FC = () => {
  return (
    <div className="relative">
      <Link
        to="/application/new"
        className="fixed z-10
            bottom-6
            right-6
            md:bottom-8
            md:right-8
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            rounded-full
            w-16
            h-16
            flex
            items-center
            justify-center
            shadow-lg"
        title="Add New Application"
      >
        <span className="text-xl md:text-2xl font-bold">+</span>
      </Link>
    </div>
  );
};

export default DashboardActions;
