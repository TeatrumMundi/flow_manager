import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface BackToDashboardButtonProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function BackToDashboardButton({
  href = "/profile/me",
  className = "",
  children = "Powrót do pulpitu",
  onClick,
}: BackToDashboardButtonProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center px-4 py-2 border border-blue-500 rounded-lg bg-blue-50 text-blue-700 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-100 hover:text-blue-900 hover:shadow-md group cursor-pointer ${className}`}
        style={{ textDecoration: "none" }}
      >
        <FaArrowLeft className="mr-2 transition-transform duration-200 group-hover:-translate-x-1 text-blue-500" />
        {children}
      </button>
    );
  }
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-4 py-2 border border-blue-500 rounded-lg bg-blue-50 text-blue-700 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-100 hover:text-blue-900 hover:shadow-md group cursor-pointer ${className}`}
      style={{ textDecoration: "none" }}
    >
      <FaArrowLeft className="mr-2 transition-transform duration-200 group-hover:-translate-x-1 text-blue-500" />
      {children}
    </Link>
  );
}
