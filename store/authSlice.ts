import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";

interface User {
  firstName: string;
  fullName: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    firstName: "",
    fullName: "",
    email: "",
    password: "",
  },
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user: User) => {
    const response = await axios.post(
      "https://localhost:44348/api/User/create",
      user
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post(
      "https://localhost:44348/api/User/login",
      credentials
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
