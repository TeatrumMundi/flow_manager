"use client";

import { useState } from "react";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { Button } from "@/components/common/CustomButton";
import { CustomModal } from "@/components/common/CustomModal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Potwierdź usunięcie",
  itemName,
  description,
  confirmButtonText = "Usuń",
  cancelButtonText = "Anuluj",
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const loading = isLoading || isDeleting;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={!loading}
    >
      <div className="flex flex-col items-center text-center">
        {/* Warning icon */}
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <FaExclamationTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-2">
          {description || "Czy na pewno chcesz usunąć ten element?"}
        </p>

        {/* Item name if provided */}
        {itemName && (
          <p className="font-semibold text-gray-800 mb-4 px-4 py-2 bg-gray-100 rounded-lg">
            {itemName}
          </p>
        )}

        {/* Warning message */}
        <p className="text-sm text-red-600 mb-6">
          Ta operacja jest nieodwracalna.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelButtonText}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-label="spinner"
                  role="img"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Usuwanie...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaTrash className="w-4 h-4" />
                {confirmButtonText}
              </span>
            )}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
