"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useGetTransactions } from "@/api/wallet/wallet.queries";
import { Transaction, TRANSACTION_CATEGORY } from "@/constants/types";
import TransactionItem from "@/components/user/dashboard/TransactionItem";
import { format } from "date-fns";
import { FiSmartphone, FiArrowUp } from "react-icons/fi";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchTerm?: string;
}

type SearchTab = "all" | "transactions" | "payments";

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, initialSearchTerm = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
  const removeRecentSearch = (term: string) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Fetch transactions based on search
  const { transactionsData, isPending } = useGetTransactions({
    page: 1,
    limit: 20,
    search: searchTerm || undefined,
    ...(activeTab === "transactions" && { category: TRANSACTION_CATEGORY.TRANSFER }),
    ...(activeTab === "payments" && { category: TRANSACTION_CATEGORY.BILL_PAYMENT }),
  });

  const transactions = transactionsData?.transactions || [];
  const payments = transactions.filter((t) => t.category === TRANSACTION_CATEGORY.BILL_PAYMENT);
  const allTransactions = transactions;

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    if (activeTab === "transactions") {
      return transactions.filter((t) => t.category === TRANSACTION_CATEGORY.TRANSFER);
    } else if (activeTab === "payments") {
      return payments;
    }
    return allTransactions;
  };

  const filteredTransactions = getFilteredTransactions();

  // Get counts
  const allCount = allTransactions.length;
  const transactionsCount = transactions.filter((t) => t.category === TRANSACTION_CATEGORY.TRANSFER).length;
  const paymentsCount = payments.length;

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      saveRecentSearch(value);
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    saveRecentSearch(term);
  };

  // Focus input when modal opens and set initial search term
  useEffect(() => {
    if (isOpen) {
      if (initialSearchTerm) {
        setSearchTerm(initialSearchTerm);
      }
      if (searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }
  }, [isOpen, initialSearchTerm]);

  // Reset on close
  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full max-w-4xl bg-[#0A0A0A] rounded-2xl border border-gray-800 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Brand Orange */}
            <div className="w-full bg-[#FF6B2C] px-6 py-4">
              <h2 className="text-white text-2xl sm:text-3xl font-semibold">Search Web</h2>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left Panel - Recent Search */}
              <div className={`${searchTerm ? "w-full md:w-1/2 border-r border-gray-800" : "w-full"} flex flex-col bg-[#0A0A0A]`}>
                <div className="p-4 sm:p-6">
                  {/* Search Input */}
                  <div className="relative mb-6">
                    <svg
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search transactions, bills or payments..."
                      className="w-full rounded-lg bg-[#1C1C1E] border border-gray-800 text-sm sm:text-base pl-9 sm:pl-12 pr-10 py-2.5 sm:py-3 text-white placeholder:text-gray-600 outline-none focus:border-gray-700"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        <IoClose className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Recent Search Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm sm:text-base font-medium text-gray-300">Recent Search</h3>
                      {recentSearches.length > 0 && (
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {recentSearches.length === 0 ? (
                        <p className="text-xs sm:text-sm text-gray-500 py-4">No recent searches</p>
                      ) : (
                        recentSearches.map((term, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between group hover:bg-[#1C1C1E] rounded-lg px-3 py-2 cursor-pointer"
                          >
                            <div
                              className="flex items-center gap-2 flex-1"
                              onClick={() => handleRecentSearchClick(term)}
                            >
                              <svg
                                className="w-4 h-4 text-gray-500"
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
                              <span className="text-xs sm:text-sm text-gray-300">{term}</span>
                            </div>
                            <button
                              onClick={() => removeRecentSearch(term)}
                              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity"
                            >
                              <IoClose className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Search Results */}
              {searchTerm && (
                <div className="w-full md:w-1/2 flex flex-col bg-[#0A0A0A]">
                  <div className="p-4 sm:p-6 flex flex-col h-full">
                    {/* Search Input */}
                    <div className="relative mb-4">
                      <svg
                        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search transactions, bills or payments..."
                        className="w-full rounded-lg bg-[#1C1C1E] border border-gray-800 text-sm sm:text-base pl-9 sm:pl-12 pr-10 py-2.5 sm:py-3 text-white placeholder:text-gray-600 outline-none focus:border-gray-700"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                          <IoClose className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4 border-b border-gray-800">
                      <button
                        onClick={() => setActiveTab("all")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === "all"
                            ? "text-[#FF6B2C] border-b-2 border-[#FF6B2C]"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        All ({allCount})
                      </button>
                      <button
                        onClick={() => setActiveTab("transactions")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === "transactions"
                            ? "text-[#FF6B2C] border-b-2 border-[#FF6B2C]"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        Transactions ({transactionsCount})
                      </button>
                      <button
                        onClick={() => setActiveTab("payments")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === "payments"
                            ? "text-[#FF6B2C] border-b-2 border-[#FF6B2C]"
                            : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        Payments ({paymentsCount})
                      </button>
                    </div>

                    {/* Results */}
                    <div className="flex-1 overflow-y-auto">
                      {isPending ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-gray-400 text-sm">Loading...</div>
                        </div>
                      ) : filteredTransactions.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-gray-400 text-sm">No results found</div>
                        </div>
                      ) : (
                        <div className="space-y-0">
                          {activeTab === "transactions" && (
                            <div className="space-y-0">
                              {filteredTransactions.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                              ))}
                            </div>
                          )}
                          {activeTab === "payments" && (
                            <div className="space-y-0">
                              {filteredTransactions.map((transaction) => {
                                const billType = transaction.billDetails?.type;
                                const isAirtime = billType === "airtime";
                                const isData = billType === "data";
                                const amount = transaction.billDetails?.amountPaid || 0;
                                const isCredit = transaction.type === "CREDIT";

                                return (
                                  <div
                                    key={transaction.id}
                                    className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0 gap-2"
                                  >
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                        <FiSmartphone className="text-[#FF6B2C] text-lg" />
                                      </div>
                                      <div className="flex flex-col flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-medium text-white truncate">
                                          {isAirtime ? "Airtime Payment" : isData ? "Mobile Data Payment" : "Bill Payment"}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-gray-400">
                                          {isAirtime ? "GLO, MTN, AIRTEL, 9 MOBILE" : isData ? "Data Plans Available" : "Bill Payment"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <p className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${isCredit ? "text-green-500" : "text-red-500"}`}>
                                        {isCredit ? "+" : "-"}₦{amount.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {activeTab === "all" && (
                            <div className="space-y-0">
                              {filteredTransactions.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;

