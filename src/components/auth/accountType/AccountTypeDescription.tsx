"use client";
import { motion, useInView } from "framer-motion";
import { textVariant } from "@/utils/motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import images from "../../../../public/images";

const AccountTypeDescription = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "show" : "hidden"}
      initial="hidden"
      className="flex items-center justify-center w-full h-full relative overflow-hidden"
      style={{
        backgroundImage: 'url("/images/home/landingPage/care.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top-left branding */}
      <Link href="/" className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <Image src={images.logo} alt="ValarPay logo" className="w-8 h-auto" />
        <span className="text-white font-semibold text-lg tracking-wide">VALARPAY</span>
      </Link>
      {/* Overlay */}
      <div className="absolute inset-0 z-0" style={{ background: "rgba(23, 51, 102, 0.8)" }} />

      {/* Glassmorphic Card */}
      <motion.div
        variants={textVariant(0.1)}
        // rounded-2xl border border-white/30 shadow-xl backdrop-blur-[8px] bg-white/10 w-[92%] max-w-xl
        className="relative z-10 flex flex-col gap-3 px-4 py-5 sm:px-10 sm:py-10 "
      >
        <span className="inline-block px-4 py-1 rounded-full bg-[#1C2E50] text-primary text-lg font-semibold mb-2 w-fit">
          Welcome to ValarPay
        </span>
        {(() => {
          const slides = [
            {
              title: (
                <>
                  ValarPay <span className="text-primary">Simple & Safe</span> Banking
                </>
              ),
              desc:
                "ValarPay is an innovative banking solution crafted for today and the future — fast, intuitive and secure.",
            },
            {
              title: (
                <>
                  Global Payments, <span className="text-primary">Local Convenience</span>
                </>
              ),
              desc:
                "Send money, pay bills, buy airtime and manage savings effortlessly — all in one powerful app.",
            },
            {
              title: (
                <>
                  Bank‑Level <span className="text-primary">Security</span> You Can Trust
                </>
              ),
              desc:
                "Multi‑layer encryption, real‑time monitoring and 24/7 support keep your money and data protected.",
            },
          ];

          const [index, setIndex] = useState(0);
          useEffect(() => {
            const id = setInterval(() => {
              setIndex((i) => (i + 1) % slides.length);
            }, 5000);
            return () => clearInterval(id);
          }, []);

          return (
            <>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-2"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  {slides[index].title}
                </h1>
                <p className="text-base sm:text-lg text-white/80">
                  {slides[index].desc}
                </p>
              </motion.div>

              {/* Indicators */}
              <div className="mt-3 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    aria-label={`Go to slide ${i + 1}`}
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === i ? "w-6 bg-primary" : "w-3 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          );
        })()}
      </motion.div>
    </motion.div>
  );
};

export default AccountTypeDescription;