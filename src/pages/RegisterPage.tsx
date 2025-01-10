import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { registerUser } from "../../store/authSlice";

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
  const [error, setError] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.fullName
    ) {
      setError("All fields are required.");
      return;
    }
    setError(null);

    try {
      const user = await dispatch(registerUser(formData)).unwrap();
      console.log("User registered successfully:", user);
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    }
    // Handle register logic here
    setFormData(initialState);
  };

  return (
    <div className="page-wrapper">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="heading">Register</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <label className="label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.firstName}
            onChange={handleChange}
            className="input"
            required
            autoComplete="first-name"
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
            autoComplete="full-name"
          />
        </div>

        <div className="form-section">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-section">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            autoComplete="new-password"
            required
          />
        </div>

        <button type="submit" className="button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
