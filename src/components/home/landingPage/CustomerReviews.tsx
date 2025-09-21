"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "@/utils/hoc/SectionWrapper";
import { fadeIn, textVariant, zoomIn } from "@/utils/motion";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ name, role, review, rating }: { name: string; role: string; review: string; rating: number }) => (
  <div className="rounded-2xl bg-white dark:bg-[#041943]/60 p-6 border border-border-400 shadow-sm">
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
    <p className="text-text-200 dark:text-text-400 text-sm md:text-base mb-4">"{review}"</p>
    <div>
      <p className="font-semibold text-text-200 dark:text-white">{name}</p>
      <p className="text-sm text-text-1000 dark:text-text-400">{role}</p>
    </div>
  </div>
);

const CustomerReviews = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.25 });

  const reviews = [
    {
      name: "Adebayo Johnson",
      role: "Small Business Owner",
      review: "ValarPay has transformed how I manage my business finances. The ease of bill payments and savings features are incredible.",
      rating: 5
    },
    {
      name: "Ngozi Okoye",
      role: "Freelancer",
      review: "As a freelancer, I love the instant virtual cards and QR code payments. It makes transactions so seamless.",
      rating: 5
    },
    {
      name: "Emeka Nwosu",
      role: "Entrepreneur",
      review: "The loan options and business account features have helped me scale my operations. Highly recommend ValarPay!",
      rating: 5
    }
  ];

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "show" : "hidden"}
      initial="hidden"
      className="w-full flex flex-col items-center py-14 md:py-20 bg-bg-400 dark:bg-dark-primary"
    >
      {/* Header */}
      <div className="w-[90%] md:w-[80%] lg:w-[70%] flex flex-col items-center text-center">
        <motion.span
          variants={fadeIn("up", "spring", 0.05, 0.5)}
          className="text-xs md:text-sm tracking-[0.2em] text-secondary font-semibold"
        >
          CUSTOMER STORIES
        </motion.span>
        <motion.h2
          variants={textVariant(0.1)}
          className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-200 dark:text-text-400"
        >
          What our customers are saying
        </motion.h2>
        <motion.p
          variants={fadeIn("up", "spring", 0.15, 0.5)}
          className="mt-2 text-text-1000 dark:text-text-400/80 text-sm md:text-base max-w-2xl"
        >
          Discover how ValarPay is empowering individuals and businesses across Nigeria to achieve their financial goals.
        </motion.p>
      </div>

      {/* Reviews Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%] md:w-[86%] xl:w-[75%]">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            variants={zoomIn(0.1 * index, 0.5)}
          >
            <ReviewCard {...review} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SectionWrapper(CustomerReviews, "customer-reviews");