import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EarningsChart = () => {
  const primaryColor = '#4318FF';

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Earnings in $',
        data: [1000, 1200, 800, 1500, 2000, 1800, 2200, 2500, 2300, 2700, 2900, 3200], // Replace with your data
        fill: true,
        backgroundColor: `rgba(67, 24, 255, 0.2)`, // Use your primary color here
        borderColor: primaryColor, 
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Earnings in $',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };

  return (
    <div className='mb-4'>
      <Line data={data} options={options} />
    </div>
  );
};

export default EarningsChart;
