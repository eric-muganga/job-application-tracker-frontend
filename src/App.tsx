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
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
