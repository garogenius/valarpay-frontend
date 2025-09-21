import { CgClose } from "react-icons/cg";

interface RedeemInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruction: {
    concise: string;
    verbose: string;
  };
}

const RedeemInstructionModal: React.FC<RedeemInstructionModalProps> = ({
  isOpen,
  onClose,
  instruction,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="z-[999999] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black/80 dark:bg-black/60"></div>
        </div>
        <div className="mx-2.5 2xs:mx-4 relative bg-bg-600 dark:bg-bg-1100 px-4 xs:px-8 md:px-12 w-[95%] max-w-4xl max-h-[90%] rounded-2xl ">
          <span
            onClick={onClose}
            className="absolute top-4 xs:top-6 right-4 xs:right-6 p-2 cursor-pointer bg-bg-1400 rounded-full"
          >
            <CgClose className="text-xl text-black" />
          </span>

          <div className=" text-wrap w-full flex flex-col   gap-3 xs:gap-6 py-12 lg:py-20">
            <h1 className="mt-4 text-2xl xs:text-3xl xl:text-4xl font-semibold  text-text-200 dark:text-text-400">
              Redeem Instructions
            </h1>

            <div className="w-full flex flex-col gap-2 overflow-x-hidden">
              <p className="text-sm text-primary">{instruction?.concise}</p>
              <p className="text-sm text-primary">{instruction?.verbose}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RedeemInstructionModal;
