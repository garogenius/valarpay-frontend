"use client";

import TransferProcess from "./TransferProcess";
import TransferTransactions from "./TransferTransactions";

const SendMoneyContent = () => {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <TransferProcess />
      <TransferTransactions />
    </div>
  );
};

export default SendMoneyContent;
