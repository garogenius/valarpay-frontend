"use client";

import { useEffect, useState } from "react";

const useWindowSize = (): number[] => {
  const isClient = typeof window === "object";
  const [size, setSize] = useState([
    isClient ? window.innerWidth : 0,
    isClient ? window.innerHeight : 0,
  ]);

  useEffect(() => {
    if (isClient) {
      const updateSize = () => setSize([window.innerWidth, window.innerHeight]);

      updateSize();

      window.addEventListener("resize", updateSize);

      return () => window.removeEventListener("resize", updateSize);
    }
  }, [isClient]);

  return size;
};

export default useWindowSize;
