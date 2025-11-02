"use client";

import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: string; // e.g., "w-40", "w-64"
  align?: "left" | "center" | "right";
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableAction<T> {
  icon: ReactNode;
  label: string;
  onClick: (item: T) => void;
  className?: string;
  variant?: "blue" | "red" | "yellow" | "green";
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  selectable?: boolean;
  selectedItems?: (string | number)[];
  onSelectItem?: (id: string | number) => void;
  onSelectAll?: () => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T) => string);
}

const variantClasses = {
  blue: "bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-200",
  red: "bg-red-100 hover:bg-red-200 text-red-600 border-red-200",
  yellow: "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200",
  green: "bg-green-100 hover:bg-green-200 text-green-600 border-green-200",
};

export function DataTable<T>({
  data,
  columns,
  actions,
  keyExtractor,
  emptyMessage = "Nie znaleziono elementów.",
  selectable = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  className = "",
  headerClassName = "bg-blue-600/50",
  rowClassName = "border-t border-gray-200 hover:bg-gray-50/50",
}: DataTableProps<T>) {
  const allSelected =
    selectable &&
    data.length > 0 &&
    data.every((item) => selectedItems.includes(keyExtractor(item)));

  const getRowClassName = (item: T): string => {
    if (typeof rowClassName === "function") {
      return rowClassName(item);
    }
    return rowClassName;
  };

  return (
    <>
      <div
        className={`overflow-x-auto bg-white/50 rounded-lg shadow ${className}`}
      >
        <table className="w-full text-left" style={{ minWidth: "max-content" }}>
          {/* Column sizing */}
          <colgroup>
            {selectable && <col style={{ width: "48px" }} />}
            {columns.map((col) => (
              <col key={col.key} className={col.width || ""} />
            ))}
            {actions && actions.length > 0 && (
              <col style={{ width: `${actions.length * 48 + 32}px` }} />
            )}
          </colgroup>

          {/* Table header */}
          <thead className={headerClassName}>
            <tr className="h-10">
              {/* Select all checkbox */}
              {selectable && (
                <th className="p-4 border-r border-blue-600/20">
                  <div className="flex items-center justify-center h-full">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer"
                      checked={allSelected}
                      onChange={onSelectAll}
                    />
                  </div>
                </th>
              )}

              {/* Column headers */}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-2 font-semibold text-gray-600 ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                        ? "text-right"
                        : "text-left"
                  } ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}

              {/* Actions column header */}
              {actions && actions.length > 0 && (
                <th className="p-2 font-semibold text-gray-600 text-center border-l border-blue-600/20">
                  Akcje
                </th>
              )}
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {data.map((item) => {
              const itemKey = keyExtractor(item);
              const isSelected = selectedItems.includes(itemKey);

              return (
                <tr key={itemKey} className={getRowClassName(item)}>
                  {/* Selection checkbox */}
                  {selectable && (
                    <td className="p-4 border-r border-blue-600/20">
                      <div className="flex items-center justify-center h-full">
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer"
                          checked={isSelected}
                          onChange={() => onSelectItem?.(itemKey)}
                        />
                      </div>
                    </td>
                  )}

                  {/* Data columns */}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-2 ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "text-left"
                      } ${col.className || ""}`}
                    >
                      {col.render
                        ? col.render(item)
                        : String(
                            (item as Record<string, unknown>)[col.key] || "",
                          )}
                    </td>
                  ))}

                  {/* Actions column */}
                  {actions && actions.length > 0 && (
                    <td className="p-2 border-l border-blue-600/20">
                      <div className="flex justify-center gap-2">
                        {actions.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => action.onClick(item)}
                            className={`p-2 rounded-md transition-colors cursor-pointer border ${
                              action.className ||
                              variantClasses[action.variant || "blue"]
                            }`}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <p className="text-center text-gray-500 mt-8">{emptyMessage}</p>
      )}
    </>
  );
}
