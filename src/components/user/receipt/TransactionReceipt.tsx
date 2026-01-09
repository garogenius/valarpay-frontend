"use client";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import useTransactionStore from "@/store/useTransaction.store";
import useNavigate from "@/hooks/useNavigate";
import ReceiptContainer from "./ReceiptFields";
import CustomButton from "@/components/shared/Button";
import { TRANSACTION_STATUS } from "@/constants/types";

const TransactionReceipt = () => {
  const transaction = useTransactionStore((state) => state.transaction);
  const navigate = useNavigate();

  if (typeof window === "undefined") {
    return null;
  }

  if (!transaction) {
    navigate("/user/transactions", "replace");
    return null;
  }

  const handleDownload = async () => {
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    root.render(<ReceiptContainer />);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = "transaction-receipt.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
    } finally {
      root.unmount();
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <ReceiptContainer />

      <CustomButton
        onClick={() => {
          if (transaction.status === TRANSACTION_STATUS.success) {
            handleDownload();
          }
        }}
        disabled={transaction.status !== TRANSACTION_STATUS.success}
        type="button"
        className="w-full max-w-[360px] py-3 text-white"
      >
        Download Receipt
      </CustomButton>
    </div>
  );
};

export default TransactionReceipt;
