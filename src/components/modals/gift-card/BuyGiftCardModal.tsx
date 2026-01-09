"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";
import { FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { FaFingerprint } from "react-icons/fa";
import CustomButton from "@/components/shared/Button";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  useGetGCCategories,
  useGetGCProductsByCurrency,
  usePayForGiftCard,
  useGetGCRedeemCode,
} from "@/api/gift-card/gift-card.queries";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";
import ErrorToast from "@/components/toast/ErrorToast";
import SuccessToast from "@/components/toast/SuccessToast";
import { getAllISOCodes } from "iso-country-currency";
import { GiftCardProduct, GiftCardPriceDetail } from "@/constants/types";
import Image from "next/image";
import { useFingerprintForPayments } from "@/store/paymentPreferences.store";

// Process gift card prices (matching bills/gift-card page)
function processGiftCardPrices(
  product: GiftCardProduct
): GiftCardPriceDetail[] {
  const result: GiftCardPriceDetail[] = [];

  if (product.denominationType === "FIXED") {
    const senderMap = product.fixedRecipientToSenderDenominationsMap || {};
    const payMap = product.fixedRecipientToPayAmount || {};

    Object.entries(payMap).forEach(([priceStr, payAmount]) => {
      const price = parseFloat(priceStr);
      const senderAmount = senderMap[`${price}.0`] || senderMap[priceStr];

      if (senderAmount !== undefined) {
        result.push({
          price,
          amount: payAmount,
          fee: payAmount - senderAmount,
        });
      }
    });
  } else if (product.denominationType === "RANGE") {
    const payMap = product.fixedRecipientToPayAmount || {};

    Object.entries(payMap).forEach(([priceStr, payAmount]) => {
      const price = parseFloat(priceStr);
      result.push({
        price,
        amount: payAmount,
        fee: payAmount - payAmount,
      });
    });
  }

  return result;
}

interface BuyGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyGiftCardModal: React.FC<BuyGiftCardModalProps> = ({ isOpen, onClose }) => {
  const fingerprintEnabled = useFingerprintForPayments();
  const [step, setStep] = useState<"form" | "confirm" | "result" | "redeem">("form");
  const allCurrencies = getAllISOCodes();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [product, setProduct] = useState<GiftCardProduct | null>(null);
  const [prices, setPrices] = useState<GiftCardPriceDetail[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<GiftCardPriceDetail | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [walletPin, setWalletPin] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);
  const [resultSuccess, setResultSuccess] = useState<boolean | null>(null);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [redeemCodes, setRedeemCodes] = useState<{cardNumber: string; pinCode: string}[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const currencyRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(currencyRef, () => setCurrencyOpen(false));
  useOnClickOutside(categoryRef, () => setCategoryOpen(false));
  useOnClickOutside(productRef, () => setProductOpen(false));
  useOnClickOutside(priceRef, () => setPriceOpen(false));

  // Fetch categories
  const { categories, isLoading: categoriesLoading } = useGetGCCategories();

  // Fetch products when currency is selected (matching bills/gift-card page)
  const { products, isLoading: productsLoading } = useGetGCProductsByCurrency({
    currency: selectedCurrency,
  });

  // Filter products by category (matching bills/gift-card page)
  const filteredProducts = products?.filter(
    (p) => p.category.name === selectedCategory
  ) || [];

  // Calculate amount: price.amount * quantity (matching bills/gift-card page)
  const totalAmount = selectedPrice && Number(quantity) > 0 
    ? selectedPrice.amount * Number(quantity) 
    : 0;

  // Fetch redeem codes
  const { response: redeemCodeResponse, refetch: fetchRedeemCodes, isLoading: redeemLoading } = useGetGCRedeemCode({
    transactionId: transactionId || 0,
  });

  const canProceed = !!selectedCurrency && !!selectedCategory && !!product && !!selectedPrice && Number(quantity) > 0;

  const handleClose = () => {
    setStep("form");
    setCurrencyOpen(false);
    setCategoryOpen(false);
    setProductOpen(false);
    setPriceOpen(false);
    setSelectedCurrency("");
    setSelectedCountry("");
    setSelectedCategory("");
    setProduct(null);
    setPrices([]);
    setSelectedPrice(null);
    setQuantity("1");
    setWalletPin("");
    setShowPin(false);
    setResultSuccess(null);
    setTransactionId(null);
    setRedeemCodes([]);
    onClose();
  };

  const onPaySuccess = (data: any) => {
    const txId = data?.data?.data?.transactionId || data?.data?.transactionId;
    setTransactionId(txId);
    setResultSuccess(true);
    setStep("result");
  };

  const onPayError = (error: any) => {
    const errorMessage = error?.response?.data?.message;
    setResultSuccess(false);
    setStep("result");
    ErrorToast({
      title: "Purchase Failed",
      descriptions: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
    });
  };

  const { mutate: payGiftCard, isPending: paying } = usePayForGiftCard(
    onPayError,
    onPaySuccess
  );

  const handleConfirm = () => {
    if (walletPin.length !== 4 || !product || !selectedPrice) return;
    // Use exact payment structure from bills/gift-card page
    payGiftCard({
      productId: Number(product.productId),
      currency: "NGN",
      walletPin,
      amount: totalAmount,
      unitPrice: selectedPrice.price,
      quantity: Number(quantity),
    });
  };

  const handleFetchRedeemCodes = async () => {
    if (!transactionId) return;
    try {
      const result = await fetchRedeemCodes();
      if (result?.data?.data) {
        setRedeemCodes(result.data.data);
        setStep("redeem");
        SuccessToast({
          title: "Redeem Codes Retrieved",
          description: "Your gift card codes have been retrieved successfully",
        });
      }
    } catch (error: any) {
      ErrorToast({
        title: "Failed to Retrieve Codes",
        descriptions: [error?.response?.data?.message || "Unable to fetch redeem codes. Please contact support."],
      });
    }
  };

  const formatNgn = (v: number) =>
    `₦${new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(v) ? v : 0
    )}`;

  const renderTopBar = () => (
    <div className="px-5 pt-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#0A0A0A] dark:text-white text-sm font-semibold">Buy Giftcards</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
            {step === "form" ? "Enter payment details to continue" : 
             step === "confirm" ? "Confirm Transactions" : 
             step === "redeem" ? "Your gift card codes" :
             "Transaction History"}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-visible flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex flex-col bg-white dark:bg-[#0A0A0A]">
              {renderTopBar()}

              <div className="px-5 py-5 border-t border-gray-200 dark:border-gray-800">
                {step === "form" && (
                  <div className="w-full flex flex-col gap-4">
                    {/* Select Country - Currency/Country selection */}
                    <div className="relative flex flex-col gap-1" ref={currencyRef}>
                      <label className="text-[11px] text-gray-500 dark:text-gray-400">Select Country</label>
                      <button
                        type="button"
                        onClick={() => setCurrencyOpen(!currencyOpen)}
                        className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
                      >
                        <span className={selectedCountry ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                          {selectedCountry || "Select country"}
                        </span>
                        <span className="text-gray-500 dark:text-gray-500">▾</span>
                      </button>

                      {currencyOpen && (
                        <div
                          className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-20"
                          style={{ scrollbarWidth: "thin", scrollbarColor: "#2C2C2E transparent" }}
                        >
                          {allCurrencies.map((c: any, index: number) => (
                            <button
                              key={`${c.countryName}-${c.currency}-${index}`}
                              type="button"
                              onClick={() => {
                                setSelectedCurrency(c.currency);
                                setSelectedCountry(`${c.countryName} - ${c.currency}`);
                                setSelectedCategory("");
                                setProduct(null);
                                setPrices([]);
                                setSelectedPrice(null);
                                setCurrencyOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                            >
                              {c.countryName} - {c.currency}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Gift Card Category - Only enabled when currency is selected */}
                    {selectedCurrency && (
                      <div className="relative flex flex-col gap-1" ref={categoryRef}>
                        <label className="text-[11px] text-gray-500 dark:text-gray-400">Gift Card Category</label>
                        <button
                          type="button"
                          onClick={() => setCategoryOpen(!categoryOpen)}
                          className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
                        >
                          <span className={selectedCategory ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600"}>
                            {selectedCategory || "Select category"}
                          </span>
                          <span className="text-gray-500 dark:text-gray-500">▾</span>
                        </button>

                        {categoryOpen && (
                          <div
                            className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-20"
                            style={{ scrollbarWidth: "thin", scrollbarColor: "#2C2C2E transparent" }}
                          >
                            {categoriesLoading ? (
                              <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                              </div>
                            ) : (categories || []).map((c: any) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(c.name);
                                  setProduct(null);
                                  setPrices([]);
                                  setSelectedPrice(null);
                                  setCategoryOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                              >
                                {c.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Select Card - Product selection */}
                    {selectedCurrency && selectedCategory && (
                      <div className="relative flex flex-col gap-1" ref={productRef}>
                        <label className="text-[11px] text-gray-500 dark:text-gray-400">Select Card</label>
                        <button
                          type="button"
                          disabled={!selectedCurrency || !selectedCategory}
                          onClick={() => selectedCurrency && selectedCategory && setProductOpen(!productOpen)}
                          className={`w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm ${
                            selectedCurrency && selectedCategory ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-600 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          {!product ? (
                            <span className="text-gray-500 dark:text-gray-600">Select card</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              {product.logoUrls?.[0] && (
                                <Image
                                  src={product.logoUrls[0]}
                                  alt={`${product.productName} logo`}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 rounded-full"
                                  unoptimized
                                />
                              )}
                              <span className="text-black dark:text-white">{product.productName}</span>
                            </div>
                          )}
                          <span className="text-gray-500 dark:text-gray-500">▾</span>
                        </button>

                        {productOpen && (
                          <div
                            className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-20"
                            style={{ scrollbarWidth: "thin", scrollbarColor: "#2C2C2E transparent" }}
                          >
                            {productsLoading ? (
                              <div className="p-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                <SpinnerLoader width={18} height={18} color="#FF6B2C" /> Loading...
                              </div>
                            ) : filteredProducts.length > 0 ? (
                              filteredProducts.map((p: any) => (
                                <button
                                  key={p.productId}
                                  type="button"
                                  onClick={() => {
                                    setProduct(p);
                                    setPrices(processGiftCardPrices(p));
                                    setSelectedPrice(null);
                                    setProductOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors flex items-center gap-2"
                                >
                                  {p.logoUrls?.[0] && (
                                    <Image
                                      src={p.logoUrls[0]}
                                      alt={`${p.productName} logo`}
                                      width={20}
                                      height={20}
                                      className="w-5 h-5 rounded-full"
                                      unoptimized
                                    />
                                  )}
                                  <span>{p.productName}</span>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">No products available</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Amount - Price selection */}
                    {product && Number(quantity) > 0 && prices.length > 0 && (
                      <div className="relative flex flex-col gap-1" ref={priceRef}>
                        <label className="text-[11px] text-gray-500 dark:text-gray-400">Card Amount</label>
                        <button
                          type="button"
                          onClick={() => setPriceOpen(!priceOpen)}
                          className="w-full flex items-center justify-between bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white"
                        >
                          {!selectedPrice ? (
                            <span className="text-gray-500 dark:text-gray-600">Select amount</span>
                          ) : (
                            <span className="text-black dark:text-white">
                              {Number(selectedPrice.price).toLocaleString()} {product.recipientCurrencyCode || ""}
                            </span>
                          )}
                          <span className="text-gray-500 dark:text-gray-500">▾</span>
                        </button>

                        {priceOpen && (
                          <div
                            className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto shadow-2xl z-20"
                            style={{ scrollbarWidth: "thin", scrollbarColor: "#2C2C2E transparent" }}
                          >
                            {prices.map((price, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setSelectedPrice(price);
                                  setPriceOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-[#1C1C1E] transition-colors"
                              >
                                {price.price} {product.recipientCurrencyCode || ""}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Number of Cards - Quantity */}
                    {product && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-500 dark:text-gray-400">Number of Cards</label>
                        <div className="w-full flex items-center bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              const newQty = Math.max(1, Number(quantity) - 1);
                              setQuantity(String(newQty));
                              if (newQty !== Number(quantity)) {
                                setSelectedPrice(null);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/10 hover:bg-white/20 flex items-center justify-center text-black dark:text-white text-lg font-medium transition-colors"
                          >
                            −
                          </button>
                          <input
                            className="flex-1 bg-transparent border-none outline-none text-black dark:text-white text-sm text-center"
                            type="text"
                            value={quantity}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              if (val === "" || Number(val) >= 1) {
                                setQuantity(val || "1");
                                if (val !== quantity) {
                                  setSelectedPrice(null);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              if (!e.target.value || Number(e.target.value) < 1) {
                                setQuantity("1");
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newQty = Number(quantity) + 1;
                              setQuantity(String(newQty));
                              setSelectedPrice(null);
                            }}
                            className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/10 hover:bg-white/20 flex items-center justify-center text-black dark:text-white text-lg font-medium transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Amount badge */}
                    {selectedPrice && Number(quantity) > 0 && totalAmount > 0 ? (
                      <div className="w-full flex items-center gap-2 rounded-lg px-3 py-3 bg-green-500/20 border border-green-700/40">
                        <FiCheckCircle className="text-green-500 text-lg" />
                        <p className="text-green-400 text-sm font-semibold">{formatNgn(totalAmount)}</p>
                      </div>
                    ) : null}
                  </div>
                )}

                {step === "confirm" && (
                  <div className="w-full flex flex-col gap-4">
                    <div className="bg-[#1C1C1E] rounded-lg p-4 space-y-3">
                      {product && (
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Card Type</span>
                          <span className="text-white text-sm font-medium">{product.productName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Country</span>
                        <span className="text-white text-sm font-medium">{selectedCountry || "-"}</span>
                      </div>
                      {selectedPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Card Amount</span>
                          <span className="text-white text-sm font-medium">{selectedPrice.price} {product?.recipientCurrencyCode || ""}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Number of Cards</span>
                        <span className="text-white text-sm font-medium">{quantity}</span>
                      </div>
                      {selectedPrice && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Rate</span>
                            <span className="text-white text-sm font-medium">₦{selectedPrice.amount.toLocaleString()}/{product?.recipientCurrencyCode || "$"}</span>
                          </div>
                          {selectedPrice.fee > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Charges</span>
                              <span className="text-white text-sm font-medium">{formatNgn(selectedPrice.fee)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Amount</span>
                            <span className="text-white text-sm font-medium">{formatNgn(totalAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Amount Debited</span>
                            <span className="text-white text-sm font-medium">{formatNgn(totalAmount)}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gray-400">Enter Transaction PIN</label>
                      <div className="w-full flex items-center gap-3">
                        <div className="flex-1 flex items-center bg-[#141416] border border-gray-800 rounded-lg py-3 px-4">
                          <input
                            className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm tracking-widest"
                            placeholder="••••"
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={walletPin}
                            onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          />
                        </div>
                        {fingerprintEnabled ? (
                          <button
                            type="button"
                            className="w-11 h-11 rounded-lg bg-white border border-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="Use fingerprint"
                            onClick={() =>
                              ErrorToast({
                                title: "Fingerprint not available",
                                descriptions: ["Fingerprint sign-in isn't enabled on web yet."],
                              })
                            }
                          >
                            <FaFingerprint className="text-black text-lg" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                {step === "result" && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: resultSuccess ? '#22c55e' : '#ef4444' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {resultSuccess ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                    </div>
                    <span className={`${resultSuccess ? 'text-emerald-400' : 'text-red-400'} text-sm font-medium`}>
                      {resultSuccess ? 'Purchase Successful' : 'Purchase Failed'}
                    </span>
                    <span className="text-[#0A0A0A] dark:text-white text-2xl font-bold">{formatNgn(totalAmount)}</span>
                    {resultSuccess && transactionId && (
                      <div className="w-full space-y-3 mt-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Transaction ID</span>
                          <span className="text-[#0A0A0A] dark:text-white text-sm font-medium">{transactionId}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === "redeem" && (
                  <div className="w-full flex flex-col gap-4">
                    <div className="text-center">
                      <h3 className="text-[#0A0A0A] dark:text-white text-lg font-semibold mb-2">Your Gift Card Codes</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Save these codes securely</p>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {redeemCodes.map((code, index) => (
                        <div key={index} className="bg-[#F4F4F5] dark:bg-[#141416] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400 text-sm">Card Number</span>
                              <span className="text-[#0A0A0A] dark:text-white text-sm font-medium font-mono">{code.cardNumber}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400 text-sm">PIN Code</span>
                              <span className="text-[#0A0A0A] dark:text-white text-sm font-medium font-mono">{code.pinCode}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 pb-5">
                {step === "form" ? (
                  <button
                    onClick={() => setStep("confirm")}
                    disabled={!canProceed}
                    className="w-full px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : step === "confirm" ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStep("form")}
                      className="flex-1 px-4 py-3 rounded-full bg-[#2C2C2E] text-white hover:bg-[#353539] transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={walletPin.length !== 4 || paying}
                      className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {paying ? "Processing..." : "Pay"}
                    </button>
                  </div>
                ) : step === "result" ? (
                  <div className="flex gap-3 w-full">
                    {resultSuccess && transactionId && (
                      <button
                        onClick={handleFetchRedeemCodes}
                        disabled={redeemLoading}
                        className="flex-1 px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {redeemLoading ? "Loading..." : "Get Codes"}
                      </button>
                    )}
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 rounded-full bg-[#2C2C2E] text-white hover:bg-[#353539] transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                ) : step === "redeem" ? (
                  <button
                    onClick={handleClose}
                    className="w-full px-4 py-3 rounded-full bg-[#FF6B2C] text-black font-semibold hover:bg-[#FF7A3D] transition-colors"
                  >
                    Done
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BuyGiftCardModal;
