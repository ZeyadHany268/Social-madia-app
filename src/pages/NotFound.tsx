
import { Link } from "react-router-dom";
import { SearchX, ArrowLeft, House } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-600">
          <SearchX size={40} strokeWidth={1.7} />
        </div>

        <h1 className="text-8xl font-extrabold tracking-tight text-blue-600">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Page not found
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
          Oops! The page you're looking for doesn't exist
          or may have been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <House size={18} />
            Go to Home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Error code: 404
        </p>
      </div>
    </div>
  );
}
