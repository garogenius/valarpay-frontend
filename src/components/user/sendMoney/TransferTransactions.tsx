"use client";

import { useGetTransactions } from "@/api/wallet/wallet.queries";
import { TRANSACTION_CATEGORY } from "@/constants/types";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import Table from "../table/Table";
import EmptyState from "../table/EmptyState";
import images from "../../../../public/images";
import { useTheme } from "@/store/theme.store";
import MobileTable from "../table/MobileTable";
import { GenerateColumns } from "../table/columns";
import Pagination from "../table/Pagination";

const TransferTransactions = () => {
  const theme = useTheme();
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const { transactionsData, isPending, isError } = useGetTransactions({
    page: pageNumber,
    limit: pageSize,
    category: TRANSACTION_CATEGORY.TRANSFER,
  });

  const columns = GenerateColumns();

  const hasTransactions =
    transactionsData?.transactions && transactionsData.transactions.length > 0;
  const tableLoading = isPending && !isError;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex items-center justify-between gap-4">
        {" "}
        <h2 className="text-text-200 dark:text-text-800 text-xl sm:text-2xl font-semibold">
          Recent transactions{" "}
        </h2>
        <Link
          className="px-5 py-2 rounded-lg text-text-1000 font-medium text-sm border border-border-800"
          href={"/user/transactions"}
        >
          View all
        </Link>
      </div>

      <div className="pb-10  w-full flex flex-col justify-center items-center gap-8 xs:gap-10">
        <div className="w-full">
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
    </div>
  );
};

export default TransferTransactions;
