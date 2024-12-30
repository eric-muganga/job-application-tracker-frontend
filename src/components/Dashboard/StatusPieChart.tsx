import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { selectStats, DashboardStats } from "../../../store/dashboardSlice.ts";

// define a local interface for the pie data
interface PieDataItem {
  name: string;
  value: number;
}

const StatusPieChart: React.FC = () => {
  // Use the typed selector, which returns an object of DashboardStats
  const stats = useSelector<RootState, DashboardStats>(selectStats);

  // Define the pie data
  const pieData: PieDataItem[] = [
    { name: "Wishlist", value: stats.wishlist },
    { name: "Applied", value: stats.applied },
    { name: "Interviewing", value: stats.interviewing },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
  ];

  // Define the colors for the pie chart
    const COLORS = ["#6366F1", "#3B82F6", "#F59E0B", "#10B981", "#EF4444"];

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-2">Application Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusPieChart;
