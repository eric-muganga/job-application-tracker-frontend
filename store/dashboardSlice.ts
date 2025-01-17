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

// Status Interface
export interface StatusWithCount {
  name: string;
  value: number;
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
  stats: StatusWithCount[];
  monthlyApplications: MonthlyApplication[];
  reminders: Reminder[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: DashboardState = {
  stats: [],
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

// Async thunk to fetch status data
export const fetchStatusCounts = createAsyncThunk(
  "dashboard/fetchStatusCounts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken"); // Fetch the token from localStorage
      const response = await axios.get(
        "https://localhost:44348/api/JobApplication/statistics-by-statuses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      return response.data.data.map((status: any) => ({
        name: status.statusName,
        value: status.total,
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to load status data");
    }
  }
);

// Async thunk to fetch monthly applications data
export const fetchMonthlyApplications = createAsyncThunk(
  "dashboard/fetchMonthlyApplications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://localhost:44348/api/JobApplication/statistics-per-months",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      // Convert API response to the expected format
      return Object.entries(response.data.data).map(
        ([month, applications]) => ({
          month,
          applications,
        })
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to load monthly applications data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatusCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStatusCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMonthlyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyApplications = action.payload;
      })
      .addCase(fetchMonthlyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
