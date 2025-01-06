import React from "react";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import DashboardActions from "../components/Dashboard/DashboardActions";

const KanbanBoardPage: React.FC = () => {
  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Kanban Board</h1>
      </header>
      <KanbanBoard />
      <DashboardActions />
    </div>
  );
};

export default KanbanBoardPage;
