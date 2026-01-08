"use client";
import { useGetTransactions } from "@/api/wallet/wallet.queries";

import { useTheme } from "@/store/theme.store";
import { FiChevronDown, FiDownload, FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import EmptyState from "../table/EmptyState";
import Table from "../table/Table";
import MobileTable from "../table/MobileTable";
import images from "../../../../public/images";
import Pagination from "../table/Pagination";
import Skeleton from "react-loading-skeleton";
import { useMemo, useRef, useState } from "react";
import { GenerateColumns } from "../table/columns";
import { TRANSACTION_CATEGORY, TRANSACTION_STATUS } from "@/constants/types";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import ErrorToast from "@/components/toast/ErrorToast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DownloadStatementModal from "@/components/modals/DownloadStatementModal";

import { TRANSACTION_TYPE } from "@/constants/types";

type FilterChangeEvent = {
  category?: TRANSACTION_CATEGORY;
  status?: TRANSACTION_STATUS;
  type?: TRANSACTION_TYPE;
};

const TransactionsContent = () => {
  const theme = useTheme();
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterChangeEvent>({});

  // UI-only dropdown states (do not alter API logic)
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const [uiType, setUiType] = useState<string>("All Types");
  const [selectedType, setSelectedType] = useState<TRANSACTION_TYPE | undefined>(undefined);
  const [uiCalendar, setUiCalendar] = useState<string>("Calendar");

  // Download statement fields moved into modal (UI only)

  const categoryRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(categoryRef, () => setCategoryOpen(false));
  useOnClickOutside(typeRef, () => setTypeOpen(false));
  useOnClickOutside(statusRef, () => setStatusOpen(false));
  useOnClickOutside(calendarRef, () => setCalendarOpen(false));

  const { transactionsData, isPending, isError } = useGetTransactions({
    page: pageNumber,
    limit: pageSize,
    search,
    type: selectedType,
    ...filter,
  });

  const handleFilterChange = (filters: FilterChangeEvent) => {
    const filterOptions = {
      category: filters.category,
      status: filters.status,
    };
    setFilter(filterOptions);
  };

  const columns = GenerateColumns();

  const hasTransactions =
    transactionsData?.transactions && transactionsData.transactions.length > 0;
  const tableLoading = isPending && !isError;

  const categoryLabel = useMemo(() => {
    if (!filter.category) return "All Categories";
    if (filter.category === TRANSACTION_CATEGORY.TRANSFER) return "Transfers";
    if (filter.category === TRANSACTION_CATEGORY.DEPOSIT) return "Deposits";
    if (filter.category === TRANSACTION_CATEGORY.BILL_PAYMENT) return "Bill Payments";
    return "All Categories";
  }, [filter.category]);

  const statusLabel = useMemo(() => {
    if (!filter.status) return "All Status";
    const s = String(filter.status).toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }, [filter.status]);

  const CategoryMenu = () => (
    <div className="absolute left-0 top-full mt-2 w-full sm:w-64 bg-[#0A0A0A] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="max-h-72 overflow-y-auto">
        {[
          { label: "All categories", value: undefined as any },
          { label: "Intra-bank Transfer", value: TRANSACTION_CATEGORY.TRANSFER },
          { label: "Inter-bank Transfer", value: TRANSACTION_CATEGORY.TRANSFER },
          { label: "Airtime", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Betting", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Mobile Data", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Electricity", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Cable TV", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Insurance", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Shopping", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Health", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Education", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Government", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "International Airtime", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Water", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Buy Giftcards", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Sell Giftcards", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
          { label: "Convert Currency", value: TRANSACTION_CATEGORY.BILL_PAYMENT },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => {
              handleFilterChange({ ...filter, category: opt.value });
              setCategoryOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const StatusMenu = () => (
    <div className="absolute left-0 top-full mt-2 w-full sm:w-56 bg-[#0A0A0A] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="py-1">
        {[
          { label: "All Status", value: undefined as any, enabled: true },
          { label: "Processing", value: TRANSACTION_STATUS.pending, enabled: true },
          { label: "Successful", value: TRANSACTION_STATUS.success, enabled: true },
          { label: "Failed", value: TRANSACTION_STATUS.failed, enabled: true },
          // UI-only items to match design (not supported by current backend enum)
          { label: "Cancelled", value: undefined as any, enabled: false },
          { label: "Refunded", value: undefined as any, enabled: false },
          { label: "Recent", value: undefined as any, enabled: false },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => {
              if (!opt.enabled) {
                ErrorToast({
                  title: "Not available",
                  descriptions: ["This status filter is not supported yet."],
                });
                return;
              }
              handleFilterChange({ ...filter, status: opt.value });
              setStatusOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const CalendarMenu = () => {
    // UI-only calendar: we keep internal selections without affecting API params
    const [tempDate, setTempDate] = useState<Date | null>(null);
    const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());

    const years = useMemo(() => {
      const current = new Date().getFullYear();
      const list: number[] = [];
      for (let y = current; y >= current - 6; y--) list.push(y);
      return list;
    }, []);

    const orangeBar = "bg-[#FF6B2C]";

    return (
      <div className="absolute right-0 top-full mt-2 w-[calc(100vw-3rem)] sm:w-[320px] max-w-[320px] bg-[#0A0A0A] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
        <div className={`px-4 py-2 ${orangeBar} flex items-center justify-between`}>
          <button
            type="button"
            className="text-black text-xs font-semibold flex items-center gap-1"
            onClick={() => {
              // toggle between showing year selection and calendar header; keep simple
              // (we always show year list at right)
            }}
          >
            {activeYear} <FiChevronDown className="text-black" />
          </button>
          <button type="button" className="text-black" aria-label="Close" onClick={() => setCalendarOpen(false)}>
            <IoClose className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row">
          {/* Month grid */}
          <div className="flex-1 p-3">
            <DatePicker
              selected={tempDate}
              onChange={(d) => setTempDate(d)}
              inline
              renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                <div className="flex items-center justify-between px-1 pb-2">
                  <button type="button" onClick={decreaseMonth} className="text-white hover:text-white/80 px-2 text-base">
                    ‹
                  </button>
                  <p className="text-xs text-white font-medium">
                    {date.toLocaleString("en-US", { month: "long" })} {activeYear}
                  </p>
                  <button type="button" onClick={increaseMonth} className="text-white hover:text-white/80 px-2 text-base">
                    ›
                  </button>
                </div>
              )}
              calendarClassName="!bg-[#0A0A0A] !border-0 [&_.react-datepicker__day-name]:!text-white [&_.react-datepicker__day]:!text-white [&_.react-datepicker__day--selected]:!bg-[#FF6B2C] [&_.react-datepicker__day--selected]:!text-black [&_.react-datepicker__day--keyboard-selected]:!bg-[#FF6B2C]/20 [&_.react-datepicker__day--keyboard-selected]:!text-white [&_.react-datepicker__day:hover]:!bg-white/10 [&_.react-datepicker__day--disabled]:!text-gray-600 [&_.react-datepicker__day--outside-month]:!text-gray-600 [&_.react-datepicker__current-month]:!text-white [&_.react-datepicker__month]:!text-white"
            />
            <button
              type="button"
              className="mt-3 w-full rounded-full bg-[#FF6B2C] text-black text-sm font-semibold py-2.5 hover:bg-[#FF7A3D] transition-colors"
              onClick={() => {
                setUiCalendar("Calendar");
                setCalendarOpen(false);
              }}
            >
              Done
            </button>
          </div>

          {/* Year list (visual only) */}
          <div className="w-full sm:w-[110px] border-t sm:border-t-0 sm:border-l border-gray-800">
            <div className="max-h-[200px] sm:max-h-[278px] overflow-y-auto">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setActiveYear(y)}
                  className={`w-full px-3 py-2 text-xs text-left ${
                    y === activeYear ? "bg-white/5 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TypeMenu = () => (
    <div className="absolute left-0 top-full mt-2 w-full sm:w-56 bg-[#0A0A0A] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="py-1">
        {[
          { label: "All Types", value: undefined },
          { label: "Credit", value: TRANSACTION_TYPE.CREDIT },
          { label: "Debit", value: TRANSACTION_TYPE.DEBIT },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => {
              setUiType(opt.label);
              setSelectedType(opt.value);
              setTypeOpen(false);
            }}
            className={`w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors ${
              selectedType === opt.value ? "bg-white/5" : ""
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="flex flex-row items-center gap-2 sm:gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white text-base sm:text-lg font-semibold truncate">Transaction History</p>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1 line-clamp-1">View and manage all your transaction history</p>
        </div>
        <button
          type="button"
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-[#FF6B2C] text-black font-semibold text-[10px] sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2.5 hover:bg-[#FF7A3D] transition-colors whitespace-nowrap"
          onClick={() => setDownloadOpen(true)}
        >
          <FiDownload className="text-xs sm:text-sm" />
          <span className="hidden xs:inline">Download Statement</span>
          <span className="xs:hidden">Download</span>
        </button>
      </div>

      {/* Filters row */}
      <div className="mt-4 w-full flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="w-full lg:flex-1 flex items-center gap-2 py-2.5 px-4 rounded-lg bg-[#141416] border border-gray-800">
          <FiSearch className="text-gray-400 text-base" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none bg-transparent placeholder:text-gray-500 text-white"
          />
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
          {/* Categories */}
          <div className="relative w-full sm:w-56" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setCategoryOpen((v) => !v)}
              className="w-full flex items-center justify-between bg-[#141416] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white"
            >
              <span className="truncate">{categoryLabel}</span>
              <FiChevronDown className={`text-gray-400 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
            </button>
            {categoryOpen ? <CategoryMenu /> : null}
          </div>

          {/* Types (UI-only) */}
          <div className="relative w-full sm:w-44" ref={typeRef}>
            <button
              type="button"
              onClick={() => setTypeOpen((v) => !v)}
              className="w-full flex items-center justify-between bg-[#141416] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white"
            >
              <span className="truncate">{uiType}</span>
              <FiChevronDown className={`text-gray-400 transition-transform ${typeOpen ? "rotate-180" : ""}`} />
            </button>
            {typeOpen ? <TypeMenu /> : null}
          </div>

          {/* Status */}
          <div className="relative w-full sm:w-44" ref={statusRef}>
            <button
              type="button"
              onClick={() => setStatusOpen((v) => !v)}
              className="w-full flex items-center justify-between bg-[#141416] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white"
            >
              <span className="truncate">{statusLabel}</span>
              <FiChevronDown className={`text-gray-400 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            {statusOpen ? <StatusMenu /> : null}
          </div>

          {/* Calendar (UI-only) */}
          <div className="relative w-full sm:w-40" ref={calendarRef}>
            <button
              type="button"
              onClick={() => setCalendarOpen((v) => !v)}
              className="w-full flex items-center justify-between bg-[#141416] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white"
            >
              <span className="truncate">{uiCalendar}</span>
              <FiChevronDown className={`text-gray-400 transition-transform ${calendarOpen ? "rotate-180" : ""}`} />
            </button>
            {calendarOpen ? <CalendarMenu /> : null}
          </div>
        </div>
      </div>

      <div className="mt-4 pb-10 w-full flex flex-col justify-center items-center gap-8 xs:gap-10">
        <div className="w-full bg-[#0A0A0A] border border-gray-800 rounded-2xl p-4">
          {tableLoading ? (
            <div className="flex flex-col gap-3 py-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-8"
                  baseColor={theme === "light" ? "#e0e0e0" : "#202020"}
                  highlightColor={theme === "light" ? "#f5f5f5" : "#444444"}
                />
              ))}
            </div>
          ) : hasTransactions ? (
            <>
              <div className="hidden md:block">
                <Table
                  data={transactionsData?.transactions || []}
                  columns={columns}
                  rowStyle={"secondary"}
                />
              </div>
              <div className="block md:hidden">
                <MobileTable
                  data={transactionsData?.transactions || []}
                  columns={columns}
                />
              </div>
            </>
          ) : (
            <EmptyState
              image={images.emptyState.emptyTransactions}
              title={"No transactions"}
              path={"/user/services"}
              placeholder={"Pay a bill"}
              showButton={false}
            />
          )}
        </div>

        {hasTransactions && (
          <Pagination
            pageCount={transactionsData?.totalPages}
            onPageChange={(newPage) => setPageNumber(newPage)}
            onPageSizeChange={(newSize) => setPageSize(newSize)}
            pageNumber={pageNumber}
          />
        )}
      </div>

      <DownloadStatementModal isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </div>
  );
};

export default TransactionsContent;
