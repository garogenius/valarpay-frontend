"use client";

import { useMemo } from "react";
import BarChart from "../stats/BarChart";
import { useGetTransactions } from "@/api/wallet/wallet.queries";
import { format } from "date-fns";

interface TransactionChartCardProps {
  spanCols?: number;
}

const TransactionChartCard = ({ spanCols = 1 }: TransactionChartCardProps) => {
  // Fetch transactions for the last 6 months
  const { transactionsData, isPending } = useGetTransactions({
    page: 1,
    limit: 1000, // Get enough transactions to analyze
  });

  const chartData = useMemo(() => {
    const transactions = transactionsData?.transactions || [];
    
    // Get last 6 months
    const months: string[] = [];
    const monthData: { [key: string]: { created: number; debited: number } } = {};
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = format(date, "MMM");
      months.push(monthKey);
      monthData[monthKey] = { created: 0, debited: 0 };
    }

    // Process transactions
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const monthKey = format(transactionDate, "MMM");
      
      if (monthData[monthKey]) {
        const amount = 
          transaction.transferDetails?.amountPaid ||
          transaction.depositDetails?.amountPaid ||
          transaction.billDetails?.amountPaid ||
          Math.abs(transaction.currentBalance - transaction.previousBalance) ||
          0;

        if (transaction.type === "CREDIT") {
          monthData[monthKey].created += amount;
        } else if (transaction.type === "DEBIT") {
          monthData[monthKey].debited += amount;
        }
      }
    });

    const createdData = months.map((month) => monthData[month]?.created || 0);
    const debitedData = months.map((month) => monthData[month]?.debited || 0);

    return {
      labels: months,
      datasets: [
        {
          label: "Created",
          data: createdData,
          backgroundColor: "#1E40AF", // Dark blue
          borderRadius: 4,
          barThickness: 20,
        },
        {
          label: "Debited",
          data: debitedData,
          backgroundColor: "#60A5FA", // Light blue
          borderRadius: 4,
          barThickness: 20,
        },
      ],
    };
  }, [transactionsData]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
          align: "end" as const,
          labels: {
            color: "#9CA3AF",
            usePointStyle: true,
            pointStyle: "rect",
            padding: 10,
            font: { size: 11 },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
          displayColors: true,
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: ₦${context.parsed.y.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { 
            color: "#9CA3AF", 
            font: { size: 10 },
            maxRotation: 0,
          },
        },
        y: {
          grid: { 
            color: "#2C2C2E", 
            drawBorder: false,
          },
          ticks: { 
            color: "#9CA3AF",
            font: { size: 10 },
            callback: function(value: any) {
              return '₦' + (value / 1000).toFixed(0) + 'k';
            },
            maxTicksLimit: 6,
          },
          beginAtZero: true,
        },
      },
    };
  }, []);

  const gridColClass = useMemo(() => {
    if (spanCols === 2) return "sm:col-span-2";
    if (spanCols === 3) return "sm:col-span-2 lg:col-span-2 xl:col-span-3";
    return "";
  }, [spanCols]);

  return (
    <div 
      className={`bg-[#2C2C2E] dark:bg-[#2C2C2E] rounded-xl p-4 h-full ${gridColClass}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-white">
          <svg className="w-5 h-5 text-[#FF6B2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium">Transaction Overview</span>
        </div>
      </div>

      <div className="h-[150px] w-full">
        {isPending ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Loading chart...
          </div>
        ) : (
          <BarChart chartData={chartData} chartOption={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default TransactionChartCard;

