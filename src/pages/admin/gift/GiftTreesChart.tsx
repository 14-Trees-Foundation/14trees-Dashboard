import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define the props interface for the PieChart component
interface PieChartProps {
  corporateCount: number;
  personalCount: number;
}

const GiftTreesChart: React.FC<PieChartProps> = ({ corporateCount, personalCount }) => {
  const data = {
    labels: ['Corporate', 'Personal'],
    datasets: [
      {
        label: 'Sponsorship Type',
        data: [corporateCount, personalCount],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return <Pie data={data} />;
};

export default GiftTreesChart;