"use client";

import React from "react";
import Image from "next/image";
import { SiVisa } from "react-icons/si";
import images from "../../../../../public/images";

interface PhysicalCardDesignProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  showDetails: boolean;
}

const PhysicalCardDesign: React.FC<PhysicalCardDesignProps> = ({
  cardNumber,
  cardholderName,
  expiryDate,
  cvv,
  showDetails,
}) => {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{
        aspectRatio: "1.586",
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)",
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF6B2C]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        <Image
          src={images.singleLogo}
          alt="ValarPay"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="text-white font-bold text-sm tracking-wider">VALARPAY</span>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-red-500/80 backdrop-blur" />
          <div className="w-8 h-8 rounded-full bg-yellow-400/80 backdrop-blur -ml-3" />
        </div>
      </div>

      <div className="absolute top-20 left-6 z-10">
        <div className="w-12 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md flex items-center justify-center shadow-lg">
          <div className="w-10 h-8 border-2 border-yellow-700/40 rounded grid grid-cols-3 gap-[1px] p-[2px]">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-yellow-700/20 rounded-[1px]" />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-6 right-6 z-10 space-y-4">
        <div>
          <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1 font-medium">Card Number</p>
          <p className="text-white text-xl font-mono tracking-[0.2em] font-medium">
            {showDetails ? cardNumber : "•••• •••• •••• " + cardNumber.slice(-4)}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1 font-medium">Card Holder</p>
              <p className="text-white text-xs font-semibold tracking-wide">{cardholderName}</p>
            </div>
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1 font-medium">Expires</p>
              <p className="text-white text-xs font-semibold tracking-wide">{expiryDate}</p>
            </div>
            {showDetails && (
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1 font-medium">CVV</p>
                <p className="text-white text-xs font-semibold tracking-wide">{cvv}</p>
              </div>
            )}
          </div>
          <SiVisa className="text-white text-4xl opacity-90" />
        </div>
      </div>

      <div className="absolute bottom-3 left-6 right-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>
            <span className="text-white/60 text-[9px] uppercase tracking-wider">Contactless</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalCardDesign;
