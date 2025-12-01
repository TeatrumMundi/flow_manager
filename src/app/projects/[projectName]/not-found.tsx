import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          Projekt nie znaleziony
        </h2>
        <p className="text-slate-600 mb-6">
          Projekt o podanej nazwie nie istnieje w systemie.
        </p>
        <Link
          href="/projects"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Wróć do listy projektów
        </Link>
      </div>
    </div>
  );
}
