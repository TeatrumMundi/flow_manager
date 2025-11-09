import type React from "react";
import { IoMdRefresh } from "react-icons/io";
import { Button } from "@/components/common/CustomButton";

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing?: boolean;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export function RefreshButton({
  onClick,
  isRefreshing = false,
  title = "Odśwież",
  className = "",
  children,
}: RefreshButtonProps) {
  return (
    <Button
      variant="success"
      onClick={onClick}
      disabled={isRefreshing}
      title={title}
      className={className}
    >
      <IoMdRefresh size={20} className={isRefreshing ? "animate-spin" : ""} />
      {children ? children : "Odśwież"}
    </Button>
  );
}
