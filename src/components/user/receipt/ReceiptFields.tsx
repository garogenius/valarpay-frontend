import images from "../../../../public/images";
import { LuHeart } from "react-icons/lu";
import Image from "next/image";
import { format } from "date-fns";
import useTransactionStore from "@/store/useTransaction.store";

import {
  BILL_TYPE,
  Transaction,
  TRANSACTION_CATEGORY,
} from "@/constants/types";

type FieldMapping = {
  label: string;
  value: string;
};

export const statusStyles: Record<string, string> = {
  default: "px-3 py-1.5 rounded-full text-xs font-medium capitalize",
  defaultReceipt: "px-3 pb-3.5 rounded-full text-xs font-medium capitalize",
  success: "bg-green-400 text-green-800",
  pending: "bg-yellow-400 text-yellow-800",
  failed: "bg-red-400 text-red-800",
};

export const getTransactionDetails = (
  transaction: Transaction,
  fields: FieldMapping[]
): {
  label: string;
  value: string;
  isStatus?: boolean;
  isReference?: boolean;
}[] => {
  const isFailedTransaction = transaction?.status?.toLowerCase() === "failed";

  return fields
    .filter((field) => {
      // Hide reference fields if transaction failed

      if (isFailedTransaction) {
        return !["Reference", "Transaction ID"].includes(field.label);
      }

      return true;
    })
    .map((field) => ({
      label: field.label,
      value: field.value.replace(/\{([^}]+)\}/g, (match, key: string) => {
        if (key === "createdAt") {
          return format(
            new Date(transaction.createdAt),
            "yyyy-MM-dd '|' h:mm a"
          );
        }

        // Handle nested properties
        const props = key.split(".");
        let value: unknown = transaction;
        for (const prop of props) {
          if (value && typeof value === "object") {
            value = (value as Record<string, unknown>)[prop];
          } else {
            value = undefined;
          }
        }
        return String(value ?? "0");
      }),
      isStatus: field.label === "Status",
      isReference:
        field.label === "Transaction Ref" || field.label === "Reference",
    }));
};

export const depositFields = [
  { label: "Transaction Ref", value: "{transactionRef}" },
  { label: "Category", value: "{category}" },
  { label: "Currency", value: "{currency}" },
  { label: "Transaction Type", value: "{type}" },

  { label: "Total Amount Paid", value: "₦{depositDetails.amountPaid}" },
  { label: "Sender Name", value: "{depositDetails.senderName}" },
  { label: "Sender Bank Name", value: "{depositDetails.senderBankName}" },
  {
    label: "Sender Account Number",
    value: "{depositDetails.senderAccountNumber}",
  },

  { label: "Beneficiary Name", value: "{depositDetails.beneficiaryName}" },
  {
    label: "Beneficiary Bank Name",
    value: "{depositDetails.beneficiaryBankName}",
  },
  {
    label: "Beneficiary Account Number",
    value: "{depositDetails.beneficiaryAccountNumber}",
  },

  { label: "Status", value: "{status}" },

  { label: "Balance Before", value: "₦{previousBalance}" },
  { label: "Balance After", value: "₦{currentBalance}" },
  { label: "Date & Time", value: "{createdAt}" },
];

export const transferFields = [
  { label: "Transaction Ref", value: "{transactionRef}" },
  { label: "Category", value: "{category}" },
  { label: "Currency", value: "{currency}" },
  { label: "Transaction Type", value: "{type}" },

  { label: "Total Amount Paid", value: "₦{transferDetails.amountPaid}" },
  { label: "Sender Name", value: "{transferDetails.senderName}" },
  { label: "Sender Bank Name", value: "{transferDetails.senderBankName}" },
  {
    label: "Sender Account Number",
    value: "{transferDetails.senderAccountNumber}",
  },

  { label: "Beneficiary Name", value: "{transferDetails.beneficiaryName}" },
  {
    label: "Beneficiary Bank Name",
    value: "{transferDetails.beneficiaryBankName}",
  },
  {
    label: "Beneficiary Account Number",
    value: "{transferDetails.beneficiaryAccountNumber}",
  },

  { label: "Status", value: "{status}" },

  { label: "Balance Before", value: "₦{previousBalance}" },
  { label: "Balance After", value: "₦{currentBalance}" },
  { label: "Date & Time", value: "{createdAt}" },
];

export const networksFields = [
  { label: "Transaction Ref", value: "{transactionRef}" },
  { label: "Category", value: "{category}" },
  { label: "Currency", value: "{currency}" },
  { label: "Transaction Type", value: "{type}" },

  { label: "Total Amount Paid", value: "₦{billDetails.amountPaid}" },
  { label: "Bill Type", value: "{billDetails.type}" },
  { label: "Network", value: "{billDetails.network}" },
  { label: "Recipient", value: "{billDetails.recipientPhone}" },

  { label: "Status", value: "{status}" },

  { label: "Balance Before", value: "₦{previousBalance}" },
  { label: "Balance After", value: "₦{currentBalance}" },
  { label: "Date & Time", value: "{createdAt}" },
];

export const electricityFields = [
  { label: "Transaction Ref", value: "{transactionRef}" },
  { label: "Category", value: "{category}" },
  { label: "Currency", value: "{currency}" },
  { label: "Transaction Type", value: "{type}" },

  { label: "Total Amount Paid", value: "₦{billDetails.amountPaid}" },
  { label: "Bill Type", value: "{billDetails.type}" },
  { label: "Recipient", value: "{billDetails.recipientPhone}" },
  { label: "Reference", value: "{billDetails.reference}" },

  { label: "Status", value: "{status}" },

  { label: "Balance Before", value: "₦{previousBalance}" },
  { label: "Balance After", value: "₦{currentBalance}" },
  { label: "Date & Time", value: "{createdAt}" },
];

export const giftCardFields = [
  { label: "Transaction Ref", value: "{transactionRef}" },
  { label: "Category", value: "{category}" },
  { label: "Currency", value: "{currency}" },
  { label: "Transaction Type", value: "{type}" },

  { label: "Total Amount Paid", value: "₦{billDetails.amountPaid}" },
  { label: "Bill Type", value: "{billDetails.type}" },
  { label: "Transaction ID", value: "{billDetails.transactionId}" },

  { label: "Status", value: "{status}" },

  { label: "Balance Before", value: "₦{previousBalance}" },
  { label: "Balance After", value: "₦{currentBalance}" },
  { label: "Date & Time", value: "{createdAt}" },
];

export const defaultBillsFields = [
  { label: "Transaction Ref", value: "{transactionRef}" },
  { label: "Category", value: "{category}" },
  { label: "Currency", value: "{currency}" },
  { label: "Transaction Type", value: "{type}" },

  { label: "Total Amount Paid", value: "₦{billDetails.amountPaid}" },
  { label: "Bill Type", value: "{billDetails.type}" },
  { label: "Recipient", value: "{billDetails.recipientPhone}" },

  { label: "Status", value: "{status}" },

  { label: "Balance Before", value: "₦{previousBalance}" },
  { label: "Balance After", value: "₦{currentBalance}" },
  { label: "Date & Time", value: "{createdAt}" },
];

export const getBillsFields = (transaction: Transaction) => {
  const billsFields =
    transaction.billDetails?.type === BILL_TYPE.AIRTIME ||
      transaction.billDetails?.type === BILL_TYPE.DATA
      ? networksFields
      : transaction.billDetails?.type === BILL_TYPE.ELECTRICITY
        ? electricityFields
        : transaction.billDetails?.type === BILL_TYPE.GIFTCARD
          ? giftCardFields
          : defaultBillsFields;
  switch (transaction?.category) {
    case TRANSACTION_CATEGORY.DEPOSIT:
      return depositFields;
    case TRANSACTION_CATEGORY.BILL_PAYMENT:
      return billsFields;
    case TRANSACTION_CATEGORY.TRANSFER:
      return transferFields;

    default:
      return [];
  }
};

const ReceiptContainer = () => {
  const { transaction } = useTransactionStore();

  if (!transaction) return null;

  const fields = getBillsFields(transaction);

  return (
    <div id="receipt-container" className="flex flex-col min-h-screen mx-auto">
      <div className="bg-bg-1100 pb-10 px-4">
        <div className="flex flex-col py-8 px-8 gap-4 border-b border-dashed border-bg-11200">
          <div className="flex gap-3">
            <Image src={images.logo} alt="logo" className="w-40" />
          </div>
          <div className="flex gap-8 text-xs text-white">
            <a
              className="w-full flex items-center gap-2"
              href="https://www.valarpay.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-lg">🌐</span>
              <span className="text-white">www.valarpay.com</span>
            </a>
            <a
              className="w-full flex items-center gap-2"
              href="mailto:info@valarpay.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-lg">✉️</span>
              <span className="text-white">support@valarpay.com</span>
            </a>
            <a
              className="w-full flex items-center gap-2"
              href="tel:+2348134146906"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-lg">📞</span>
              <span className="text-white">+2348134146906</span>
            </a>
          </div>
        </div>

        {/* <div className="flex flex-col gap-2 py-8 px-8 text-xs text-white">
          <p>
            {user?.firstName} {user?.lastName}
          </p>
          <p>{user?.email}</p>
          <p>{user?.phoneNumber}</p>
        </div> */}
      </div>

      <div className="flex flex-col justify-center items-center bg-white text-black py-8  rounded-lg mb-8">
        <h2 className="text-center text-text-5600 mb-6">TRANSACTION DETAILS</h2>
        <div className="text-text-2600 w-[80%] flex flex-col justify-center items-center">
          {getTransactionDetails(transaction, fields)
            .filter(
              (detail) =>
                detail.label !== "Transaction Ref" &&
                detail.label !== "Balance Before" &&
                detail.label !== "Balance After"
            )
            .map((detail, index) => (
              <div
                key={index}
                className="border-b border-bg-1000 font-medium text-sm w-full flex items-center justify-between py-4"
              >
                <p>{detail.label}</p>
                {detail.isStatus ? (
                  <span
                    className={`${statusStyles.defaultReceipt} ${statusStyles[detail.value.toLowerCase()]
                      }`}
                  >
                    {detail.value}
                  </span>
                ) : (
                  <p>{detail.value}</p>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="bg-bg-11300 flex justify-center items-center py-16">
        <div className="w-[80%]  text-center flex flex-col gap-4 justify-center items-center">
          <p className="text-base text-white">
            Sign up today to experience seamless financial transactions and
            enjoy our comprehensive fintech services.
          </p>
        </div>
      </div>

      <div className="bg-white flex justify-center items-center py-16">
        <div className="w-[80%] text-center flex flex-col gap-4 justify-center items-center">
          <LuHeart className="text-2xl text-text-3500" />
          <p className="text-base text-text-5700">
            Thank you for using Valarpay! For any inquiries, contact us at{" "}
            <a href="mailto:support@valarpay.com" className="text-primary">
              support@valarpay.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptContainer;
