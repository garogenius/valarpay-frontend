import ReceiptBackHeader from "./ReceiptBackHeader";
import TransactionReceipt from "./TransactionReceipt";

const ReceiptContent = () => {
  return (
    <div className="w-full min-h-full flex flex-col ">
      <ReceiptBackHeader />
      <div className="w-full h-full bg-bg-600 dark:bg-bg-1100 mt-4 mb-8 py-8 sm:py-10 px-5 md:px-10 flex flex-col items-center justify-center gap-8 md:gap-10 rounded-xl">
        <div className="flex justify-center items-center w-full">
          <div className="w-full xl:w-[90%] flex flex-col justify-center items-center gap-10 sm:gap-12">
            <div className="w-[90%] xs:w-[80%] sm:w-[70%] md:w-[60%] flex flex-col gap-1.5 xs:gap-2 justify-center items-center text-center">
              <h2 className="text-xl 2xs:text-2xl sm:text-3xl font-bold text-text-200 dark:text-text-400">
                Transaction Details{" "}
              </h2>

              {/* <p className="text-text-100 text-sm 2xs:text-base sm:text-lg w-full"></p> */}
            </div>

            <TransactionReceipt />
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default ReceiptContent;
