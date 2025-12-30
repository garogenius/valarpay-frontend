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
  TRANSACTION_TYPE,
} from "@/constants/types";
import { handleCopy, shortenReference } from "@/utils/utilityFunctions";
import useNavigate from "@/hooks/useNavigate";
import useTransactionStore from "@/store/useTransaction.store";

const statusPills: Record<string, string> = {
  success: "bg-green-500/15 text-green-400 border-green-700/40",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-700/40",
  failed: "bg-red-500/15 text-red-400 border-red-700/40",
};

const typeAmountStyle: Record<string, string> = {
  credit: "text-green-400",
  debit: "text-red-400",
};

export const GenerateColumns = () => {
  const navigate = useNavigate();
  const { setTransaction } = useTransactionStore();
  return [
    {
      Header: "Transaction ID",
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
      Header: "Type",
      accessor: "category",
      Cell: ({ value }: { value: TRANSACTION_CATEGORY }) => {
        if (value === TRANSACTION_CATEGORY.TRANSFER) return <span>Intra-bank Transfer</span>;
        if (value === TRANSACTION_CATEGORY.DEPOSIT) return <span>Deposit</span>;
        if (value === TRANSACTION_CATEGORY.BILL_PAYMENT) return <span>Bill Payment</span>;
        return <span>{value}</span>;
      },
    },
    {
      Header: "Narration",
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
              Transfer{" "}
              {transferDetails?.beneficiaryName
                ? `to ${transferDetails.beneficiaryName}`
                : transferDetails?.beneficiaryAccountNumber
                  ? `to ${transferDetails.beneficiaryAccountNumber}`
                  : ""}
            </span>
          );
        } else if (value === TRANSACTION_CATEGORY.DEPOSIT) {
          const depositDetails = row.original?.depositDetails;
          return (
            <span>
              Deposit{" "}
              {depositDetails?.senderName
                ? `from ${depositDetails.senderName}`
                : depositDetails?.senderAccountNumber
                  ? `from ${depositDetails.senderAccountNumber}`
                  : ""}
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
        return <span>{format(new Date(value), "MM-dd-yyyy h:mm a")}</span>;
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
        const ttype = String((row.original as any)?.type || "").toLowerCase() as keyof typeof typeAmountStyle;
        const sign = ttype === "debit" ? "-" : ttype === "credit" ? "+" : "";
        if (value === TRANSACTION_CATEGORY.TRANSFER) {
          const transferDetails = row.original?.transferDetails;
          return <span className={typeAmountStyle[ttype] || ""}>{sign}₦{transferDetails?.amountPaid} </span>;
        } else if (value === TRANSACTION_CATEGORY.DEPOSIT) {
          const depositDetails = row.original?.depositDetails;
          return <span className={typeAmountStyle[ttype] || ""}>{sign}₦{depositDetails?.amountPaid}</span>;
        } else if (value === TRANSACTION_CATEGORY.BILL_PAYMENT) {
          const billDetails = row.original?.billDetails;
          return <span className={typeAmountStyle[ttype] || ""}>{sign}₦{billDetails?.amountPaid}</span>;
        }
        return <span>N/A</span>;
      },
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }: { value: TRANSACTION_STATUS }) => {
        const status = value.toLowerCase() as keyof typeof statusPills;
        const cls = statusPills[status] || "bg-white/5 text-gray-300 border-gray-800";
        const label = status === "success" ? "Completed" : status === "pending" ? "Processing" : "Failed";
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium border ${cls}`}>
            {label}
          </span>
        );
      },
    },

    // Receipt column intentionally hidden for Transaction History UI (row details live in receipt page)
  ];
};
