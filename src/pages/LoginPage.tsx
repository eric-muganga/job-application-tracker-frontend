import React, { useState } from "react";

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
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    console.log("Login Form Submitted:", formData);
    // Handle login logic here
    setFormData(initialState);
  };

  return (
    <div className="page-wrapper">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="heading">Login</h2>
        {error && <div className="error-message">{error}</div>}

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
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
