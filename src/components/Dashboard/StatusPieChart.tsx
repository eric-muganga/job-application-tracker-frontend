import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import {
  selectStats,
  fetchStatusCounts,
} from "../../../store/dashboardSlice.ts";

// Define a color map for each status
const STATUS_COLORS: Record<string, string> = {
  Wishlist: "#A855F7", // Purple
  Applied: "#3B82F6", // Blue
  Interviewing: "#F59E0B", // Orange
  Offer: "#10B981", // Green
  Rejected: "#EF4444", // Red
};

const StatusPieChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Use the typed selector, which returns an object of DashboardStats
  const stats = useSelector(selectStats);

  useEffect(() => {
    dispatch(fetchStatusCounts());
  }, [dispatch]);

  // Convert stats to match Recharts data structure
  const pieData = stats.map((stat) => ({
    name: stat.name, // Assuming your stats include statusName
    value: stat.value, // Assuming your stats include total
  }));

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
                fill={STATUS_COLORS[_entry.name] || "#888888"}
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
