import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainPage: React.FC = () => {
  return (
    <div className="overflow-x-clip">
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;
