import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type Stage =
  | "Wishlist"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected";

// The possible stages
export const STAGES: Stage[] = [
  "Wishlist",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
];

// Interface for a single job application from your backend
export interface JobApplication {
  id: string;
  company: string;
  jobTitle: string;
  status: Stage;
  applicationDate?: string;
  interviewDate?: string;
  notes: string;
  contractType: string;
  jobDescription?: string;
  createdAt: string;
  financialInformation: string;
}

// Columns shape: each stage holds an array of application IDs
interface Columns {
  Wishlist: string[];
  Applied: string[];
  Interviewing: string[];
  Offer: string[];
  Rejected: string[];
}

// We'll store items (by ID) plus the columns
export interface ApplicationsState {
  items: Record<string, JobApplication>;
  columns: Columns;
  loading: boolean;
  error: string | null;
}

//
const DEMO_APPLICATIONS: JobApplication[] = [
  {
    id: "1",
    company: "Google",
    jobTitle: "Software Engineer",
    status: "Wishlist",
    applicationDate: "2024-01-12",
    interviewDate: "",
    notes: "Check company's leadership principles",
    contractType: "Full-Time",
    jobDescription: "Develop scalable services and optimize search features.",
    createdAt: "2023-12-28T08:00:00Z",
    financialInformation: "$120k base + bonuses",
  },
  {
    id: "2",
    company: "Netflix",
    jobTitle: "Backend Developer",
    status: "Applied",
    applicationDate: "2024-01-15",
    interviewDate: "",
    notes: "Referred by a friend on LinkedIn",
    contractType: "Full-Time",
    jobDescription: "Maintain microservices for streaming platform.",
    createdAt: "2023-12-29T08:00:00Z",
    financialInformation: "$130k base + stock options",
  },
  {
    id: "3",
    company: "Amazon",
    jobTitle: "DevOps Engineer",
    status: "Interviewing",
    applicationDate: "2024-01-10",
    interviewDate: "2024-01-20T10:00:00Z",
    notes: "Follow up with recruiter after second round",
    contractType: "Full-Time",
    jobDescription: "Design CI/CD pipelines for AWS-based apps.",
    createdAt: "2023-12-30T08:00:00Z",
    financialInformation: "Negotiable",
  },
  {
    id: "4",
    company: "Microsoft",
    jobTitle: "Frontend Engineer",
    status: "Offer",
    applicationDate: "2024-01-08",
    interviewDate: "",
    notes: "Offer includes relocation package",
    contractType: "Full-Time",
    jobDescription: "Build user-facing features for Microsoft 365.",
    createdAt: "2023-12-31T08:00:00Z",
    financialInformation: "$140k base + sign-on bonus",
  },
  {
    id: "5",
    company: "Meta",
    jobTitle: "Data Scientist",
    status: "Rejected",
    applicationDate: "2024-01-05",
    interviewDate: "",
    notes: "Told me they'd keep my resume on file",
    contractType: "Full-Time",
    jobDescription: "Analyze large-scale user data and generate insights.",
    createdAt: "2023-12-25T08:00:00Z",
    financialInformation: "N/A",
  },
];

// Initial state (empty columns/items)
const initialColumns: Columns = {
  Wishlist: [],
  Applied: [],
  Interviewing: [],
  Offer: [],
  Rejected: [],
};

function buildInitialDemoState(
  applications: JobApplication[]
): ApplicationsState {
  const newItems: Record<string, JobApplication> = {};
  const newColumns: Columns = structuredClone(initialColumns);

  for (const app of applications) {
    newItems[app.id] = app;
    // Place the app ID into the correct column array, based on its status
    if (STAGES.includes(app.status)) {
      newColumns[app.status].push(app.id);
    } else {
      console.warn("Unknown status:", app.status);
    }
  }

  return {
    items: newItems,
    columns: newColumns,
    loading: false,
    error: null,
  };
}

// 4) Build initial state from our demo array
const initialState: ApplicationsState =
  buildInitialDemoState(DEMO_APPLICATIONS);

// Async thunk to fetch applications from your API
export const fetchApplications = createAsyncThunk(
  "jobApplications/fetchApplications",
  async () => {
    // Adjust the URL to match your endpoint
    const response = await axios.get<JobApplication[]>("/api/jobApplications");
    return response.data; // An array of JobApplication
  }
);

// Async thunk to update application status
export const updateApplicationStatus = createAsyncThunk(
  "jobApplications/updateStatus",
  async ({ id, status }: { id: string; status: Stage }) => {
    // Adjust this URL or method to match your backend
    await axios.put(`/api/jobApplications/${id}`, { status });
    return { id, status };
  }
);

// Slice for job applications
const jobApplicationsSlice = createSlice({
  name: "jobApplications",
  initialState,
  reducers: {
    // 1) Reorder within same column
    reorderColumn(
      state,
      action: PayloadAction<{
        column: Stage;
        reorderedItems: string[];
      }>
    ) {
      const { column, reorderedItems } = action.payload;
      state.columns[column] = reorderedItems;
    },
    // 2) Move item across columns
    moveItem(
      state,
      action: PayloadAction<{
        itemId: string;
        sourceColumn: Stage;
        destColumn: Stage;
      }>
    ) {
      const { itemId, sourceColumn, destColumn } = action.payload;
      // remove from source
      const sourceItems = state.columns[sourceColumn];
      const index = sourceItems.indexOf(itemId);
      if (index !== -1) {
        sourceItems.splice(index, 1);
      }
      // add to destination
      state.columns[destColumn].push(itemId);

      // update item status
      if (state.items[itemId]) {
        state.items[itemId].status = destColumn;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;

        const fetchedApps = action.payload; // array of JobApplication
        const newItems: Record<string, JobApplication> = {};
        const newColumns: Columns = structuredClone(initialColumns);

        // Distribute the apps into columns based on 'status'
        for (const app of fetchedApps) {
          newItems[app.id] = app;
          if (STAGES.includes(app.status)) {
            newColumns[app.status].push(app.id);
          } else {
            console.warn("Unknown status", app.status);
          }
        }
        state.items = newItems;
        state.columns = newColumns;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch applications";
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        // If the backend confirms the update, you can apply any final changes:
        const { id, status } = action.payload;
        if (state.items[id]) {
          state.items[id].status = status;
        }
      });
  },
});

export const { reorderColumn, moveItem } = jobApplicationsSlice.actions;
export const selectApplications = (state: RootState) => state.jobApplications;

export default jobApplicationsSlice.reducer;
