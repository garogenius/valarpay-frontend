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
};

const BuyGiftCardStageOne: React.FC<StageOneProps> = ({
  setStage,
  setGiftCardDetails,
  setAmount,
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
      <div className="w-full py-5 xs:py-10 flex flex-col items-center justify-center">
        <div className="w-full sm:w-[85%] lg:w-[75%] xl:w-[65%] 2xl:w-[55%] dark:bg-[#000000] bg-transparent md:bg-[#F2F1EE] rounded-lg sm:rounded-xl p-0 2xs:p-4 md:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4 md:gap-6"
          >
            <h2 className="2xs:hidden text-2xl font-semibold text-text-800">
              Buy Gift Card
            </h2>

            <div
              ref={currencyDropdownRef}
              className="relative w-full flex flex-col gap-1"
            >
              <label
                htmlFor="network"
                className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
              >
                Select Currency{" "}
              </label>
              <div
                onClick={() => {
                  setCurrencyState(!currencyState);
                }}
                className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
              >
                <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                  {" "}
                  {!watchedCurrency ? (
                    <p className="text-sm ">Select currency </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className=" text-sm font-medium">{watchedCurrency}</p>
                    </div>
                  )}
                  <motion.svg
                    animate={{
                      rotate: currencyState ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 text-text-700 dark:text-text-1000 cursor-pointer"
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
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-dark-primary border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                  <SearchableDropdown
                    items={allCurrencies}
                    searchKey="countryName"
                    displayFormat={(currency) => (
                      <div className="flex items-center gap-2">
                        <p className=" 2xs:text-base text-sm font-medium text-text-200 dark:text-text-400">
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
                className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
              >
                Gift Card Category
              </label>
              <div
                onClick={() => {
                  setCategoryState(!categoryState);
                }}
                className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
              >
                <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                  {" "}
                  {!watchedCategory ? (
                    <p className="text-sm ">Select category </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className=" text-sm font-medium">{watchedCategory}</p>
                    </div>
                  )}
                  <motion.svg
                    animate={{
                      rotate: categoryState ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 text-text-700 dark:text-text-1000 cursor-pointer"
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
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-dark-primary border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                  <SearchableDropdown
                    items={categories}
                    searchKey="name"
                    displayFormat={(category) => (
                      <div className="flex items-center gap-2">
                        <p className="2xs:text-base text-sm font-medium text-text-200 dark:text-text-400">
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
                className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
              >
                Gift Card Product
              </label>
              <div
                onClick={() => {
                  if (watchedCurrency && watchedCategory) {
                    setProductState(!productState);
                  }
                }}
                className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
              >
                <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                  {" "}
                  {!watchedCurrency ? (
                    <p className="text-sm ">Select currency </p>
                  ) : !watchedCategory ? (
                    <p className="text-sm ">Select category </p>
                  ) : !watchedProduct || !product ? (
                    <p className="text-sm ">Select product </p>
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
                    className="w-4 h-4 text-text-700 dark:text-text-1000 cursor-pointer"
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
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-dark-primary border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
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
                        <p className="2xs:text-base text-sm font-medium text-text-200 dark:text-text-400">
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
                  className="text-sm text-primary cursor-pointer"
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

            <div className="flex flex-col justify-center items-center gap-1 w-full text-black dark:text-white">
              <label
                className="w-full text-sm sm:text-base font-medium  text-text-200 dark:text-text-800 mb-1 flex items-start "
                htmlFor={"quantity"}
              >
                Quantity
              </label>
              <div className="w-full flex gap-2 justify-center items-center bg-bg-2400 dark:bg-bg-2100 border border-border-600 rounded-lg py-4 px-3">
                <input
                  className="w-full bg-transparent p-0 border-none outline-none text-base text-text-200 dark:text-white placeholder:text-text-200 dark:placeholder:text-text-1000 placeholder:text-sm"
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
                className="text-base text-text-200 dark:text-text-400 mb-1 flex items-start w-full"
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
                className="w-full flex gap-2 justify-center items-center bg-bg-2000 border border-border-600 rounded-lg py-4 px-3"
              >
                <div className="w-full flex items-center justify-between text-text-700 dark:text-text-1000">
                  {!watchedCurrency ? (
                    <p className="text-sm ">Select currency </p>
                  ) : !watchedCategory ? (
                    <p className="text-sm ">Select category </p>
                  ) : !watchedProduct && !product ? (
                    <p className="text-sm ">Select product </p>
                  ) : !watchedQuantity || watchedQuantity < 1 ? (
                    <p className="text-sm ">Enter a valid quantity</p>
                  ) : !watchedUnitPrice || prices.length < 1 ? (
                    <p className="text-sm ">
                      Select gift card price{" "}
                      {product && product?.recipientCurrencyCode
                        ? `in ${product?.recipientCurrencyCode}`
                        : ""}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className=" text-sm font-medium">
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
                    className="w-4 h-4 text-text-700 dark:text-text-1000 cursor-pointer"
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
                <div className="absolute top-full my-2.5 px-1 py-2 overflow-y-auto h-fit max-h-60 w-full bg-dark-primary border dark:bg-bg-1100 border-gray-300 dark:border-border-600 rounded-md shadow-md z-10 no-scrollbar">
                  <SearchableDropdown
                    items={prices}
                    searchKey="price"
                    displayFormat={(price) => (
                      <div className="flex items-center gap-2">
                        <p className="2xs:text-base text-sm font-medium text-text-200 dark:text-text-400">
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

              <div className="flex flex-col gap-1 self-start text-sm text-primary">
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
              className="w-full border-2 dark:text-black dark:font-bold border-primary text-white text-base 2xs:text-lg max-2xs:px-6 py-3.5"
            >
              Next{" "}
            </CustomButton>
          </form>
        </div>
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
