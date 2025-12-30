"use client";
import React, { useMemo, useState } from "react";
import { useGetLineStats } from "@/api/website/website.queries";
import Skeleton from "react-loading-skeleton";
import StatsFilter from "./stats/StatsFilter";
import BarChart from "./stats/BarChart";

const AnalyticsPanel = () => {
  const [sort, setSort] = useState("week");
  const { lineStats, isPending, isError } = useGetLineStats();

  const chartData = useMemo(() => {
    if (!lineStats || isError) return null;
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"],
      datasets: [
        {
          label: "Incoming",
          data: lineStats.slice(0, 7).map((d) => d.credits),
          backgroundColor: "#3B82F6",
          borderRadius: 6,
          barThickness: 16,
        },
        {
          label: "Outgoing",
          data: lineStats.slice(0, 7).map((d) => d.debits),
          backgroundColor: "#10B981",
          borderRadius: 6,
          barThickness: 16,
        },
      ],
    };
  }, [lineStats, isError]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { color: "#9CA3AF", font: { size: 11 } },
        },
        y: {
          grid: { color: "#2C2C2E", drawBorder: false },
          ticks: { 
            color: "#9CA3AF",
            font: { size: 11 },
            callback: function(value: any) {
              return '₦' + (value / 1000000).toFixed(0) + '00,000.00';
            }
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom" as const,
          align: "start" as const,
          labels: { 
            color: "#9CA3AF",
            usePointStyle: true,
            pointStyle: "rect",
            padding: 15,
            font: { size: 12 }
          },
        },
      },
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#1C1C1E] px-4 sm:px-6 py-4 sm:py-6 rounded-xl">
      <div className="w-full mb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Analytics</h2>
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#FF6B2C] hover:bg-[#FF7D3D] text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
            This Week
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="hidden sm:block">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="text-[11px] sm:text-xs text-gray-400 mt-1">See how your money moves and how you spent it</p>
      </div>

      <div className="relative w-full min-h-[280px] lg:min-h-[320px]">
        {isPending && !isError ? (
          <div className="flex flex-col gap-3 py-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-8"
                baseColor="#2C2C2E"
                highlightColor="#3A3A3C"
              />
            ))}
          </div>
        ) : chartData ? (
          <div className="absolute inset-0">
            <BarChart chartData={chartData} chartOption={chartOptions} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
