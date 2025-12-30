"use client";

import { useGetTransactions } from "@/api/wallet/wallet.queries";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import EmptyState from "../table/EmptyState";
import images from "../../../../public/images";
import { useTheme } from "@/store/theme.store";
import TransactionItem from "./TransactionItem";

const RecentTransactions = () => {
  const theme = useTheme();
  const pageSize = 5;
  const pageNumber = 1;

  const { transactionsData, isPending, isError } = useGetTransactions({
    page: pageNumber,
    limit: pageSize,
  });

  const hasTransactions =
    transactionsData?.transactions && transactionsData.transactions.length > 0;
  const tableLoading = isPending && !isError;

  return (
    <div className="flex flex-col gap-4 bg-[#1C1C1E] rounded-xl p-4 sm:p-6">
      <div className="w-full flex items-center justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Recent Transactions
        </h2>
        <Link
          className="text-[#FF6B2C] hover:text-[#FF7D3D] font-medium text-xs sm:text-sm transition-colors"
          href={"/user/transactions"}
        >
          View All
        </Link>
      </div>

      <div className="w-full flex flex-col">
        {tableLoading ? (
          <div className="flex flex-col gap-3 py-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-16"
                baseColor="#2C2C2E"
                highlightColor="#3A3A3C"
              />
            ))}
          </div>
        ) : hasTransactions ? (
          <div className="flex flex-col">
            {transactionsData?.transactions.slice(0, 5).map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
