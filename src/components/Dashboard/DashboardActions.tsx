import React from "react";
import {Link, useNavigate} from "react-router-dom";

const DashboardActions: React.FC = () => {
  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate("/application/new");
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleAddNew}
        className="fixed
            bottom-8
            right-8
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
        <span className="text-2xl font-bold">+</span>
      </button>
        <Link to="/kanban"
              className="bg-[#3B82F6] hover:bg-[#1769ef] text-white px-4 py-2 rounded shadow"
        >
            View Kanban Board
        </Link>
        <Link to="/calendar"
              className="bg-[#3B82F6] hover:bg-[#1769ef] text-white px-4 py-2 rounded shadow"
        >
            Calendar
        </Link>
    </div>
  );
};

export default DashboardActions;
