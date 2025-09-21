export const statsLineOption = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: "#797B86",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: "#EFF0F3",
        drawBorder: false,
      },
      ticks: {
        color: "#797B86",
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
      align: "end",

      labels: {
        boxWidth: 10,
        color: "#797B86",
      },
    },
    title: {
      display: false,
      text: "Earnings (₦)",
      position: "bottom",
      color: "#797B86",
    },
  },
};

export const statsPieOption = {
  responsive: true,
  plugins: {
    legend: {
      position: window.innerWidth < 500 ? "bottom" : "right", // Mobile breakpoint at 768px
      labels: {
        boxWidth: window.innerWidth < 500 ? 7 : 14,
        boxHeight: window.innerWidth < 500 ? 7 : 14,
        padding: 15,
        font: {
          size: window.innerWidth < 500 ? 12 : 14, // Increased from 12
          weight: window.innerWidth < 500 ? "" : "bold", // Added font weight
        },
      },
    },
    title: {
      display: false,
      text: "Insight",
      position: "bottom",
    },
  },
};
