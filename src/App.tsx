import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import KanbanBoardPage from "./pages/KanbanBoardPage.tsx";
import CalenderViewPage from "./pages/CalenderViewPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import NewApplication from "./pages/NewApplication.tsx";

const router = createBrowserRouter([
  {
    path: "/", // to change later
    element: <MainPage />,
    children: [
      {
        path: "/",
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
