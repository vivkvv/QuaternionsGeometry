import React, { useEffect } from "react";
import { Chart, ChartData } from "chart.js";

const FourGridPlotPanel = ({
  data1,
  data2,
}: {
  data1: ChartData;
  data2: ChartData;
}) => {
  // Допустим, что data1 и data2 это данные для N1 и N2 соответственно

  // Инициализация графиков после монтирования компонента
  useEffect(() => {
    let chart1: Chart | null = null;
    // Настройка и создание каждого графика здесь
    // Пример:
    const canvas1 = document.getElementById("chart1");
    if (canvas1) {
      const ctx1 = (canvas1 as HTMLCanvasElement).getContext("2d");
      if (ctx1) {
        chart1 = new Chart(ctx1, {
          type: "line", // или другой тип графика в зависимости от ваших нужд
          data: data1,
          options: {
            // Настройка осей и меток для первого графика
          },
        });
      }
    }
    // Повторите для остальных графиков

    // Очистка при размонтировании компонента
    return () => {
      if (chart1) {
        chart1.destroy();
        chart1 = null;
      }
      // Очистка для остальных графиков
    };
  }, [data1, data2]);

  return (
    <div className="flex flex-wrap w-full h-full">
      <div className="flex-1">
        <div className="w-full h-1/2 p-2">
          <canvas id="chart1"></canvas>
        </div>
        <div className="w-full h-1/2 p-2">
          <canvas id="chart3"></canvas>
        </div>
      </div>
      <div className="flex-1">
        <div className="w-full h-1/2 p-2">
          <canvas id="chart2"></canvas>
        </div>
        <div className="w-full h-1/2 p-2">
          <canvas id="chart4"></canvas>
        </div>
      </div>
    </div>
  );
};

export default FourGridPlotPanel;