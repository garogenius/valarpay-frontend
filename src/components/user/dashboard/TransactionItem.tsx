"use client";

import { Transaction, TRANSACTION_CATEGORY } from "@/constants/types";
import { format } from "date-fns";
import { FiSmartphone, FiWifi, FiArrowUp, FiArrowDown, FiEye } from "react-icons/fi";
import useGlobalModalsStore from "@/store/globalModals.store";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { showTransactionHistoryModal } = useGlobalModalsStore();

  const getIcon = () => {
    if (transaction.category === TRANSACTION_CATEGORY.TRANSFER) {
      return transaction.type === "DEBIT" ? (
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
          <FiArrowUp className="text-red-500 text-lg" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
          <FiArrowDown className="text-green-500 text-lg" />
        </div>
      );
    } else if (transaction.category === TRANSACTION_CATEGORY.BILL_PAYMENT) {
      const billType = transaction.billDetails?.type;
      if (billType === "airtime") {
        return (
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <FiSmartphone className="text-[#FF6B2C] text-lg" />
          </div>
        );
      } else if (billType === "data") {
        return (
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <FiWifi className="text-[#FF6B2C] text-lg" />
          </div>
        );
      }
    }
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
        <FiArrowUp className="text-gray-500 text-lg" />
      </div>
    );
  };

  const getTitle = () => {
    if (transaction.category === TRANSACTION_CATEGORY.TRANSFER) {
      return transaction.type === "DEBIT"
        ? `Transfer to ${transaction.transferDetails?.beneficiaryName || "Unknown"}`
        : `Transfer From ${transaction.depositDetails?.senderName || "Unknown"}`;
    } else if (transaction.category === TRANSACTION_CATEGORY.BILL_PAYMENT) {
      const billType = transaction.billDetails?.type;
      return billType === "airtime" ? "Airtime Purchase" : "Mobile Data Purchase";
    }
    return "Transaction";
  };

  const getAmount = () => {
    const amount =
      transaction.transferDetails?.amountPaid ||
      transaction.depositDetails?.amountPaid ||
      transaction.billDetails?.amountPaid ||
      0;
    const isCredit = transaction.type === "CREDIT";
    return `${isCredit ? "+" : "-"}₦${amount.toLocaleString()}`;
  };

  const isCredit = transaction.type === "CREDIT";

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {getIcon()}
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-white truncate">{getTitle()}</p>
          <p className="text-[10px] sm:text-xs text-gray-400">
            {format(new Date(transaction.createdAt), "MMM dd, yyyy hh:mm a")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${isCredit ? "text-green-500" : "text-red-500"}`}>
          {getAmount()}
        </p>
        <button
          onClick={() => showTransactionHistoryModal(transaction)}
          className="text-[#f76301] hover:text-[#e55a00] transition-colors"
          aria-label="View transaction"
        >
          <FiEye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
