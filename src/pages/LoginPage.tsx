import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
} from "../../store/authSlice";
import { useNavigate, Link } from "react-router-dom"; // Import Link, useNavigate

interface LoginForm {
  email: string;
  password: string;
}

const initialState: LoginForm = {
  email: "",
  password: "",
};

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate(); // Navigation hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      alert("Both email and password are required.");
      return;
    }

    try {
      // Dispatch the login thunk
      const result = await dispatch(loginUser(formData)).unwrap();

      console.log(result);
      // If login is successful, navigate to "/"
      navigate("/");
    } catch (err) {
      // You can handle or log errors here if needed
      console.error("Login failed:", err);
    } finally {
      // Clear fields whether success or error
      setFormData(initialState);
    }
  };

  return (
    <div className="page-wrapper">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="heading">Login</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-section">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Link to Register page */}
        <div style={{ marginTop: "1rem" }}>
          <span>Don’t have an account? </span>
          <Link to="/register" style={{ color: "#007bff" }}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
