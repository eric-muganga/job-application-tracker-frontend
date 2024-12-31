import React from "react";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import { Link } from "react-router-dom";

const KanbanBoardPage: React.FC = () => {
  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <Link
          to="/application/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          onClick={() => alert("Open a modal to add a new job application!")}
        >
          Add Job Application
        </Link>
      </header>
      <KanbanBoard />
    </div>
  );
};

export default KanbanBoardPage;
