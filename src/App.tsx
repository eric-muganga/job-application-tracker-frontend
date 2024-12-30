import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import KanbanBoard from "./components/Kanban/KanbanBoard.tsx";

const router = createBrowserRouter([
  {
    path: "/", // to change later
    element: <DashboardPage />,
  },
  {
    path: "/kanban",
    element: <KanbanBoard />,
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
