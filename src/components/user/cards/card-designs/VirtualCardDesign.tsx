"use client";

import React from "react";
import Image from "next/image";
import { SiMastercard } from "react-icons/si";
import images from "../../../../../public/images";

interface VirtualCardDesignProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  showDetails: boolean;
}

const VirtualCardDesign: React.FC<VirtualCardDesignProps> = ({
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
        background: "linear-gradient(135deg, #FF6B2C 0%, #FF8C4D 50%, #FFB380 100%)",
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
      </div>

      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-10" viewBox="0 0 400 250">
          <path d="M0,100 Q100,50 200,100 T400,100" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,120 Q100,70 200,120 T400,120" stroke="white" strokeWidth="2" fill="none" />
          <path d="M0,140 Q100,90 200,140 T400,140" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
        <Image
          src={images.singleLogo}
          alt="ValarPay"
          width={32}
          height={32}
          className="w-8 h-8 drop-shadow-md"
        />
        <span className="text-white font-bold text-sm tracking-wider drop-shadow-md">VALARPAY</span>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
          <span className="text-white text-[10px] uppercase font-bold tracking-wider">Virtual</span>
        </div>
      </div>

      <div className="absolute top-20 left-6 z-10">
        <div className="w-12 h-10 bg-white/30 backdrop-blur-sm rounded-md flex items-center justify-center shadow-lg border border-white/40">
          <div className="w-10 h-8 rounded grid grid-cols-3 gap-[1px] p-[2px]">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white/40 rounded-[1px]" />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-6 right-6 z-10 space-y-4">
        <div>
          <p className="text-white/80 text-[10px] uppercase tracking-wider mb-1 font-medium drop-shadow">Card Number</p>
          <p className="text-white text-xl font-mono tracking-[0.2em] font-medium drop-shadow-md">
            {showDetails ? cardNumber : "•••• •••• •••• " + cardNumber.slice(-4)}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-white/80 text-[10px] uppercase tracking-wider mb-1 font-medium drop-shadow">Card Holder</p>
              <p className="text-white text-xs font-semibold tracking-wide drop-shadow">{cardholderName}</p>
            </div>
            <div>
              <p className="text-white/80 text-[10px] uppercase tracking-wider mb-1 font-medium drop-shadow">Expires</p>
              <p className="text-white text-xs font-semibold tracking-wide drop-shadow">{expiryDate}</p>
            </div>
            {showDetails && (
              <div>
                <p className="text-white/80 text-[10px] uppercase tracking-wider mb-1 font-medium drop-shadow">CVV</p>
                <p className="text-white text-xs font-semibold tracking-wide drop-shadow">{cvv}</p>
              </div>
            )}
          </div>
          <SiMastercard className="text-white text-4xl opacity-90 drop-shadow-lg" />
        </div>
      </div>

      <div className="absolute bottom-3 left-6 right-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 14H4v-8h16v8z" />
              </svg>
            </div>
            <span className="text-white/90 text-[9px] uppercase tracking-wider font-medium drop-shadow">Digital Card</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCardDesign;
