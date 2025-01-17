// MonthlyApplicationsChart.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  selectMonthlyApplications,
  fetchMonthlyApplications,
} from "../../../store/dashboardSlice";

const MonthlyApplicationsChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Use selector to get the monthly applications data
  const monthlyApplications = useSelector(selectMonthlyApplications);

  // Fetch monthly applications data on mount
  useEffect(() => {
    dispatch(fetchMonthlyApplications());
  }, [dispatch]);

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
