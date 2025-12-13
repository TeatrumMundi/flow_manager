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
  disabled?: boolean;
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
                               disabled = false,
                             }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
      "bottom",
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const normalizedOptions = options.map((option) =>
      typeof option === "string" ? { label: option, value: option } : option,
  );

  const filteredOptions = normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedOption = normalizedOptions.find(
      (option) => String(option.value) === String(value),
  );

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

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 250;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }

      if (searchable && searchInputRef.current) {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }

      if (optionsListRef.current) {
        optionsListRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, searchable]);

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
        setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : prev,
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

  const handleSelectOption = (optionValue: string | number) => {
    const syntheticEvent = {
      target: { name, value: String(optionValue) },
    } as ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(0);
  };

  useEffect(() => {
    setHighlightedIndex(0);
  }, []);

  const selectElement = (
      <div className="relative w-full" ref={dropdownRef}>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="sr-only"
            tabIndex={-1}
        >
          {normalizedOptions.map((option) => (
              <option key={String(option.value)} value={option.value}>
                {option.label}
              </option>
          ))}
        </select>

        <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={
              className
                  ? isOpen && dropdownPosition === "bottom"
                      ? `${className.replace("rounded-lg", "rounded-t-lg rounded-b-none")} flex items-center justify-between gap-2 cursor-pointer`
                      : isOpen && dropdownPosition === "top"
                          ? `${className.replace("rounded-lg", "rounded-b-lg rounded-t-none")} flex items-center justify-between gap-2 cursor-pointer`
                          : `${className} flex items-center justify-between gap-2 cursor-pointer`
                  : isOpen && dropdownPosition === "bottom"
                      ? "w-full px-3 py-2 border border-gray-300 rounded-t-lg rounded-b-none focus:outline-none text-gray-800 bg-white text-left flex items-center justify-between gap-2 cursor-pointer"
                      : isOpen && dropdownPosition === "top"
                          ? "w-full px-3 py-2 border border-gray-300 rounded-b-lg rounded-t-none focus:outline-none text-gray-800 bg-white text-left flex items-center justify-between gap-2 cursor-pointer"
                          : disabled
                              ? "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-400 bg-gray-100 text-left flex items-center justify-between gap-2 cursor-not-allowed"
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
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
            <div
                className={`absolute z-50 w-full bg-white border border-gray-300 shadow-lg overflow-hidden flex flex-col ${
                    dropdownPosition === "top"
                        ? "bottom-full rounded-t-lg mb-0"
                        : "top-full rounded-b-lg mt-0"
                }`}
                // ZMIANA: min-width: 100% zapewnia równą szerokość, max-height ogranicza wysokość
                style={{ maxHeight: '300px', minWidth: '100%' }}
            >
              {searchable && (
                  <div className="p-2 border-b border-gray-200 shrink-0 bg-white sticky top-0 z-10">
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

              <div
                  className="overflow-y-auto w-full"
                  ref={optionsListRef}
              >
                <ul className="py-1 w-full m-0 list-none">
                  {filteredOptions.length > 0 ? (
                      filteredOptions.map((option, index) => (
                          <li key={String(option.value)} className="w-full">
                            <button
                                type="button"
                                onClick={() => handleSelectOption(option.value)}
                                className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors cursor-pointer block ${
                                    String(option.value) === String(value)
                                        ? "bg-blue-100 text-blue-800 font-medium"
                                        : "text-gray-800"
                                } ${index === highlightedIndex ? "bg-blue-50" : ""}`}
                            >
                              <span className="block truncate">{option.label}</span>
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

  if (!label || hideLabel) {
    return selectElement;
  }

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