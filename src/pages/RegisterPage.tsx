import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  registerUser,
  selectAuthLoading,
  selectAuthError,
} from "../../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  fullName: string;
}

const initialState: RegisterForm = {
  email: "",
  firstName: "",
  fullName: "",
  password: "",
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState(initialState);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate(); // Navigation hook

  const passwordRules = {
    length: {
      regex: /^.{8,}$/,
      message: "Password must be at least 8 characters long.",
    },
    uppercase: {
      regex: /[A-Z]/,
      message: "Password must contain at least one uppercase letter (A-Z).",
    },
    number: {
      regex: /\d/,
      message: "Password must contain at least one number (0-9).",
    },
    special: {
      regex: /[!@#$%^&*]/,
      message:
        "Password must contain at least one special character (e.g., !@#$%^&*).",
    },
  };

  const validatePassword = (password: string): string[] => {
    const validationErrors: string[] = [];
    Object.values(passwordRules).forEach(({ regex, message }) => {
      if (!regex.test(password)) {
        validationErrors.push(message);
      }
    });
    return validationErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.fullName
    ) {
      alert("All fields are required.");
      return;
    }

    // Check for password errors
    const errors = validatePassword(formData.password);
    if (errors.length > 0) {
      alert("Please fix the password issues before submitting.");
      return;
    }

    try {
      // Dispatch the async thunk
      await dispatch(registerUser(formData)).unwrap();

      // Optionally navigate to the login page after successful registration:
      navigate("/login");

      // Clear form on success
      setFormData(initialState);
      setPasswordErrors([]);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="page-wrapper">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="heading">Register</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <label className="label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="input"
            required
            autoComplete="given-name"
          />
        </div>

        <div className="form-section">
          <label className="label">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="input"
            required
            autoComplete="name"
          />
        </div>

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
            autoComplete="new-password"
          />
        </div>

        {/* Display password validation errors */}
        <div>
          <ul>
            {passwordErrors.map((error, index) => (
              <li key={index} style={{ color: "red" }}>
                {error}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Link to Login page */}
        <div style={{ marginTop: "1rem" }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: "#007bff" }}>
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
