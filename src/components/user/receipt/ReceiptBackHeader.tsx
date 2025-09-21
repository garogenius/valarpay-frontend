"use client";
import { FaAngleLeft } from "react-icons/fa6";
import { GoShareAndroid } from "react-icons/go";
import cn from "classnames";
import useTransactionStore from "@/store/useTransaction.store";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import ReceiptContainer from "./ReceiptFields";
import { TRANSACTION_STATUS } from "@/constants/types";
import { useRouter } from "next/navigation";

const ReceiptBackHeader = () => {
  const router = useRouter();
  const { transaction } = useTransactionStore();

  const handleShare = async () => {
    console.log("sharing");

    // Create a temporary div and render the receipt
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    // Create root and render the ReceiptContainer content into the temp div
    const root = createRoot(tempDiv);
    root.render(<ReceiptContainer />);

    try {
      // Wait a moment for the content to render
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png", 1.0);
      });

      // Check if Web Share API is available
      if (navigator.share) {
        const file = new File([blob], "transaction-receipt.png", {
          type: "image/png",
        });
        await navigator.share({
          files: [file],
          title: "Transaction Receipt",
        });
      } else {
        // Fallback to download if sharing is not supported
        const link = document.createElement("a");
        link.download = "transaction-receipt.png";
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    } catch (error) {
      console.error("Error sharing/generating PNG:", error);
    } finally {
      // Clean up: unmount the root and remove the temporary div
      root.unmount();
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-2 text-text-200 dark:text-text-400 relative py-2">
      <div
        onClick={() => {
          router.back();
        }}
        className="flex items-center gap-1 sm:gap-1.5 cursor-pointer z-10"
      >
        <FaAngleLeft className="text-text-2100 text-xl" />
        <p className="block text-text-3700 text-lg">Back</p>
      </div>
      <button
        onClick={() => {
          if (transaction?.status === TRANSACTION_STATUS.success) {
            handleShare();
          }
        }}
        className={cn("flex items-center gap-1.5 ", {
          "text-text-200 dark:text-text-400 cursor-pointer":
            transaction?.status === TRANSACTION_STATUS.success,
          "opacity-50 cursor-not-allowed":
            transaction?.status !== TRANSACTION_STATUS.success,
        })}
      >
        <GoShareAndroid className="text-2xl" />
        <p className="text-base sm:text-lg font-medium ">Share Receipt</p>
      </button>
    </div>
  );
};

export default ReceiptBackHeader;
