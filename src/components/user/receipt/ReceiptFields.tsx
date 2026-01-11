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
      <div id="receipt-content" className="w-full max-w-[500px] bg-[#000000] p-8 shadow-2xl text-white font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            {/* Use real brand logo (not placeholder) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="ValarPay logo"
              crossOrigin="anonymous"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-bold text-xl tracking-tight leading-none relative top-px">VALARPAY</span>
          </div>
          <span className="text-white/90 text-sm font-medium">Beyond Banking</span>
        </div>

        {/* Title */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#f76301] px-10 py-3 rounded-xl">
            <span className="text-black font-bold text-lg uppercase tracking-wider">Transaction Receipt</span>
          </div>
        </div>

        {/* Content Rows */}
        <div className="space-y-1">
          {displayFields.map((field, index) => (
            <div key={`${field.label}-${index}`}>
              <div className="flex items-center justify-between py-4">
                <span className="text-white/60 text-sm">
                  {/* Handle the weird double Transaction Date label from screenshot if it's the type field */}
                  {field.label === "Transaction Type" ? "Transaction Date" : field.label}
                </span>
                <span className={`text-sm font-medium ${
                  field.flag === "status" ? "text-[#22C55E] font-bold" : "text-white"
                } ${
                  field.label === "Sender Name" || field.label === "Beneficiary Details" ? "uppercase" : ""
                } text-right max-w-[65%] truncate`}>
                  {field.value}
                </span>
              </div>
              <div className="w-full border-b border-dotted border-[#f76301] mb-1" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-left">
          <p className="text-[10px] text-white/70 leading-relaxed font-light">
            Thank you for banking with ValarPay. For support, contact us at <span className="text-white">Support@valarpay.com</span>, 
            call <span className="text-white">+2348134146906</span> or Head Office: C3&C4 Suite 2nd Floor Ejison Plaza 9a New Market Road Main Market Onitsha
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptContainer;
