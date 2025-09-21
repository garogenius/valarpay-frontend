/* eslint-disable @typescript-eslint/no-explicit-any */
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title);
interface LineChartProps {
  chartData: any;
  chartOption: any;
}

const LineChart: React.FC<LineChartProps> = ({ chartData, chartOption }) => {
  return <Line data={chartData} options={chartOption} />;
};

export default LineChart;
