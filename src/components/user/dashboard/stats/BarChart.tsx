/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

interface BarChartProps {
  chartData: any;
  chartOption?: any;
}

const BarChart: React.FC<BarChartProps> = ({ chartData, chartOption }) => {
  return <Bar data={chartData} options={chartOption} />;
};

export default BarChart;
