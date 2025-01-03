import { configureStore } from "@reduxjs/toolkit";
import dashboardRender from "./dashboardSlice.ts";
import jobApplicationsRender from "./jobApplicationsSlice.ts";

const store = configureStore({
  reducer: {
    dashboard: dashboardRender,
    jobApplications: jobApplicationsRender,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
