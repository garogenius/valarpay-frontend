import RedeemGiftCardStageOne from "./StageOne";
import GiftCardNav from "../GiftCardNav";

const RedeemGiftCardContent = () => {
  return (
    <div className="flex flex-col gap-8">
      <GiftCardNav />

      <div className="w-full flex flex-col 2xs:bg-bg-600 2xs:dark:bg-bg-1100 px-0 2xs:px-4 xs:px-6 2xs:py-4 xs:py-6 2xl:py-8  rounded-lg sm:rounded-xl">
        <RedeemGiftCardStageOne />
      </div>
    </div>
  );
};

export default RedeemGiftCardContent;
