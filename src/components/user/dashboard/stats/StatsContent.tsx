"use client";
import React, { useState } from "react";
import StatsFilter from "./StatsFilter";
import LineChart from "./LineChart";
import { statsLineOption, statsPieOption } from "./data";
import PieChart from "./PieChart";
import { useGetLineStats, useGetPieStats } from "@/api/website/website.queries";
import { useTheme } from "@/store/theme.store";
import Skeleton from "react-loading-skeleton";

const StatsContent = () => {
  const [sort, setSort] = useState("all");
  const theme = useTheme();

  const {
    lineStats,
    isPending: linePending,
    isError: lineError,
  } = useGetLineStats();

  const {
    pieStats,
    isPending: piePending,
    isError: pieError,
  } = useGetPieStats({ sort });

  const isLoading = (linePending && !lineError) || (piePending && !pieError);

  // Only create chart data if the stats are available and there's no error
  const statsLineData =
    lineStats && !lineError
      ? {
          labels: lineStats.map((data) => data.date),
          datasets: [
            {
              fill: false,
              label: "Credits (₦)",
              data: lineStats.map((item) => item.credits),
              borderColor: "#068E44",
              backgroundColor: "#068E44",
              tension: 0.4,
              borderWidth: 2,
            },
            {
              fill: false,
              label: "Debits (₦)",
              data: lineStats.map((item) => item.debits),
              borderColor: "#E4063D",
              backgroundColor: "#E4063D",
              tension: 0.4,
              borderWidth: 2,
            },
          ],
        }
      : null;

  const statsPieData =
    pieStats && !pieError
      ? {
          labels: pieStats.map(
            (data) => `${data.title} - ₦${data.value.toLocaleString()}`
          ),
          datasets: [
            {
              data: pieStats.map((item) => item.value),
              backgroundColor: pieStats.map((item) => item.color),
              borderColor: pieStats.map((item) => item.color),
            },
          ],
        }
      : null;

  const renderChartSkeleton = () => (
    <div className="w-full h-fit flex flex-col gap-4">
      {[1, 2, 3, 4].map((index) => (
        <Skeleton
          key={index}
          className="h-8"
          baseColor={theme === "light" ? "#e0e0e0" : "#202020"}
          highlightColor={theme === "light" ? "#f5f5f5" : "#444444"}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-2 mt-2 overflow-x-hidden">
      <div className="w-full flex max-lg:flex-col gap-4">
        <div className="max-sm:hidden  w-full lg:w-[50%] flex flex-col bg-bg-600 dark:bg-bg-1100 px-4 xs:px-6 py-4 xs:py-6 2xl:py-8 rounded-lg sm:rounded-xl">
          <h2 className="text-text-200 dark:text-text-400 text-lg md:text-xl font-semibold mb-4">
            My Portfolio
          </h2>
          <div className="w-full h-full flex justify-center items-center">
            {isLoading
              ? renderChartSkeleton()
              : statsLineData && (
                  <div className="w-full  h-full flex justify-center items-center">
                    <LineChart
                      chartData={statsLineData ?? []}
                      chartOption={{
                        ...statsLineOption,
                        // maintainAspectRatio: false,
                        // responsive: true,
                      }}
                    />
                  </div>
                )}
          </div>
        </div>
        <div className="w-full lg:w-[50%] flex flex-col items-center bg-bg-600 dark:bg-bg-1100 px-4 xs:px-6 py-4 xs:py-6 2xl:py-8 rounded-lg sm:rounded-xl">
          <StatsFilter sort={sort} setSort={setSort} />
          {isLoading
            ? renderChartSkeleton()
            : statsPieData && (
                <div className="w-full  xs:w-[90%] sm:w-[80%] md:w-[70%] lg:w-full xl:w-full flex justify-center items-center">
                  <PieChart
                    chartData={statsPieData ?? []}
                    chartOption={statsPieOption}
                  />
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default StatsContent;
