import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen bg-gray-100">
      <h1 className="text-xl font-bold">404 - Page Not Found</h1>
      <p>We couldn’t find the page you were looking for.</p>
      <Link to="/" className="text-blue-600 underline">
        Go to Dashboard
      </Link>
    </div>
  );
}
