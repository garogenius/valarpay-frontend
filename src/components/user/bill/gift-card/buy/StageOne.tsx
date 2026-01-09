"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "@/components/shared/Button";
import {
  GiftCardDetails,
  GiftCardPriceDetail,
  GiftCardProduct,
} from "@/constants/types";
import toast from "react-hot-toast";
import {
  useGetGCCategories,
  useGetGCProductsByCurrency,
} from "@/api/gift-card/gift-card.queries";
import { getAllISOCodes } from "iso-country-currency";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { motion, number } from "framer-motion";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import {
  formatNumberWithoutExponential,
  handleNumericPaste,
  handleNumericKeyDown,
} from "@/utils/utilityFunctions";
import RedeemInstructionModal from "@/components/modals/RedeemInstructionModal";
import { IoClose } from "react-icons/io5";

function processGiftCardPrices(
  product: GiftCardProduct
): GiftCardPriceDetail[] {
  const result: GiftCardPriceDetail[] = [];

  if (product.denominationType === "FIXED") {
    // Handle fixed denomination type
    const senderMap = product.fixedRecipientToSenderDenominationsMap || {};
    const payMap = product.fixedRecipientToPayAmount || {};

    // Convert string keys to numbers for comparison
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
    // Handle range denomination type
    const payMap = product.fixedRecipientToPayAmount || {};

    Object.entries(payMap).forEach(([priceStr, payAmount]) => {
      const price = parseFloat(priceStr);
      result.push({
        price,
        amount: payAmount,
        fee: payAmount - payAmount, // Explicitly calculate the fee
      });
    });
  }

  return result;
}

type StageOneProps = {
  stage: "one" | "two" | "three";
  setStage: (stage: "one" | "two" | "three") => void;
  setGiftCardDetails: (giftCardDetails: GiftCardDetails) => void;
  setAmount: (amount: string) => void;
  onClose?: () => void;
};

const BuyGiftCardStageOne: React.FC<StageOneProps> = ({
  setStage,
  setGiftCardDetails,
  setAmount,
  onClose,
}) => {
  const allCurrencies = getAllISOCodes();
  const [product, setProduct] = useState<GiftCardProduct>();
  const [prices, setPrices] = useState<GiftCardPriceDetail[]>([]);
  const [currencyState, setCurrencyState] = useState(false);
  const [categoryState, setCategoryState] = useState(false);
  const [productState, setProductState] = useState(false);
  const [priceState, setPriceState] = useState(false);
  const [openRedeemInstruction, setOpenRedeemInstruction] = useState(false);
  const schema = useMemo(
    () =>
      yup.object().shape({
        currency: yup.string().required("Currency is required"),
        category: yup.string().required("Category is required"),
        productId: yup.string().required("Product is required"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .typeError("Invalid quantity")
          .min(1, "Quantity must be greater than 0"),

        unitPrice: yup
          .number()
          .required("price is required")
          .typeError("Invalid price"),

        fee: yup.number().required("Fee is required").typeError("Invalid fee"),

        amount: yup
          .number()
          .required("Amount is required")
          .typeError("Invalid amount"),
      }),
    []
  );
  type FormData = yup.InferType<typeof schema>;

  const form = useForm<FormData>({
    defaultValues: {
      currency: "",
      category: "",
      productId: "",
      amount: undefined,
      quantity: undefined,
      unitPrice: undefined,
      fee: undefined,
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { register, handleSubmit, formState, watch, setValue, clearErrors } =
    form;
  const { errors } = formState;

  const watchedAmount = Number(watch("amount"));
  const watchedCategory = watch("category");
  const watchedCurrency = watch("currency");
  const watchedProduct = watch("productId");
  const watchedUnitPrice = watch("unitPrice");
  const watchedFee = watch("fee");
  const watchedQuantity = watch("quantity");

  const onSubmit = async (data: FormData) => {
    if (!product) {
      toast.error("Invalid product");
      return;
    }

    console.log(data);
    Promise.all([
      Promise.resolve(setAmount(String(data.amount))),
      Promise.resolve(
        setGiftCardDetails({
          product,
          currency: data.currency,
          productId: data.productId,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          amount: data.amount,
        })
      ),

      Promise.resolve(setStage("two")),
    ]);
  };

  const {
    products,
    isLoading: productsPending,
    isError: productsError,
  } = useGetGCProductsByCurrency({
    currency: watchedCurrency,
  });

  const productsLoading = productsPending && !productsError;

  const {
    categories,
    isLoading: categoriesPending,
    isError: categoriesError,
  } = useGetGCCategories();

  const categoriesLoading = categoriesPending && !categoriesError;

  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(currencyDropdownRef, () => {
    setCurrencyState(false);
  });

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(categoryDropdownRef, () => {
    setCategoryState(false);
  });

  const productDropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(productDropdownRef, () => {
    setProductState(false);
  });

  const priceDropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(priceDropdownRef, () => {
    setPriceState(false);
  });

  return (
    <>
      <div className="w-full px-5 py-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white text-sm font-semibold">Buy Giftcards</p>
                <p className="text-[#9a9a9a] text-xs mt-0.5">
                  Enter payment details to continue
                </p>
              </div>
              {onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#bcbcbc] hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              ) : null}
            </div>

            <div
              ref={currencyDropdownRef}
              className="relative w-full flex flex-col gap-1"
            >
              <label
                htmlFor="network"
                className="text-[11px] uppercase tracking-[0.25em] text-[#8a8a8a] mb-1 flex items-start w-full"
              >
                Select Currency{" "}
              </label>
              <div
                onClick={() => {
                  setCurrencyState(!currencyState);
                }}
                className="w-full flex gap-2 justify-center items-center rounded-md bg-[#1c1c1e] border border-[#2a2a2a] py-3 px-4"
              >
                <div className="w-full flex items-center justify-between text-[#7c7c7c]">
                  {" "}
                  {!watchedCurrency ? (
                    <p className="text-sm">Select currency</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{watchedCurrency}</p>
                    </div>
                  )}
                  <motion.svg
                    animate={{
                      rotate: currencyState ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 text-[#7c7c7c] cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>
              </div>

              {currencyState && (
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-[#141416] border border-[#2a2a2a] rounded-xl shadow-2xl z-10 no-scrollbar">
                  <SearchableDropdown
                    items={allCurrencies}
                    searchKey="countryName"
                    displayFormat={(currency) => (
                      <div className="flex items-center gap-2">
                        <p className="2xs:text-base text-sm font-medium text-white">
                          {currency.countryName} - {currency.currency}
                        </p>
                      </div>
                    )}
                    onSelect={(currency) => {
                      setValue("currency", currency.currency);
                      setCurrencyState(false);
                      clearErrors("currency");
                      setValue("category", "");
                      setValue("productId", "");
                      setProduct(undefined);
                      setPrices([]);
                      setValue("unitPrice", 0);
                      setValue("amount", 0);
                      setValue("fee", 0);
                    }}
                    showSearch={true}
                    placeholder="Search Country..."
                    isOpen={currencyState}
                    onClose={() => setCurrencyState(false)}
                  />
                </div>
              )}

              {errors?.currency?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.currency?.message}
                </p>
              ) : null}
            </div>

            <div
              ref={categoryDropdownRef}
              className="relative w-full flex flex-col gap-1"
            >
              <label
                htmlFor="network"
                className="text-[11px] uppercase tracking-[0.25em] text-[#8a8a8a] mb-1 flex items-start w-full"
              >
                Gift Card Category
              </label>
              <div
                onClick={() => {
                  setCategoryState(!categoryState);
                }}
                className="w-full flex gap-2 justify-center items-center rounded-md bg-[#1c1c1e] border border-[#2a2a2a] py-3 px-4"
              >
                <div className="w-full flex items-center justify-between text-[#7c7c7c]">
                  {" "}
                  {!watchedCategory ? (
                    <p className="text-sm">Select category</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{watchedCategory}</p>
                    </div>
                  )}
                  <motion.svg
                    animate={{
                      rotate: categoryState ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 text-[#7c7c7c] cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>
              </div>

              {categoryState && (
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-[#141416] border border-[#2a2a2a] rounded-xl shadow-2xl z-10 no-scrollbar">
                  <SearchableDropdown
                    items={categories}
                    searchKey="name"
                    displayFormat={(category) => (
                      <div className="flex items-center gap-2">
                        <p className="2xs:text-base text-sm font-medium text-white">
                          {category.name}
                        </p>
                      </div>
                    )}
                    onSelect={(category) => {
                      setValue("category", category.name);
                      clearErrors("category");
                      setCategoryState(false);
                      setProduct(undefined);
                      setValue("productId", "");
                      setPrices([]);
                      setValue("unitPrice", 0);
                      setValue("amount", 0);
                      setValue("fee", 0);
                    }}
                    showSearch={true}
                    placeholder="Search Category..."
                    isOpen={categoryState}
                    onClose={() => setCategoryState(false)}
                    isLoading={categoriesLoading}
                  />
                </div>
              )}
              {errors?.category?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.category?.message}
                </p>
              ) : null}
            </div>

            <div
              ref={productDropdownRef}
              className="relative w-full flex flex-col gap-1"
            >
              <label
                htmlFor="product"
                className="text-[11px] uppercase tracking-[0.25em] text-[#8a8a8a] mb-1 flex items-start w-full"
              >
                Gift Card Product
              </label>
              <div
                onClick={() => {
                  if (watchedCurrency && watchedCategory) {
                    setProductState(!productState);
                  }
                }}
                className="w-full flex gap-2 justify-center items-center rounded-md bg-[#1c1c1e] border border-[#2a2a2a] py-3 px-4"
              >
                <div className="w-full flex items-center justify-between text-[#7c7c7c]">
                  {" "}
                  {!watchedCurrency ? (
                    <p className="text-sm">Select currency</p>
                  ) : !watchedCategory ? (
                    <p className="text-sm">Select category</p>
                  ) : !watchedProduct || !product ? (
                    <p className="text-sm">Select product</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      {product?.logoUrls[0] ? (
                        <Image
                          src={product?.logoUrls[0] || ""}
                          alt={`${product?.productName} logo`}
                          width={24}
                          height={24}
                          className="w-7 h-7 rounded-full"
                          unoptimized
                        />
                      ) : null}
                      <p className=" text-sm font-medium">
                        {product?.productName}
                      </p>
                    </div>
                  )}
                  <motion.svg
                    animate={{
                      rotate: productState ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 text-[#7c7c7c] cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>
              </div>

              {productState && (
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-[#141416] border border-[#2a2a2a] rounded-xl shadow-2xl z-10 no-scrollbar">
                  <SearchableDropdown
                    items={products?.filter(
                      (product) => product.category.name === watchedCategory
                    )}
                    searchKey="productName"
                    displayFormat={(product) => (
                      <div className="flex items-center gap-2">
                        {product?.logoUrls[0] ? (
                          <Image
                            src={product?.logoUrls[0] || ""}
                            alt={`${product?.productName} logo`}
                            width={24}
                            height={24}
                            className="w-7 h-7 rounded-full"
                            unoptimized
                          />
                        ) : null}
                        <p className="2xs:text-base text-sm font-medium text-white">
                          {product.productName}
                        </p>
                      </div>
                    )}
                    onSelect={(product) => {
                      setValue("productId", String(product?.productId));
                      setProduct(product);
                      clearErrors("productId");
                      setPrices(processGiftCardPrices(product));
                      setProductState(false);
                      setValue("unitPrice", 0);
                      setValue("amount", 0);
                      setValue("fee", 0);
                    }}
                    showSearch={true}
                    placeholder="Search Product Name..."
                    isOpen={productState}
                    onClose={() => setProductState(false)}
                    isLoading={productsLoading}
                  />
                </div>
              )}
              {product?.redeemInstruction && (
                <p
                  className="text-sm text-[#f76301] cursor-pointer"
                  onClick={() => setOpenRedeemInstruction(true)}
                >
                  View redeem instructions
                </p>
              )}

              {errors?.productId?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.productId?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-center items-center gap-1 w-full text-white">
              <label
                className="w-full text-[11px] uppercase tracking-[0.25em] text-[#8a8a8a] mb-1 flex items-start "
                htmlFor={"quantity"}
              >
                Quantity
              </label>
              <div className="w-full flex gap-2 justify-center items-center rounded-md bg-[#1c1c1e] border border-[#2a2a2a] py-3 px-4">
                <input
                  className="w-full bg-transparent p-0 border-none outline-none text-sm text-white placeholder:text-[#7c7c7c]"
                  placeholder={`Enter quantity`}
                  required={true}
                  type="number"
                  min={1}
                  {...register("quantity", {
                    valueAsNumber: true,
                  })}
                  onKeyDown={(e) => {
                    handleNumericKeyDown(e);
                    setValue("unitPrice", 0);
                    setValue("amount", 0);
                    setValue("fee", 0);
                  }}
                  onPaste={(e) => {
                    handleNumericPaste(e);
                    setValue("unitPrice", 0);
                    setValue("amount", 0);
                    setValue("fee", 0);
                  }}
                />
              </div>

              {errors?.quantity?.message && (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.quantity?.message}
                </p>
              )}
            </div>

            <div
              ref={priceDropdownRef}
              className="relative w-full flex flex-col gap-1"
            >
              <label
                htmlFor="price"
                className="text-[11px] uppercase tracking-[0.25em] text-[#8a8a8a] mb-1 flex items-start w-full"
              >
                Price{" "}
                {product && product?.recipientCurrencyCode
                  ? `in ${product?.recipientCurrencyCode}`
                  : ""}
              </label>
              <div
                onClick={() => {
                  if (watchedCurrency && watchedCategory && watchedProduct) {
                    setPriceState(!priceState);
                  }
                }}
                className="w-full flex gap-2 justify-center items-center rounded-md bg-[#1c1c1e] border border-[#2a2a2a] py-3 px-4"
              >
                <div className="w-full flex items-center justify-between text-[#7c7c7c]">
                  {!watchedCurrency ? (
                    <p className="text-sm">Select currency</p>
                  ) : !watchedCategory ? (
                    <p className="text-sm">Select category</p>
                  ) : !watchedProduct && !product ? (
                    <p className="text-sm">Select product</p>
                  ) : !watchedQuantity || watchedQuantity < 1 ? (
                    <p className="text-sm">Enter a valid quantity</p>
                  ) : !watchedUnitPrice || prices.length < 1 ? (
                    <p className="text-sm ">
                      Select gift card price{" "}
                      {product && product?.recipientCurrencyCode
                        ? `in ${product?.recipientCurrencyCode}`
                        : ""}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {Number(watchedUnitPrice).toLocaleString()}{" "}
                        {product?.recipientCurrencyCode}
                      </p>
                    </div>
                  )}
                  <motion.svg
                    animate={{
                      rotate: priceState ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 text-[#7c7c7c] cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>
              </div>

              {priceState && (
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-[#141416] border border-[#2a2a2a] rounded-xl shadow-2xl z-10 no-scrollbar">
                  <SearchableDropdown
                    items={prices}
                    searchKey="price"
                    displayFormat={(price) => (
                      <div className="flex items-center gap-2">
                        <p className="2xs:text-base text-sm font-medium text-white">
                          {price.price} {product?.recipientCurrencyCode}
                        </p>
                      </div>
                    )}
                    onSelect={(price) => {
                      setValue("unitPrice", price.price);
                      setValue("amount", price.amount * watchedQuantity);
                      setValue("fee", price.fee);
                      setPriceState(false);
                      clearErrors("unitPrice");
                      clearErrors("amount");
                      clearErrors("fee");
                    }}
                    showSearch={false}
                    placeholder="Search Price..."
                    isOpen={priceState}
                    onClose={() => setPriceState(false)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1 self-start text-sm text-[#f76301]">
                {watchedFee ? (
                  <p>Fee: {`₦${watchedFee.toLocaleString()}`}</p>
                ) : null}
                {watchedAmount ? (
                  <p>
                    Paying:{" "}
                    {`₦${Number(
                      formatNumberWithoutExponential(watchedAmount, 3)
                    ).toLocaleString()}`}
                  </p>
                ) : null}
              </div>

              {errors?.unitPrice?.message ? (
                <p className="flex self-start text-red-500 font-semibold mt-0.5 text-sm">
                  {errors?.unitPrice?.message}
                </p>
              ) : null}
            </div>

            <CustomButton
              type="submit"
              className="w-full rounded-md bg-[#f76301] hover:bg-[#e55a00] text-black font-semibold py-3"
            >
              Next{" "}
            </CustomButton>
          </form>
      </div>
      {product?.redeemInstruction && (
        <RedeemInstructionModal
          isOpen={openRedeemInstruction}
          onClose={() => setOpenRedeemInstruction(false)}
          instruction={product?.redeemInstruction}
        />
      )}
    </>
  );
};

export default BuyGiftCardStageOne;
