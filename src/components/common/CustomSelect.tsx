"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

export type SelectOption =
  | string
  | {
      label: string;
      value: string | number;
    };

export interface CustomSelectProps {
  label?: string;
  name: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
  className?: string;
  hideLabel?: boolean;
  placeholder?: string;
}

export function CustomSelect({
  label,
  name,
  value,
  onChange,
  options,
  required,
  className,
  hideLabel = false,
  placeholder = "Select an option",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to consistent format
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        break;
    }
  };

  // Handle option selection
  const handleSelectOption = (optionValue: string | number) => {
    // Create synthetic event to match onChange signature
    const syntheticEvent = {
      target: { name, value: String(optionValue) },
    } as ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(0);
  };

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, []);

  const selectElement = (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden native select for form compatibility */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="sr-only"
        tabIndex={-1}
      >
        {normalizedOptions.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom select button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={
          className
            ? isOpen
              ? `${className.replace("rounded-lg", "rounded-t-lg rounded-b-none")} flex items-center justify-between gap-2`
              : `${className} flex items-center justify-between gap-2`
            : isOpen
              ? "w-full px-3 py-2 border border-gray-300 rounded-t-lg rounded-b-none focus:outline-none text-gray-800 bg-white text-left flex items-center justify-between gap-2"
              : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 bg-white text-left flex items-center justify-between gap-2"
        }
      >
        <span
          className={`overflow-hidden text-ellipsis whitespace-nowrap min-w-0 ${selectedOption ? "" : "text-gray-400"}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Toggle dropdown"
        >
          <title>Toggle dropdown</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border-x border-b border-gray-300 rounded-b-lg shadow-lg overflow-hidden">
          {/* Options list */}
          <div className="overflow-y-auto max-h-60">
            <ul className="py-1">
              {normalizedOptions.map((option, index) => (
                <li key={String(option.value)}>
                  <button
                    type="button"
                    onClick={() => handleSelectOption(option.value)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                      option.value === value
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "text-gray-800"
                    } ${index === highlightedIndex ? "bg-blue-50" : ""}`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  // If no label or hideLabel is true, return just the select
  if (!label || hideLabel) {
    return selectElement;
  }

  // Otherwise return with label wrapper
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {selectElement}
    </div>
  );
}
