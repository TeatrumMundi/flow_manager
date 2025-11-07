"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { CustomInput } from "./CustomInput";

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
  searchable?: boolean;
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
  placeholder = "Wybierz...",
  searchable = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to consistent format
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get selected option
  const selectedOption = normalizedOptions.find(
    (option) => String(option.value) === String(value),
  );

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
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((previousIndex) =>
          previousIndex < filteredOptions.length - 1
            ? previousIndex + 1
            : previousIndex,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((previousIndex) =>
          previousIndex > 0 ? previousIndex - 1 : previousIndex,
        );
        break;
      case "Enter":
        event.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        event.preventDefault();
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
        {normalizedOptions.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
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
              ? `${className.replace("rounded-lg", "rounded-t-lg rounded-b-none")} flex items-center justify-between gap-2 cursor-pointer`
              : `${className} flex items-center justify-between gap-2 cursor-pointer`
            : isOpen
              ? "w-full px-3 py-2 border border-gray-300 rounded-t-lg rounded-b-none focus:outline-none text-gray-800 bg-white text-left flex items-center justify-between gap-2 cursor-pointer"
              : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-800 bg-white text-left flex items-center justify-between gap-2 cursor-pointer"
        }
      >
        <span
          className={`overflow-hidden text-ellipsis whitespace-nowrap min-w-0 ${selectedOption && value !== "" ? "" : "text-gray-400"}`}
        >
          {selectedOption && value !== "" ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
          {/* Search input (only if searchable) */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <CustomInput
                type="text"
                name="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Szukaj..."
                hideLabel
                className="text-sm"
                autoFocus
              />
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto max-h-60">
            <ul className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li key={String(option.value)}>
                    <button
                      type="button"
                      onClick={() => handleSelectOption(option.value)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors cursor-pointer ${
                        String(option.value) === String(value)
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "text-gray-800"
                      } ${index === highlightedIndex ? "bg-blue-50" : ""}`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 text-sm">
                  Nie znaleziono opcji
                </li>
              )}
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
