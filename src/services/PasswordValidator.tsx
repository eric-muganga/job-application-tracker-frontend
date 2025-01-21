import React, { useState } from "react";

interface PasswordRule {
  regex: RegExp;
  message: string;
}

const PasswordValidator: React.FC = () => {
  const [password, setPassword] = useState<string>(""); // Password input state
  const [errors, setErrors] = useState<string[]>([]); // Validation errors

  // Define password validation rules with types
  const passwordRules: Record<string, PasswordRule> = {
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

  // Validate the password against rules and set errors
  const validatePassword = (password: string): void => {
    const validationErrors: string[] = [];
    Object.values(passwordRules).forEach(({ regex, message }) => {
      if (!regex.test(password)) {
        validationErrors.push(message);
      }
    });
    setErrors(validationErrors);
  };

  // Handle password input changes
  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  // Calculate password strength (1 to 4)
  const calculateStrength = (password: string): number => {
    let strength = 0;
    if (passwordRules.length.regex.test(password)) strength++;
    if (passwordRules.uppercase.regex.test(password)) strength++;
    if (passwordRules.number.regex.test(password)) strength++;
    if (passwordRules.special.regex.test(password)) strength++;
    return strength;
  };

  // Get color based on strength
  const getStrengthColor = (strength: number): string => {
    switch (strength) {
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "yellow";
      case 4:
        return "green";
      default:
        return "gray";
    }
  };

  // Calculate strength and determine the color
  const strength: number = calculateStrength(password);
  const strengthColor: string = getStrengthColor(strength);

  return (
    <div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
        />
      </div>
      <div
        style={{
          backgroundColor: strengthColor,
          height: "10px",
          width: `${strength * 25}%`,
          marginTop: "10px",
        }}
      />
      <div>
        <ul>
          {errors.map((error, index) => (
            <li key={index} style={{ color: "red" }}>
              {error}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordValidator;
