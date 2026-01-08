"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import NextImage from "next/image";
import Link from "next/link";
import useUserStore from "@/store/user.store";
import { useGetNotifications } from "@/api/notification/notification.queries";
import { NotificationItem } from "@/api/notification/notification.types";
import { format, formatDistanceToNow } from "date-fns";
import { FiArrowDownLeft, FiArrowUpRight, FiCheckCircle, FiXCircle, FiChevronDown, FiPlus, FiClock, FiCopy } from "react-icons/fi";
import { LuWifi } from "react-icons/lu";
import { getCurrencyIconByString } from "@/utils/utilityFunctions";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { LuCopy } from "react-icons/lu";
import CardPreview from "@/components/user/cards/CardPreview";
import ChangePinModal from "@/components/modals/ChangePinModal";
import BlockCardModal from "@/components/modals/BlockCardModal";
import { useGetWalletAccounts, useCreateMultiCurrencyAccount, useCreateVirtualCard, useGetVirtualCardDetails } from "@/api/wallet/wallet.queries";
import { WalletAccount, VirtualCard, WALLET_PROVIDER } from "@/api/wallet/wallet.types";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import CustomButton from "@/components/shared/Button";
import Tier2UpgradeModal from "@/components/modals/UpgradeTier2Modal";
import Tier3UpgradeModal from "@/components/modals/UpgradeTier3Modal";
import { FiCreditCard } from "react-icons/fi";

const AccountsContent: React.FC = () => {
  const { user } = useUserStore();

  const { notifications, isPending, isError } = useGetNotifications();
  const recent = (notifications || []).slice(0, 6);
  const hasActivity = recent.length > 0;

  // Fetch currency accounts (must be declared before useMemo that uses it)
  const { accounts: walletAccounts, isPending: accountsLoading, refetch: refetchAccounts } = useGetWalletAccounts();

  // Get all available currencies dynamically
  const allAvailableCurrencies = useMemo(() => {
    const currenciesSet = new Set<string>();
    
    // Add NGN from wallet
    if (user?.wallet?.some(w => (w.currency || "").toUpperCase() === "NGN")) {
      currenciesSet.add("NGN");
    }
    
    // Add all currencies from wallet accounts
    walletAccounts?.forEach((acc: WalletAccount) => {
      const currency = (acc.currency || "").toUpperCase();
      if (currency) {
        currenciesSet.add(currency);
      }
    });
    
    // Always include common currencies even if not created yet
    ["NGN", "USD", "EUR", "GBP"].forEach(curr => currenciesSet.add(curr));
    
    return Array.from(currenciesSet).sort();
  }, [user?.wallet, walletAccounts]);

  // Initialize currency state
  type Currency = string;
  const initialCurrency = String(user?.wallet?.[0]?.currency || "NGN").toUpperCase();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(initialCurrency);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [accountLabel, setAccountLabel] = useState("");
  
  // Filter for non-NGN currency accounts
  const currencyAccounts = useMemo(() => {
    return (walletAccounts || []).filter((acc: WalletAccount) => acc.currency !== "NGN");
  }, [walletAccounts]);

  // For cards, we'll use a simplified approach since the API stores cards individually
  // This is a placeholder - you may need to implement a proper cards list API
  const [storedCardId, setStoredCardId] = useState<string>("");
  const [cards, setCards] = useState<any[]>([]);
  const cardsLoading = false;
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cardId = localStorage.getItem("usdVirtualCardId") || "";
      setStoredCardId(cardId);
    }
  }, []);
  
  const { card: virtualCard } = useGetVirtualCardDetails({
    cardId: storedCardId || undefined,
    provider: "graph" as WALLET_PROVIDER,
    enabled: !!storedCardId && selectedCurrency === "USD",
  });
  
  // Convert single card to array format for compatibility
  const cardsArray = useMemo(() => {
    if (virtualCard && selectedCurrency === "USD") {
      return [{
        id: virtualCard.cardId,
        maskedNumber: virtualCard.cardNumber?.replace(/(\d{4})\d{8}(\d{4})/, "$1****$2") || "****",
        brand: "visa",
        cardholder: user?.fullname || "CARD HOLDER",
        expiryMonth: virtualCard.expiryMonth,
        expiryYear: virtualCard.expiryYear,
        balance: 0, // Card balance not available in API
        status: virtualCard.status || "ACTIVE",
        isVirtual: true,
        currency: "USD",
      }];
    }
    return [];
  }, [virtualCard, selectedCurrency, user?.fullname]);
  
  const refetchCards = () => {
    refetchAccounts();
    if (typeof window !== "undefined") {
      const cardId = localStorage.getItem("usdVirtualCardId") || "";
      setStoredCardId(cardId);
    }
  };
  
  // Filter cards for selected currency (including NGN)
  const currencyCards = useMemo(() => {
    return cardsArray.filter((card: any) => 
      card.isVirtual && 
      (card.currency || "").toUpperCase() === selectedCurrency
    );
  }, [cardsArray, selectedCurrency]);

  // Find currency account for selected currency
  const currencyAccount = useMemo(() => {
    if (selectedCurrency === "NGN") {
      // NGN uses wallet
      return null;
    }
    return currencyAccounts.find((acc: WalletAccount) => 
      (acc.currency || "").toUpperCase() === selectedCurrency
    );
  }, [currencyAccounts, selectedCurrency]);

  // Fallback to wallet for NGN, or use currency account for others
  const activeWallet = useMemo(() => {
    if (selectedCurrency === "NGN") {
      return user?.wallet?.find(w => (w.currency || "").toUpperCase() === "NGN");
    }
    return null;
  }, [user?.wallet, selectedCurrency]);

  const bankName = selectedCurrency === "NGN" 
    ? (activeWallet?.bankName || "ValarPay")
    : (currencyAccount?.bankName || "ValarPay");
  const displayName = (user?.accountType === "BUSINESS" || user?.isBusiness) && user?.businessName
    ? user.businessName
    : user?.fullname || "-";
  
  const accountName = selectedCurrency === "NGN"
    ? (activeWallet?.accountName || displayName)
    : (currencyAccount?.accountName || displayName);
  const cardHolderOnly = (accountName || "").split("/").pop()?.trim() || accountName;
  const accountNumber = selectedCurrency === "NGN"
    ? (activeWallet?.accountNumber || "-")
    : (currencyAccount?.accountNumber || "-");
  const balance = selectedCurrency === "NGN"
    ? (activeWallet?.balance || 0)
    : (currencyAccount?.balance || 0);
  const tier = user?.tierLevel ? `Tier ${user.tierLevel === "one" ? "1" : user.tierLevel === "two" ? "2" : user.tierLevel === "three" ? "3" : "1"}` : "Tier 1";

  const onCreateAccountError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage || "Failed to create currency account"];

    ErrorToast({
      title: "Creation Failed",
      descriptions,
    });
  };

  const onCreateAccountSuccess = () => {
    SuccessToast({
      title: "Account Created Successfully!",
      description: `Your ${selectedCurrency} account has been created.`,
    });
    setShowCreateAccount(false);
    setAccountLabel("");
    refetchAccounts();
  };

  const { mutate: createAccount, isPending: creatingAccount } = useCreateMultiCurrencyAccount(
    onCreateAccountError,
    onCreateAccountSuccess
  );

  const onCreateCardError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    const descriptions = Array.isArray(errorMessage)
      ? errorMessage
      : [errorMessage || "Failed to create virtual card"];

    ErrorToast({
      title: "Creation Failed",
      descriptions,
    });
  };

  const onCreateCardSuccess = (data: any) => {
    SuccessToast({
      title: "Card Created Successfully!",
      description: `Your virtual ${selectedCurrency} card has been created.`,
    });
    const cardId = data?.data?.data?.cardId;
    if (cardId && typeof window !== "undefined") {
      localStorage.setItem("usdVirtualCardId", cardId);
      setStoredCardId(cardId);
    }
    setOpenCreateCard(false);
    setCardLabel("");
    refetchCards();
  };

  const { mutate: createCard, isPending: creatingCard } = useCreateVirtualCard(
    onCreateCardError,
    onCreateCardSuccess
  );

  const handleCreateCard = () => {
    if (selectedCurrency !== "USD") {
      ErrorToast({
        title: "Card Not Available",
        descriptions: [`${selectedCurrency} virtual cards are not available. Only USD virtual cards are available for now.`],
      });
      return;
    }

    if (!currencyAccount) {
      ErrorToast({
        title: "USD Account Required",
        descriptions: ["You must have a USD account before creating a virtual card. Please create a USD account first."],
      });
      return;
    }

    if (!cardLabel.trim()) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Card label is required"],
      });
      return;
    }

    const cardholderName = (user?.fullname || "CARD HOLDER").toUpperCase();
    createCard({
      walletId: currencyAccount.id,
      currency: "USD",
      cardholderName,
      provider: "graph" as WALLET_PROVIDER,
    });
  };

  const formatExpiry = (card: any) => {
    if (card.expiryMonth && card.expiryYear) {
      const month = String(card.expiryMonth).padStart(2, "0");
      const year = String(card.expiryYear).slice(-2);
      return `${month}/${year}`;
    }
    return "MM/YY";
  };

  const handleCreateAccount = () => {
    if (!accountLabel.trim()) {
      ErrorToast({
        title: "Validation Error",
        descriptions: ["Account label is required"],
      });
      return;
    }

    // Only allow creating accounts for USD, EUR, GBP (API supported currencies)
    if (!["USD", "EUR", "GBP"].includes(selectedCurrency)) {
      ErrorToast({
        title: "Currency Not Supported",
        descriptions: [`Account creation for ${selectedCurrency} is not available. Only USD, EUR, and GBP accounts can be created.`],
      });
      return;
    }

    createAccount({
      currency: selectedCurrency as "USD" | "EUR" | "GBP",
      provider: "graph" as WALLET_PROVIDER,
    });
  };

  // Switcher dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  // Card action modals
  const [openChangePin, setOpenChangePin] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);
  const [openTier2Modal, setOpenTier2Modal] = useState(false);
  const [openTier3Modal, setOpenTier3Modal] = useState(false);
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [cardLabel, setCardLabel] = useState("");
  const [selectedCard, setSelectedCard] = useState<any | null>(null);

  // Tier status calculations
  const tier1Active = user?.tierLevel === "one";
  const tier1Completed = user?.tierLevel === "one" || user?.tierLevel === "two" || user?.tierLevel === "three";
  const tier1CanUpgrade = !tier1Completed && (user?.tierLevel === "notSet" || !user?.tierLevel);

  const tier2Active = user?.tierLevel === "two";
  const tier2Completed = user?.tierLevel === "two" || user?.tierLevel === "three";
  const tier2CanUpgrade = (user?.tierLevel === "one" || user?.tierLevel === "notSet") && user?.isBvnVerified;

  const tier3Active = user?.tierLevel === "three";
  const tier3CanUpgrade = user?.tierLevel === "two" && user?.isNinVerified;

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header + Currency Switcher */}
      <div className="w-full flex flex-row items-center gap-2 sm:gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-base sm:text-xl lg:text-2xl font-semibold truncate">Accounts</h1>
          <p className="text-white/60 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1 line-clamp-1">Manage your account settings, limits, and verification</p>
        </div>
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#FF6B2C] text-black text-[10px] sm:text-xs lg:text-sm font-semibold px-2.5 sm:px-3 py-1.5 uppercase whitespace-nowrap"
          >
            <NextImage 
              src={getCurrencyIconByString(selectedCurrency.toLowerCase()) || ""} 
              alt="flag" 
              width={16} 
              height={16} 
              className="w-4 h-4" 
            />
            <span>{selectedCurrency} Account</span>
            <FiChevronDown className="text-black/80" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0A0A0A] border border-gray-800 shadow-2xl p-2 text-white z-50 max-h-96 overflow-y-auto">
              {allAvailableCurrencies.map((k) => {
                const isNGN = k === "NGN";
                const hasWallet = isNGN && user?.wallet?.some(w => (w.currency || "").toUpperCase() === k);
                const hasCurrencyAccount = !isNGN && currencyAccounts.some((acc: WalletAccount) => 
                  (acc.currency || "").toUpperCase() === k
                );
                const hasAccount = hasWallet || hasCurrencyAccount;
                
                return (
            <button
                    key={k}
                    onClick={() => { setSelectedCurrency(k); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 ${selectedCurrency === k ? "bg-white/10" : ""}`}
                  >
                    <NextImage 
                      src={getCurrencyIconByString(k.toLowerCase()) || ""} 
                      alt="flag" 
                      width={18} 
                      height={18} 
                      className="w-5 h-5" 
                    />
                    <span className="text-sm flex-1 text-white">{k} Account</span>
                    {hasAccount ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        Setup
                      </span>
                    )}
            </button>
                );
              })}
            </div>
            )}
          </div>
        </div>

      {/* Account details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-5">
          <h3 className="text-white font-semibold mb-4">Account Details</h3>
          
          {/* Show Create Account if account doesn't exist for non-NGN currencies */}
          {selectedCurrency !== "NGN" && !currencyAccount && !accountsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <FiPlus className="text-2xl text-white/40" />
              </div>
              <p className="text-white/60 text-sm text-center">
                You don't have a {selectedCurrency} account yet
              </p>
              {!showCreateAccount ? (
                <CustomButton
                  onClick={() => setShowCreateAccount(true)}
                  className="bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black px-6 py-2.5 rounded-lg text-sm font-medium"
              >
                Create {selectedCurrency} Account
                </CustomButton>
              ) : (
                <div className="w-full max-w-sm flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-white/70 text-xs">Account Label</label>
                    <input
                      className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-3 px-3 text-white text-sm placeholder:text-white/50 outline-none"
                      placeholder="e.g., Personal USD Account"
                      value={accountLabel}
                      onChange={(e) => setAccountLabel(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <CustomButton
                      onClick={() => {
                        setShowCreateAccount(false);
                        setAccountLabel("");
                      }}
                      className="flex-1 bg-transparent border border-white/15 text-white rounded-lg py-2.5"
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      onClick={handleCreateAccount}
                      disabled={creatingAccount || !accountLabel.trim()}
                      isLoading={creatingAccount}
                      className="flex-1 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black rounded-lg py-2.5"
                    >
                      Create
                    </CustomButton>
                  </div>
                </div>
              )}
            </div>
          ) : accountsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#FF6B2C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Copy All Account Details Button */}
              <div className="mb-4">
                <CustomButton
                  onClick={() => {
                    const accountDetails = `Account Name: ${accountName}\nAccount Number: ${accountNumber}\nBank Name: ${bankName}\nCurrency: ${selectedCurrency}`;
                    navigator.clipboard.writeText(accountDetails);
                    SuccessToast({
                      title: "Account Details Copied",
                      description: "All account details have been copied to clipboard",
                    });
                  }}
                  className="w-full bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black font-medium py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  <FiCopy />
                  <span>Copy Account Details</span>
                </CustomButton>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Bank Name</p>
                  <p className="text-white">{bankName}</p>
                </div>
                <div>
                  <p className="text-white/60">Account Name</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-white truncate">{accountName}</p>
                    <button
                      title="Copy"
                      onClick={() => {
                        navigator.clipboard.writeText(accountName);
                        SuccessToast({
                          title: "Copied",
                          description: "Account name copied to clipboard",
                        });
                      }}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <LuCopy className="w-4 h-4 text-white/80" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-white/60">Account Number</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-white">{accountNumber}</p>
                    <button
                      title="Copy"
                      onClick={() => {
                        navigator.clipboard.writeText(accountNumber);
                        SuccessToast({
                          title: "Copied",
                          description: "Account number copied to clipboard",
                        });
                      }}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <LuCopy className="w-4 h-4 text-white/80" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-white/60">Balance</p>
                  <p className="text-white">{selectedCurrency} {balance.toLocaleString()}</p>
                </div>
                {selectedCurrency === "NGN" && (
                  <div>
                    <p className="text-white/60">Account Tier</p>
                    <p className="text-white">{tier}</p>
                  </div>
                )}
              </div>

              {/* Virtual Cards - For non-NGN currencies */}
              {selectedCurrency !== "NGN" && (
                <div className="mt-5">
                  <h4 className="text-white font-medium mb-3">Virtual Cards</h4>
                  {selectedCurrency !== "USD" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                      <p className="text-yellow-400 text-sm font-medium mb-2">{selectedCurrency} Cards Not Available</p>
                      <p className="text-white/80 text-xs mb-1">• {selectedCurrency} virtual cards are not available at this time</p>
                      <p className="text-white/80 text-xs mb-1">• Only USD virtual cards are available for now</p>
                      <p className="text-white/80 text-xs">• You must have a USD account before creating a virtual card</p>
                    </div>
                  )}
                  {selectedCurrency === "USD" && (
                    <>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                        <p className="text-blue-400 text-xs font-medium mb-1">Note</p>
                        <p className="text-white/80 text-xs">• NGN cards are not available</p>
                        <p className="text-white/80 text-xs">• Only USD virtual cards are available for now</p>
                        <p className="text-white/80 text-xs">• You must have a USD account before creating a virtual card</p>
                      </div>
                      {cardsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-8 h-8 border-2 border-[#FF6B2C] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : currencyCards.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-4 border border-white/10 rounded-xl bg-white/5">
                          <div className="w-16 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <FiCreditCard className="text-2xl text-white/40" />
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-sm mb-2">No virtual USD card created</p>
                            {!currencyAccount ? (
                              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-3">
                                <p className="text-yellow-400 text-xs font-medium mb-1">USD Account Required</p>
                                <p className="text-white/80 text-xs">You must have a USD account before creating a virtual card. Please create a USD account above first.</p>
                </div>
                            ) : !openCreateCard ? (
                              <CustomButton
                                onClick={() => setOpenCreateCard(true)}
                                className="bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black px-6 py-2 rounded-lg text-sm font-medium"
                              >
                                Create Virtual Card
                              </CustomButton>
                            ) : (
                              <div className="w-full max-w-sm flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-white/70 text-xs">Card Label</label>
                                  <input
                                    className="w-full bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-2 px-3 text-white text-sm placeholder:text-white/50 outline-none"
                                    placeholder="e.g., Personal USD Card"
                                    value={cardLabel}
                                    onChange={(e) => setCardLabel(e.target.value)}
                                  />
                </div>
                                <div className="flex gap-2">
                                  <CustomButton
                                    onClick={() => {
                                      setOpenCreateCard(false);
                                      setCardLabel("");
                                    }}
                                    className="flex-1 bg-transparent border border-white/15 text-white rounded-lg py-2"
                                  >
                                    Cancel
                                  </CustomButton>
                                  <CustomButton
                                    onClick={handleCreateCard}
                                    disabled={creatingCard || !cardLabel.trim() || !currencyAccount}
                                    isLoading={creatingCard}
                                    className="flex-1 bg-[#FF6B2C] hover:bg-[#FF7A3D] text-black rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Create Card
                                  </CustomButton>
                </div>
                              </div>
                            )}
              </div>
            </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {currencyCards.map((card: any) => (
                            <div key={card.id} className="border border-white/10 rounded-xl p-4 bg-white/5">
                              <CardPreview
                                variant="dark"
                                brand={card.brand || "visa"}
                                cardholder={card.cardholder || cardHolderOnly}
                                maskedNumber={card.maskedNumber}
                                expiry={formatExpiry(card)}
                                issuerName="ValarPay"
                                status={card.status === "ACTIVE" ? "active" : card.status === "FROZEN" ? "frozen" : "frozen"}
                                isVirtual={true}
                                className="h-44 sm:h-48 max-w-sm w-full"
                              />
                              <div className="mt-3 flex items-center justify-between">
                <div>
                                  <p className="text-white/60 text-xs">Balance</p>
                                  <p className="text-white text-lg font-semibold">{card.currency} {card.balance.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white/60 text-xs">Status</p>
                                  <p className={`text-xs font-medium capitalize ${
                                    card.status === "ACTIVE" ? "text-green-400" :
                                    card.status === "FROZEN" ? "text-yellow-400" :
                                    card.status === "BLOCKED" ? "text-red-400" :
                                    "text-gray-400"
                                  }`}>
                                    {card.status.toLowerCase()}
                  </p>
                </div>
                              </div>
                              <div className="mt-3 flex gap-2">
                                <CustomButton
                                  onClick={() => {
                                    setSelectedCard(card);
                                  }}
                                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-lg text-sm"
                                >
                                  View Details
                                </CustomButton>
                              </div>
                            </div>
                          ))}
              </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Virtual Cards - For NGN */}
              {selectedCurrency === "NGN" && (
                <div className="mt-5">
                  <h4 className="text-white font-medium mb-3">Virtual Cards</h4>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                    <p className="text-yellow-400 text-sm font-medium mb-2">NGN Cards Not Available</p>
                    <p className="text-white/80 text-xs mb-1">• NGN virtual cards are not available at this time</p>
                    <p className="text-white/80 text-xs mb-1">• Only USD virtual cards are available for now</p>
                    <p className="text-white/80 text-xs">• You must have a USD account before creating a virtual card</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tier & Limits */}
        <div className="w-full bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Account Tier & Limits</h3>
            <Link href="/user/settings/tiers" className="text-xs sm:text-sm text-white/80 underline underline-offset-4">Manage</Link>
          </div>

          {/* Current Active Tier Display */}
          {user?.tierLevel && user.tierLevel !== "notSet" && (
            <div className="mb-4 p-3 rounded-lg bg-[#FF6B2C]/10 border border-[#FF6B2C]/30">
              <div className="flex items-center gap-2 mb-1">
                <FiCheckCircle className="text-[#FF6B2C] text-sm" />
                <p className="text-white font-semibold text-sm">
                  Active Tier: {user.tierLevel === "one" ? "Tier 1" : user.tierLevel === "two" ? "Tier 2" : "Tier 3"}
                </p>
              </div>
              <div className="text-xs text-white/70 space-y-0.5">
                <p>
                  Daily Transaction Limit: ₦{user.dailyCummulativeTransactionLimit?.toLocaleString() || 
                    (user.tierLevel === "one" ? "1,000,000" : 
                     user.tierLevel === "two" ? "5,000,000" : "Unlimited")}
                </p>
                <p>
                  Balance Limit: ₦{user.cummulativeBalanceLimit?.toLocaleString() || 
                    (user.tierLevel === "one" ? "5,000,000" : 
                     user.tierLevel === "two" ? "10,000,000" : "Unlimited")}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Tier 1 */}
            <div className={`rounded-xl p-3 transition-all ${tier1Active ? "border-2 border-[#FF6B2C] bg-[#FF6B2C]/10 shadow-lg shadow-[#FF6B2C]/20" : "border border-white/10 bg-white/5"}`}>
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">Tier 1</p>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  tier1Active 
                    ? "border-[#FF6B2C] bg-[#FF6B2C]/20 text-[#FF6B2C] font-semibold"
                    : tier1Completed
                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                    : "border-gray-500/20 bg-gray-500/10 text-gray-400"
                }`}>
                  {tier1Active ? "Active" : tier1Completed ? "Completed" : "Not Started"}
                </span>
              </div>
              <p className="text-white/60 text-xs mt-1">
                Daily Debit Limit: ₦1,000,000.00 · Balance Limit: ₦5,000,000.00
              </p>
              <ul className="mt-2 text-xs text-white/80 space-y-1">
                <li className="flex items-center gap-1.5">
                  {user?.isPhoneVerified ? (
                    <FiCheckCircle className="text-green-400 text-xs" />
                  ) : (
                    <FiXCircle className="text-red-400 text-xs" />
                  )}
                  <span className={user?.isPhoneVerified ? "text-white/80" : "text-white/50"}>
                    Phone Number {user?.isPhoneVerified ? "(Verified)" : ""}
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  {user?.isBvnVerified ? (
                    <FiCheckCircle className="text-green-400 text-xs" />
                  ) : (
                    <FiXCircle className="text-red-400 text-xs" />
                  )}
                  <span className={user?.isBvnVerified ? "text-white/80" : "text-white/50"}>
                    BVN {user?.isBvnVerified ? "(Verified)" : ""}
                  </span>
                </li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className={`rounded-xl p-3 transition-all ${tier2Active ? "border-2 border-[#FF6B2C] bg-[#FF6B2C]/10 shadow-lg shadow-[#FF6B2C]/20" : "border border-white/10 bg-white/5"}`}>
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">Tier 2</p>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  tier2Active 
                    ? "border-[#FF6B2C] bg-[#FF6B2C]/20 text-[#FF6B2C] font-semibold"
                    : tier2Completed
                    ? "border-green-500/20 bg-green-500/10 text-green-400"
                    : tier2CanUpgrade
                    ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                    : "border-gray-500/20 bg-gray-500/10 text-gray-400"
                }`}>
                  {tier2Active ? "Active" : tier2Completed ? "Completed" : tier2CanUpgrade ? "Available" : "Locked"}
                </span>
              </div>
              <p className="text-white/60 text-xs mt-1">
                Daily Debit Limit: ₦5,000,000.00 · Balance Limit: ₦10,000,000.00
              </p>
              <ul className="mt-2 text-xs text-white/80 space-y-1">
                <li className="flex items-center gap-1.5">
                  {user?.isNinVerified ? (
                    <FiCheckCircle className="text-green-400 text-xs" />
                  ) : (
                    <FiXCircle className="text-red-400 text-xs" />
                  )}
                  <span className={user?.isNinVerified ? "text-white/80" : "text-white/50"}>
                    NIN Verification {user?.isNinVerified ? "(Verified)" : ""}
                  </span>
                </li>
              </ul>
              {tier2CanUpgrade && (
                <button
                  onClick={() => setOpenTier2Modal(true)}
                  className="inline-flex mt-2 text-xs text-black bg-[#FF6B2C] hover:bg-[#FF7A3D] font-semibold px-3 py-1 rounded-lg w-max transition-colors"
                >
                  Upgrade to Tier 2
                </button>
              )}
            </div>

            {/* Tier 3 */}
            <div className={`rounded-xl p-3 transition-all ${tier3Active ? "border-2 border-[#FF6B2C] bg-[#FF6B2C]/10 shadow-lg shadow-[#FF6B2C]/20" : "border border-white/10 bg-white/5"}`}>
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">Tier 3</p>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  tier3Active 
                    ? "border-[#FF6B2C] bg-[#FF6B2C]/20 text-[#FF6B2C] font-semibold"
                    : tier3CanUpgrade
                    ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                    : "border-gray-500/20 bg-gray-500/10 text-gray-400"
                }`}>
                  {tier3Active ? "Active" : tier3CanUpgrade ? "Available" : "Locked"}
                </span>
              </div>
              <p className="text-white/60 text-xs mt-1">
                Daily Debit Limit: Unlimited · Balance Limit: Unlimited
              </p>
              <ul className="mt-2 text-xs text-white/80 space-y-1">
                <li className="flex items-center gap-1.5">
                  <FiXCircle className="text-red-400 text-xs" />
                  <span className="text-white/50">Address Information</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <FiXCircle className="text-red-400 text-xs" />
                  <span className="text-white/50">Address Verification</span>
                </li>
              </ul>
              {tier3CanUpgrade && (
                <button
                  onClick={() => setOpenTier3Modal(true)}
                  className="inline-flex mt-2 text-xs text-black bg-[#FF6B2C] hover:bg-[#FF7A3D] font-semibold px-3 py-1 rounded-lg w-max transition-colors"
                >
                  Upgrade to Tier 3
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="w-full bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-5">
        <div className="w-full flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Recent Activity</h3>
          <Link href="/user/notifications" className="text-secondary font-semibold text-sm">View All</Link>
        </div>
        {isPending && !isError ? (
          <div className="w-full flex items-center justify-center py-6">
            <NextImage
              src="/images/natty01.gif"
              alt="Loading"
              width={64}
              height={64}
              className="w-12 h-12"
            />
          </div>
        ) : hasActivity ? (
          <ul className="flex flex-col gap-1.5">
            {recent.map((n: NotificationItem, idx: number) => {
              const isPositive = /login|successful|completed/i.test(`${n.title} ${n.message}`);
              const Icon = isPositive ? FiCheckCircle : FiXCircle;
              return (
                <li key={n.id ?? idx} className="grid grid-cols-[auto,1fr,auto] items-center gap-3 py-2.5">
                  <div className={`w-9 h-9 rounded-md grid place-items-center ${isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    <Icon className="text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-200 dark:text-text-800 text-sm sm:text-base truncate">{n.title}</p>
                    <p className="text-xs text-white/80 truncate">{n.message}</p>
                  </div>
                  <div className="text-[11px] text-white/70 whitespace-nowrap">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <FiClock className="text-3xl text-white/40" />
                </div>
            <div className="text-center">
              <p className="text-white/80 text-sm font-medium mb-1">No Recent Activity</p>
              <p className="text-white/60 text-xs">Your login history, transactions, and other activities will appear here</p>
              </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ChangePinModal isOpen={openChangePin} onClose={() => { setOpenChangePin(false); setSelectedCard(null); }} />
      <BlockCardModal isOpen={openBlock} onClose={() => setOpenBlock(false)} />
      <Tier2UpgradeModal isOpen={openTier2Modal} onClose={() => setOpenTier2Modal(false)} />
      <Tier3UpgradeModal isOpen={openTier3Modal} onClose={() => setOpenTier3Modal(false)} />
    </div>
  );
};

export default AccountsContent;
