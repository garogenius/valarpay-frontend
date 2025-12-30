import RedeemGiftCardStageOne from "./StageOne";
import GiftCardNav from "../GiftCardNav";

const RedeemGiftCardContent: React.FC<{ onSelectPath?: (path: string) => void }> = ({ onSelectPath }) => {
  return (
    <div className="flex flex-col gap-8">
      <GiftCardNav onSelectPath={onSelectPath} />

      <div className="w-full flex flex-col bg-white  dark:bg-bg-1100 px-0 2xs:px-4 xs:px-6 2xs:py-4 xs:py-6 2xl:py-8  rounded-lg sm:rounded-xl">
        <RedeemGiftCardStageOne />
      </div>
    </div>
  );
};

export default RedeemGiftCardContent;
