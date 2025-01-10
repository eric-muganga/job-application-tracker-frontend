import { configureStore } from "@reduxjs/toolkit";
import dashboardRender from "./dashboardSlice.ts";
import jobApplicationsRender from "./jobApplicationsSlice.ts";
import optionsRender from "./optionsSlice.ts";
import AuthRender from "./authSlice.ts";

const store = configureStore({
  reducer: {
    dashboard: dashboardRender,
    jobApplications: jobApplicationsRender,
    options: optionsRender,
    auth: AuthRender,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
