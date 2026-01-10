import ReceiptBackHeader from "./ReceiptBackHeader";
import TransactionReceipt from "./TransactionReceipt";

const ReceiptContent = () => {
  return (
    <div className="min-h-screen bg-[#050505] px-4 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6">
      <ReceiptBackHeader />
            <TransactionReceipt />
      </div>
    </div>
  );
};

export default ReceiptContent;
