import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

// Define the shape of the dashboard stats
export interface DashboardStats {
  total: number;
  wishlist: number;
  applied: number;
  interviewing: number;
  offer: number;
  rejected: number;
}

// Define the shape of the monthly applications
export interface MonthlyApplication {
  month: string;
  applications: number;
}

// Define the shape of the reminder
export interface Reminder {
  id?: number;
  text?: string;
  date?: string;
}

// Define the shape of the activity
export interface Activity {
  id?: number;
  text?: string;
  date?: string;
}

// Define the shape of the dashboard state
interface DashboardState {
  stats: DashboardStats;
  monthlyApplications: MonthlyApplication[];
  reminders: Reminder[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: DashboardState = {
  stats: {
    total: 15,
    wishlist: 2,
    applied: 8,
    interviewing: 3,
    offer: 1,
    rejected: 1,
  },
  monthlyApplications: [
    { month: "Jan", applications: 2 },
    { month: "Feb", applications: 4 },
    { month: "Mar", applications: 3 },
  ],
  // Demo reminders
  reminders: [
    {
      id: 1,
      text: "Follow up with Google recruiter",
      date: "2024-01-10",
    },
    {
      id: 2,
      text: "Send thank-you email to Amazon HR",
      date: "2024-01-12",
    },
    {
      id: 3,
      text: "Review feedback from Microsoft interview",
      date: "2024-01-15",
    },
  ],
  // Demo activities
  activities: [
    {
      id: 1,
      text: "Applied to Netflix (Software Engineer)",
      date: "2024-01-02",
    },
    {
      id: 2,
      text: "Scheduled interview with Meta",
      date: "2024-01-05",
    },
    {
      id: 3,
      text: "Received offer from Apple",
      date: "2024-01-08",
    },
  ],
  loading: false,
  error: null,
};

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async () => {
    const response = await axios.get("http://localhost:8080/api/dashboard"); // to change url
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        // Safely handle undefined arrays
        state.stats = action.payload.stats;
        state.reminders = action.payload.reminders ?? [];
        state.monthlyApplications = action.payload.monthlyApplications ?? [];
        state.activities = action.payload.activities ?? [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load dashboard data";
      });
  },
});

// Selectors
export const selectStats = (state: RootState) => state.dashboard.stats;
export const selectMonthlyApplications = (state: RootState) =>
  state.dashboard.monthlyApplications;
export const selectReminders = (state: RootState) => state.dashboard.reminders;
export const selectActivities = (state: RootState) =>
  state.dashboard.activities;
export const selectLoading = (state: RootState) => state.dashboard.loading;
export const selectError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;
