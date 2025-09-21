"use client";

import WalletCard from "./WalletCard";
import useUserStore from "@/store/user.store";
import WalletTransactions from "./walletTransactions";
import { useState } from "react";

const WalletContent = () => {
  const { user } = useUserStore();
  const [currency, setCurrency] = useState("ngn");

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
        {user?.wallet?.map((wallet) => (
          <WalletCard
            key={wallet.id}
            currency={wallet.currency.toLowerCase()}
            balance={wallet.balance || 0}
            active={wallet.currency.toLowerCase() === currency}
            path={`/user/add-funds/${wallet.currency.toLowerCase()}`}
            setCurrency={setCurrency}
          />
        ))}
      </div>
      <WalletTransactions />
    </div>
  );
};

export default WalletContent;
