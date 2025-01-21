// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // // Example: replace with your actual auth selector
  const user = useSelector((state: RootState) => state.auth.user);

  // If not logged in, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // const token = localStorage.getItem("authToken");

  // if (!token || !parseToken(token)) {
  //   return <Navigate to="/login" />;
  // }

  // Otherwise, render the route’s children
  return children;
};

export default PrivateRoute;
