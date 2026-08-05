"use client";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IContractStatusChartProps {
  signed: number;
  pending: number;
  risk: number;
}

export const DashboardStatusChart = ({
  signed,
  pending,
  risk,
}: IContractStatusChartProps) => {
  const data: ChartData<"doughnut"> = {
    labels: ["Signés", "En attente", "À risque"],
    datasets: [
      {
        data: [signed, pending, risk],

        // emerald-500, amber-500, rose-500
        backgroundColor: ["#10b981", "#f59e0b", "#f43f5e"],

        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,

    // Épaisseur de l’anneau
    cutout: "78%",

    // Correspond au transform -rotate-90 de ton ancien SVG
    rotation: -90,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.label} : ${value}%`;
          },
        },
      },
    },

    animation: {
      duration: 500,
    },
  };

  return (
    <div className="h-36 w-36">
      <Doughnut data={data} options={options} />
    </div>
  );
};
