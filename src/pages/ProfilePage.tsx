import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  selectAuthLoading,
  selectUser,
  updatePassword,
} from "../../store/authSlice";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);

  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
  };

  // Handle password update form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const {
      currentPassword: oldPassword,
      newPassword,
      confirmPassword,
    } = formValues;

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    if (!user?.email) {
      setMessage("User email is missing.");
      return;
    }

    dispatch(updatePassword({ email: user.email, oldPassword, newPassword }))
      .unwrap()
      .then(() => {
        setMessage("Password changed successfully!");
        setFormValues({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowChangePassword(false);
      })
      .catch((err) => {
        setMessage(err || "Failed to change password. Try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>

        {message && (
          <div
            className={`mb-4 text-center ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Display User Details */}
        <div className="space-y-4">
          <p>
            <strong>First Name:</strong> {user?.firstName || "N/A"}
          </p>
          <p>
            <strong>Full Name:</strong> {user?.fullName || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
        </div>

        {/* Toggle Password Change Form */}
        {!showChangePassword ? (
          <button
            onClick={() => setShowChangePassword(true)}
            className="mt-6 w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formValues.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formValues.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
            <button
              type="button"
              onClick={() => setShowChangePassword(false)}
              className="w-full px-4 py-2 mt-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
