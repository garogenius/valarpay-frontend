"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface TransactionProcessingLoaderProps {
  isOpen: boolean;
}

const TransactionProcessingLoader: React.FC<TransactionProcessingLoaderProps> = ({
  isOpen,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex items-center justify-center"
          >
            <Image
              src="/images/valarpay_5.gif"
              alt="Processing..."
              width={200}
              height={200}
              unoptimized
              className="w-48 h-48 sm:w-64 sm:h-64"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionProcessingLoader;

