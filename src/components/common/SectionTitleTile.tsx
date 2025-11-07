interface SectionTitleTileProps {
  title: string;
  className?: string;
}

export function SectionTitleTile({
  title,
  className = "",
}: SectionTitleTileProps) {
  return (
    <div
      className={`inline-flex items-center px-4 py-2 border border-blue-500 rounded-lg bg-blue-50 text-blue-700 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-100 hover:text-blue-900 hover:shadow-md ${className}`}
      style={{ textDecoration: "none", minHeight: "40px" }}
    >
      {title}
    </div>
  );
}
