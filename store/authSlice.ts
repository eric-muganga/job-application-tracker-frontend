import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store"; // Adjust the path as needed
import {
  registerUserService,
  loginUserService,
  User,
  LoginCredentials,
  updatePasswordService,
  PasswordUpdatePayload,
} from "../src/services/userService";

import axios from "axios";

import { parseToken } from "../src/services/jwt";
import { removeUser, saveUser } from "../src/services/localStorageUtils";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const token = localStorage.getItem("authToken");
let user = null;

if (token) {
  try {
    const decodedToken = jwtDecode<{
      exp: number;
      email: string;
      fullName: string;
      firstName: string;
    }>(token);
    const isExpired = decodedToken.exp * 1000 < Date.now();

    if (!isExpired) {
      user = {
        email: decodedToken.email,
        fullName: decodedToken.fullName,
        firstName: decodedToken.firstName,
      };
    } else {
      localStorage.removeItem("authToken");
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("authToken");
  }
}

const initialState: AuthState = {
  user,
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
      const { user } = await loginUserService(credentials);
      return user; // Possibly includes token, user info, etc.
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

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (
    { email, oldPassword, newPassword }: PasswordUpdatePayload,
    { rejectWithValue }
  ) => {
    try {
      const data = await updatePasswordService({
        email,
        oldPassword,
        newPassword,
      });
      return data; // API response
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || error.message || "Axios error"
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
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
      removeUser();
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
        saveUser(action.payload); // Save user details in localStorage
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
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
