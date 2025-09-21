import React from "react";

const VerificationNav = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { value: number; clickable: boolean; completed: boolean }[];
  handleStepClick: (step: number) => void;
}) => {
  const getProgressWidth = () => {
    if (currentStep === 0) return "0%";
    // If we're on step 1 but it's not completed, don't show progress
    if (currentStep === 1 && !steps[0].completed) return "0%";
    // If we're on step 2 or higher, show progress based on completed steps
    return `${((currentStep - 1) / (steps.length - 1)) * 100}%`;
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-bg-300 -translate-y-1/2" />

        {/* Active Progress Line */}
        <div
          className="absolute left-0 top-1/2 h-[1px] bg-primary -translate-y-1/2 transition-all duration-300"
          style={{ width: getProgressWidth() }}
        />

        {/* Step Indicators */}
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = step.completed;
          // Show active styling only if the step is completed or is the current step (except for step 1)
          const showActiveStyle =
            (index === 0 && isCompleted) ||
            (index > 0 &&
              (isCompleted || (isActive && steps[index].completed)));

          return (
            <button
              key={index}
              onClick={() => {}}
              className={`
                  relative z-10 w-8 xs:w-10 h-8 xs:h-10 rounded-full border-[3.34px] 
                  flex items-center justify-center
                  transition-all duration-300
                  ${
                    showActiveStyle
                      ? "bg-primary border-primary"
                      : "bg-bg-600 dark:bg-bg-1100 border-border-600"
                  }
                `}
            >
              {showActiveStyle && (
                <svg
                  className="text-text-1500 dark:text-text-200 transform transition-transform duration-300 hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.75 12.75L10.25 16.25L17.25 9.75"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-draw"
                  />
                  <style>
                    {`
                        @keyframes draw {
                          from {
                            stroke-dashoffset: 50;
                          }
                          to {
                            stroke-dashoffset: 0;
                          }
                        }
                        .animate-draw {
                          stroke-dasharray: 50;
                          animation: draw 0.6s ease forwards;
                        }
                      `}
                  </style>
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationNav;
