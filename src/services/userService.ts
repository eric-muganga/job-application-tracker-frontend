import axios from "axios";
import { saveUser } from "./localStorageUtils";

const API_BASE_URL = "https://localhost:44348/api";

export interface User {
  firstName: string;
  fullName: string;
  email: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordUpdatePayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export async function registerUserService(user: User) {
  try {
    const response = await axios.post(`${API_BASE_URL}/User/create`, user);
    return response.data; // Extract the token
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      throw new Error(
        error.response?.data?.message || "Failed to register user"
      );
    } else if (error instanceof Error) {
      // Some other JS error
      throw new Error(error.message);
    }
    // Fallback if we can't identify the error type
    throw new Error("An unknown error occurred while registering.");
  }
}

export async function loginUserService(credentials: LoginCredentials) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/User/login`,
      credentials
    );
    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error("Invalid response format from the server");
    }

    console.log("user Data:", user);

    // Save the token in localStorage
    if (token && user) {
      localStorage.setItem("authToken", token);
      saveUser(user);
    }

    // Set the token in Axios default headers for subsequent requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return {
      token,
      user: {
        firstName: user.firstName,
        fullName: user.fullName,
        email: user.email,
      },
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to login");
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while logging in.");
  }
}

export async function updatePasswordService(payload: PasswordUpdatePayload) {
  try {
    const token = localStorage.getItem("authToken"); // Fetch the token from localStorage

    const response = await axios.post(
      `${API_BASE_URL}/User/changePassword`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return API response
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while changing password.");
  }
}
