// MonthlyApplicationsChart.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { selectMonthlyApplications, MonthlyApplication } from "../../../store/dashboardSlice";


const MonthlyApplicationsChart: React.FC = () => {
  // Use the typed selector, which returns an array of MonthlyApplication
  const monthlyApplications = useSelector<RootState, MonthlyApplication[]>(
    selectMonthlyApplications
  );

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-2">Monthly Applications</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={monthlyApplications}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="applications" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyApplicationsChart;
