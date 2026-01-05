"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import useOnClickOutside from "@/hooks/useOnClickOutside";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (term: string) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Remove a single recent search
  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle recent search click
  const handleRecentSearchClick = (term: string) => {
    saveRecentSearch(term);
    onSearch?.(term);
    handleClose();
  };

  // Clear search when closing
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C1E] rounded-xl border border-gray-800 shadow-2xl z-50 max-h-[400px] overflow-hidden flex flex-col"
        >
          {/* Recent Search Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Recent Search</h3>
              {recentSearches.length > 0 && (
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-2">
              {recentSearches.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No recent searches</p>
              ) : (
                recentSearches.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group hover:bg-[#2C2C2E] rounded-lg px-3 py-2 cursor-pointer transition-colors"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <svg
                        className="w-4 h-4 text-gray-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="text-sm text-gray-300 truncate">{term}</span>
                    </div>
                    <button
                      onClick={(e) => removeRecentSearch(term, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity flex-shrink-0 ml-2"
                    >
                      <IoClose className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchDropdown;

