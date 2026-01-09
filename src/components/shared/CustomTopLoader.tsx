"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const CustomTopLoader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 10;
      });
    }, 50);

    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#f76301] to-[#e55a00] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-[#f76301] to-transparent opacity-50" />
    </div>
  );
};

export default CustomTopLoader;

