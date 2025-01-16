import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import KanbanBoardPage from "./pages/KanbanBoardPage.tsx";
import CalenderViewPage from "./pages/CalenderViewPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import NewApplication from "./pages/NewApplication.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../store/authSlice.ts";
import { jwtDecode } from "jwt-decode";
import { AppDispatch } from "../store/store.ts";
import { getUser } from "./services/localStorageUtils.ts";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    // Our protected (authenticated) routes go here
    path: "/",
    element: (
      <PrivateRoute>
        <MainPage />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/kanban",
        element: <KanbanBoardPage />,
      },
      {
        path: "/calendar",
        element: <CalenderViewPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/application/new",
        element: <NewApplication />,
      },
      {
        path: "/application/edit",
        element: <NewApplication />,
      },
    ],
  },

  // Catch-all 404 Route. If the user visits any route that doesn't match
  // '/', '/login', or others you define, they'll get NotFoundPage.
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const { exp }: { exp: number } = jwtDecode(token);
        if (exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          dispatch(logout());
        } else {
          const savedUser = getUser();
          if (savedUser) {
            dispatch(setUser(savedUser));
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
        dispatch(logout());
      }
    }
  }, [dispatch]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
