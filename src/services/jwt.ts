import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  firstName: string;
  fullName: string;
  exp: number; // Expiration timestamp
}

export function parseToken(token: string): DecodedToken | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
