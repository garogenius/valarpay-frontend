/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

interface PieChartProps {
  chartData: any;
  chartOption: any;
}

const PieChart: React.FC<PieChartProps> = ({ chartData, chartOption }) => {
  return <Pie data={chartData} options={chartOption} />;
};

export default PieChart;
