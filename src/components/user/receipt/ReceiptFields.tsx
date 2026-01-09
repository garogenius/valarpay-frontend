import { format } from "date-fns";
import useTransactionStore from "@/store/useTransaction.store";
import {
  Transaction,
  TRANSACTION_CATEGORY,
  TRANSFER_TYPE,
  TRANSACTION_STATUS,
} from "@/constants/types";

const currencySymbols: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const formatAmount = (value?: number, currency?: string) => {
  if (typeof value !== "number") {
    return "-";
  }

  const formattedNumber = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  const symbol = currency ? currencySymbols[currency] ?? "" : "";
  return `${symbol}${formattedNumber}`;
};

const formatDateLabel = (value?: string) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return format(parsed, "dd-MM-yyyy h:mm a");
};

const getTransactionAmount = (transaction: Transaction) => {
  if (typeof (transaction as any).amount === "number") {
    return (transaction as any).amount;
  }

  const detailAmount =
    transaction.transferDetails?.amountPaid ??
    transaction.depositDetails?.amountPaid ??
    transaction.billDetails?.amountPaid ??
    transaction.billDetails?.payAmount;

  if (typeof detailAmount === "number") {
    return detailAmount;
  }

  const maybeNumber =
    typeof detailAmount === "string" ? Number(detailAmount) : undefined;

  return Number.isFinite(maybeNumber ?? NaN) ? maybeNumber : undefined;
};

const getTransactionTypeLabel = (transaction: Transaction) => {
  if (transaction.category === TRANSACTION_CATEGORY.TRANSFER) {
    if (transaction.transferDetails?.transferType === TRANSFER_TYPE.INTER) {
      return "Inter-bank Transfer";
    }
    if (transaction.transferDetails?.transferType === TRANSFER_TYPE.INTRA) {
      return "ValarPay Transfer";
    }
    return "Transfer";
  }

  if (transaction.category === TRANSACTION_CATEGORY.DEPOSIT) {
    return "ValarPay Deposit";
  }

  if (transaction.category === TRANSACTION_CATEGORY.BILL_PAYMENT) {
    return "Bill Payment";
  }

  return "Transaction";
};

const getSenderName = (transaction: Transaction) =>
  transaction.transferDetails?.senderName ??
  transaction.depositDetails?.senderName ??
  transaction.wallet?.accountName ??
  "N/A";

const getBeneficiaryDetails = (transaction: Transaction) => {
  const name =
    transaction.transferDetails?.beneficiaryName ??
    transaction.depositDetails?.beneficiaryName ??
    transaction.billDetails?.recipientName ??
    transaction.billDetails?.recipientPhone ??
    "N/A";
  const account =
    transaction.transferDetails?.beneficiaryAccountNumber ??
    transaction.depositDetails?.beneficiaryAccountNumber ??
    transaction.billDetails?.recipientAccountNumber ??
    transaction.billDetails?.reference ??
    "";

  return account ? `${name} (${account})` : name;
};

const getBeneficiaryBank = (transaction: Transaction) =>
  transaction.transferDetails?.beneficiaryBankName ??
  transaction.depositDetails?.beneficiaryBankName ??
  transaction.billDetails?.billerName ??
  transaction.billDetails?.provider ??
  "N/A";

const getNarration = (transaction: Transaction) =>
  transaction.description ??
  transaction.transferDetails?.narration ??
  transaction.billDetails?.narration ??
  transaction.billDetails?.description ??
  "N/A";

const statusLabelMap: Record<TRANSACTION_STATUS, string> = {
  [TRANSACTION_STATUS.success]: "Successful",
  [TRANSACTION_STATUS.pending]: "Pending",
  [TRANSACTION_STATUS.failed]: "Failed",
};

const statusColorMap: Record<TRANSACTION_STATUS, string> = {
  [TRANSACTION_STATUS.success]: "text-[#22c55e]",
  [TRANSACTION_STATUS.pending]: "text-[#facc15]",
  [TRANSACTION_STATUS.failed]: "text-[#f43f5e]",
};

const ReceiptContainer = () => {
  const { transaction } = useTransactionStore();

  if (!transaction) return null;

  const displayFields = [
    {
      label: "Transaction Date",
      value: formatDateLabel(transaction.createdAt),
    },
    {
      label: "Transaction ID",
      value:
        transaction.transactionRef ??
        transaction.reference ??
        transaction.id ??
        "N/A",
    },
    {
      label: "Amount",
      value: formatAmount(getTransactionAmount(transaction), transaction.currency),
    },
    {
      label: "Currency",
      value: transaction.currency ?? "N/A",
    },
    {
      label: "Transaction Type",
      value: getTransactionTypeLabel(transaction),
    },
    {
      label: "Sender Name",
      value: getSenderName(transaction),
    },
    {
      label: "Beneficiary Details",
      value: getBeneficiaryDetails(transaction),
    },
    {
      label: "Beneficiary Bank",
      value: getBeneficiaryBank(transaction),
    },
    {
      label: "Narration",
      value: getNarration(transaction),
    },
    {
      label: "Status",
      value:
        statusLabelMap[transaction.status] ??
        transaction.status?.toString() ??
        "N/A",
      flag: "status",
    },
  ];

  const statusColor =
    statusColorMap[transaction.status] ?? "text-white";

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[520px] rounded-[26px] border border-[#2c2c2c] bg-[#0c0c0c] px-6 py-7 shadow-[0_15px_60px_rgba(0,0,0,0.65)] text-white">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.5em] text-white">
              VALARPAY
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#9da4b5]">
            Beyond Banking
          </p>
        </header>

        <div className="mt-4 flex justify-center">
          <span className="rounded-full bg-[#ff7200] px-7 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#080808] shadow-[0_10px_30px_rgba(255,114,0,0.45)]">
            Transaction Receipt
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-[#212121] bg-[#101010] p-4 text-sm text-[#f3f3f3]">
          <div className="divide-y divide-dashed divide-[#1f1f1f]">
            {displayFields.map((field, index) => (
              <div
                key={`${field.label}-${index}`}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-[0.45em] text-[#7c7c7c]">
                    {field.label}
                  </span>
                  {field.flag === "status" ? (
                    <span className={`text-sm font-semibold ${statusColor}`}>
                      {field.value}
                    </span>
                  ) : (
                    <p
                      className={`text-right ${
                        field.label === "Amount"
                          ? "text-lg font-semibold text-white"
                          : "text-xs text-[#efefef] break-words max-w-[60%]"
                      }`}
                    >
                      {field.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-center text-[#bcbcbc]">
          Thank you for banking with ValarPay. For support, contact us at{" "}
          <span className="text-[#f9f9f9]">Support@valarpay.com</span>, call{" "}
          <span className="text-[#f9f9f9]">+2348134146906</span> or visit{" "}
          <span className="text-[#f9f9f9]">
            C38C4 Suite 2nd Floor Eisson Plaza 9a New Market Road Main Market
            Onitsha
          </span>
        </p>
      </div>
    </div>
  );
};

export default ReceiptContainer;
