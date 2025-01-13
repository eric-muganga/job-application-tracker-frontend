import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store"; // Adjust the path as needed
import {
  registerUserService,
  loginUserService,
  User,
  LoginCredentials,
} from "../src/services/userService";

import axios from "axios";

import { parseToken } from "../src/services/jwt";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const token = localStorage.getItem("authToken");

const initialState: AuthState = {
  user: token ? parseToken(token) : null, // or { firstName: "", fullName: "", email: "", password: "" }
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user: User, { rejectWithValue }) => {
    try {
      const data = await registerUserService(user);
      return data; // This is the user object returned by the API
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Narrowed to AxiosError
        return rejectWithValue(
          error.response?.data?.message || error.message || "Axios error"
        );
      } else if (error instanceof Error) {
        // Fallback for non-Axios Errors
        return rejectWithValue(error.message);
      }
      // Final fallback if it’s neither Error nor AxiosError
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await loginUserService(credentials);
      return data.user; // Possibly includes token, user info, etc.
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Narrowed to AxiosError
        return rejectWithValue(
          error.response?.data?.message || error.message || "Axios error"
        );
      } else if (error instanceof Error) {
        // Fallback for non-Axios Errors
        return rejectWithValue(error.message);
      }
      // Final fallback if it’s neither Error nor AxiosError
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("authToken");
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // -- registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload; // The user returned from the API
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        // action.payload is what we passed to rejectWithValue in createAsyncThunk
        state.error = action.payload as string;
      })
      // -- loginUser
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
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
