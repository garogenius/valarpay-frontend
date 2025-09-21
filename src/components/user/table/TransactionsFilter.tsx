"use client";
import { useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { BiFilterAlt } from "react-icons/bi";
import cn from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { TRANSACTION_STATUS } from "@/constants/types";
import { TRANSACTION_CATEGORY } from "@/constants/types";

type FilterCategory = "category" | "status";
type FilterState = {
  category?: TRANSACTION_CATEGORY;
  status?: TRANSACTION_STATUS;
  // dateRange?: [string, string];
};

type FilterProps = {
  onFilterChange: (filters: FilterState) => void;
};

const TransactionsFilter = ({ onFilterChange }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
  const filterRef = useRef<HTMLDivElement>(null);
  // const [dateRange, setDateRange] = useState<
  //   [Date | undefined, Date | undefined]
  // >([undefined, undefined]);
  // const [startDate, endDate] = dateRange;

  useOnClickOutside(filterRef, () => setIsOpen(false));

  const filterCategories = {
    category: [
      { label: "Transfer", value: "TRANSFER" },
      { label: "Deposit", value: "DEPOSIT" },
      { label: "Bill Payment", value: "BILL_PAYMENT" },
    ],

    status: [
      { label: "Success", value: "success" },
      { label: "Failed", value: "failed" },
      { label: "Pending", value: "pending" },
    ],
  };

  const handleFilterClick = (category: FilterCategory, value: string) => {
    const newFilters = {
      ...selectedFilters,
      [category]: selectedFilters[category] === value ? undefined : value,
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  // const handleDateChange = (update: [Date | null, Date | null]) => {
  //   // Convert null to undefined for the dateRange state
  //   const dateRangeUpdate: [Date | undefined, Date | undefined] = [
  //     update[0] || undefined,
  //     update[1] || undefined,
  //   ];
  //   setDateRange(dateRangeUpdate);

  //   const dateStrings: [string, string] = [
  //     update[0] ? update[0].toISOString() : "",
  //     update[1] ? update[1].toISOString() : "",
  //   ];

  //   setSelectedFilters((prev) => ({
  //     ...prev,
  //     dateRange: dateStrings,
  //   }));

  //   onFilterChange({
  //     ...selectedFilters,
  //     dateRange: dateStrings,
  //   });
  // };

  const handleClearFilters = () => {
    setSelectedFilters({});
    // setDateRange([undefined, undefined]);
    onFilterChange({});
  };

  return (
    <div ref={filterRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          " bg-bg-600 dark:bg-bg-1100 text-text-200 dark:text-text-400  flex items-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 border rounded-lg",
          {
            " border-transparent":
              !selectedFilters.category && !selectedFilters.status,
            "border-secondary":
              selectedFilters.category || selectedFilters.status,
          }
        )}
      >
        <BiFilterAlt className=" text-lg" />
        <p className="hidden 2xs:block text-sm 2xs:text-base">Filters</p>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-bg-600 dark:bg-bg-2200 text-text-200 dark:text-text-400 rounded-lg shadow-xl border border-transparent z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-base font-medium">Filter By</p>
              {(selectedFilters.category || selectedFilters.status) && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5  rounded-full px-4 py-2"
                >
                  <IoIosCloseCircleOutline className="text-xl" />
                  <p className="text-sm font-bold">Clear active filters</p>
                </button>
              )}
            </div>
            {Object.entries(filterCategories).map(([category, options]) => (
              <div key={category} className="mb-4">
                <p className="text-sm font-medium mb-2 capitalize">
                  {category}
                </p>
                <div className="space-y-2">
                  {options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedFilters[category as FilterCategory] ===
                          option.value
                        }
                        onChange={() =>
                          handleFilterClick(
                            category as FilterCategory,
                            option.value
                          )
                        }
                        className="rounded border-border-600"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {/* <div className="mb-4">
              <p className="text-sm font-medium mb-2">Duration</p>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update: [Date | null, Date | null]) =>
                  handleDateChange(update)
                }
                isClearable={true}
                placeholderText="Select date range"
                className="w-full p-2 text-sm border rounded"
              />
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsFilter;
