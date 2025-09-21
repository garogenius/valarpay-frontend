"use client";
import React, { useState, useEffect } from "react";

const LoadingAnimation = ({
  onLoadingComplete,
}: {
  onLoadingComplete: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(interval);
        // When progress reaches 100, show check and notify parent
        setTimeout(() => {
          setShowCheck(true);
          setTimeout(onLoadingComplete, 700); // Give time for check animation
        }, 200);
        return prev;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-24 h-24">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <circle
            className="text-secondary transition-all duration-300"
            strokeWidth="8"
            strokeDasharray={264}
            strokeDashoffset={264 - (progress / 100) * 264}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          {!showCheck ? (
            <span className="text-secondary text-xl font-semibold">
              {progress}%
            </span>
          ) : (
            <svg
              className="w-12 h-12 text-secondary animate-scale-check"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
