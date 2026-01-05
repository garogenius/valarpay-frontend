"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetInvestmentProduct } from "@/api/investment/investment.queries";
import { formatCurrency } from "@/utils/utilityFunctions";

const InvestmentProductInfoCard = () => {
  const { product, isPending, isError } = useGetInvestmentProduct();

  if (isPending) {
    return (
      <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 sm:p-6">
        <div className="mb-4">
          <Skeleton height={18} width={180} />
          <div className="mt-2">
            <Skeleton height={12} count={2} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Skeleton height={10} width={120} />
            <div className="mt-2">
              <Skeleton height={18} width={140} />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Skeleton height={10} width={80} />
            <div className="mt-2">
              <Skeleton height={18} width={110} />
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <Skeleton height={10} width={100} />
            <div className="mt-2">
              <Skeleton height={18} width={110} />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Skeleton height={12} width={140} />
          <div className="mt-2 space-y-2">
            <Skeleton height={12} />
            <Skeleton height={12} />
            <Skeleton height={12} />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 sm:p-6">
        <p className="text-white font-semibold">Investment Product</p>
        <p className="text-gray-400 text-sm mt-1">Unable to load product information right now.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-white font-semibold">{product.name}</p>
          {product.description ? (
            <p className="text-gray-400 text-sm mt-1 max-w-3xl">{product.description}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-xs">Minimum Investment</p>
          <p className="text-white text-lg font-semibold mt-1">
            {formatCurrency(Number(product.minimumInvestmentAmount || product.minimumAmount || 0), "NGN")}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-xs">ROI</p>
          <p className="text-white text-lg font-semibold mt-1">{Number((product.roiRate || 0) * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-xs">Tenure</p>
          <p className="text-white text-lg font-semibold mt-1">{Number(product.tenureMonths || 0)} months</p>
        </div>
      </div>

      {product.capitalGuaranteed !== undefined && (
        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-xs mb-1">Capital Guarantee</p>
          <p className="text-white text-sm font-medium">
            {product.capitalGuaranteed ? "✓ Capital is guaranteed" : "Capital not guaranteed"}
          </p>
        </div>
      )}

      {product.repaymentStructure && (
        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/60 text-xs mb-1">Repayment Structure</p>
          <p className="text-white text-sm font-medium">{product.repaymentStructure}</p>
        </div>
      )}

      {(product.features || []).length > 0 ? (
        <div className="mt-5">
          <p className="text-white/80 text-sm font-medium">Key Features</p>
          <ul className="mt-2 space-y-2">
            {product.features!.map((f, idx) => (
              <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF6B2C] flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default InvestmentProductInfoCard;



