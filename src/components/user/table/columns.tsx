// columns.ts
"use client";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { LuCopy } from "react-icons/lu";
import { Row } from "react-table";
import {
  BILL_TYPE,
  Transaction,
  TRANSACTION_CATEGORY,
  TRANSACTION_STATUS,
} from "@/constants/types";
import { handleCopy, shortenReference } from "@/utils/utilityFunctions";
import useNavigate from "@/hooks/useNavigate";
import useTransactionStore from "@/store/useTransaction.store";

const statusStyles: Record<string, string> = {
  success: "text-green-500",
  pending: "text-yellow-500",
  failed: "text-red-500",
};

export const GenerateColumns = () => {
  const navigate = useNavigate();
  const { setTransaction } = useTransactionStore();
  return [
    {
      Header: "Trx. Ref",
      accessor: "transactionRef",
      Cell: ({ value }: { value: string }) => {
        return (
          <div className="flex items-center gap-2">
            <p>{shortenReference({ ref: value })}</p>
            <button
              onClick={() => {
                handleCopy(value, () => {
                  toast.dismiss();
                  toast.success("Copied", {
                    duration: 3000,
                  });
                });
              }}
              className="hover:text-primary transition-colors"
            >
              <LuCopy className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
    {
      Header: "Category",
      accessor: "category",
      Cell: ({ value }: { value: TRANSACTION_CATEGORY }) => {
        return <span>{value}</span>;
      },
    },
    {
      Header: "Details",
      id: "details",
      accessor: "category",
      Cell: ({
        row,
        value,
      }: {
        row: Row<Transaction>;
        value: TRANSACTION_CATEGORY;
      }) => {
        if (value === TRANSACTION_CATEGORY.TRANSFER) {
          const transferDetails = row.original?.transferDetails;

          return (
            <span>
              To {transferDetails?.beneficiaryAccountNumber} -{" "}
              {transferDetails?.beneficiaryBankName} (
              {transferDetails?.beneficiaryName})
            </span>
          );
        } else if (value === TRANSACTION_CATEGORY.DEPOSIT) {
          const depositDetails = row.original?.depositDetails;
          return (
            <span>
              From {depositDetails?.senderAccountNumber} -{" "}
              {depositDetails?.senderBankName} ({depositDetails?.senderName})
            </span>
          );
        } else if (value === TRANSACTION_CATEGORY.BILL_PAYMENT) {
          const billDetails = row.original?.billDetails;

          return (
            <span className="capitalize">
              {billDetails?.type} purchase{" "}
              {billDetails.type !== BILL_TYPE.GIFTCARD &&
                `for ${billDetails?.recipientPhone}`}
            </span>
          );
        }
        return <span>N/A</span>;
      },
    },
    {
      Header: "Date & Time",
      accessor: "createdAt",
      Cell: ({ value }: { value: string }) => {
        return <span>{format(new Date(value), "yyyy-MM-dd '|' h:mm a")}</span>;
      },
    },
    // {
    //   Header: "Amount",
    //   id: "amount",
    //   accessor: "category",
    //   Cell: ({ value, row }: { value: string; row: Row<Transaction> }) => {
    //     if (value === TRANSACTION_CATEGORY.TRANSFER) {
    //       const transferDetails = row.original?.transferDetails;
    //       return <span>₦{transferDetails?.amount} </span>;
    //     } else if (value === TRANSACTION_CATEGORY.DEPOSIT) {
    //       const depositDetails = row.original?.depositDetails;
    //       return <span>₦{depositDetails?.amount}</span>;
    //     } else if (value === TRANSACTION_CATEGORY.BILL_PAYMENT) {
    //       const billDetails = row.original?.billDetails;
    //       return <span>₦{billDetails?.amount}</span>;
    //     }
    //     return <span>N/A</span>;
    //   },
    // },
    {
      Header: "Amount",
      id: "amountPaid",
      accessor: "category",
      Cell: ({ value, row }: { value: string; row: Row<Transaction> }) => {
        if (value === TRANSACTION_CATEGORY.TRANSFER) {
          const transferDetails = row.original?.transferDetails;
          return <span>₦{transferDetails?.amountPaid} </span>;
        } else if (value === TRANSACTION_CATEGORY.DEPOSIT) {
          const depositDetails = row.original?.depositDetails;
          return <span>₦{depositDetails?.amountPaid}</span>;
        } else if (value === TRANSACTION_CATEGORY.BILL_PAYMENT) {
          const billDetails = row.original?.billDetails;
          return <span>₦{billDetails?.amountPaid}</span>;
        }
        return <span>N/A</span>;
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }: { value: TRANSACTION_STATUS }) => {
        const status = value.toLowerCase() as keyof typeof statusStyles;

        return (
          <span
            className={`font-medium capitalize ${statusStyles[status] || ""}`}
          >
            {status}
          </span>
        );
      },
    },

    {
      Header: "Receipt",
      accessor: "",
      Cell: ({ row }: { row: Row<Transaction> }) => {
        const transaction = row.original;

        return (
          <span
            onClick={() => {
              setTransaction(transaction);
              navigate(`/user/receipt`);
            }}
            className={`cursor-pointer`}
          >
            View
          </span>
        );
      },
    },
  ];
};
