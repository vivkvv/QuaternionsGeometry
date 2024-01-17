import Plot from "react-plotly.js";
import React, { useRef } from "react";

const plotConfig = {
  displayModeBar: false, // Отключает отображение панели инструментов при наведении
};

const plotLayout = {
  showlegend: false,
  xaxis: {
    title: "N1",
    showgrid: true,
    zeroline: true,
    range: [-1, 1], // Установка диапазона для оси X
    titlefont: { size: 10 }, // Уменьшение размера шрифта для заголовка оси X
    tickfont: { size: 8 }, // Уменьшение размера шрифта для делений на оси X
  },
  yaxis: {
    title: "W1",
    showgrid: true,
    zeroline: true,
    range: [-1, 1], // Установка диапазона для оси Y
    titlefont: { size: 10 }, // Уменьшение размера шрифта для заголовка оси X
    tickfont: { size: 8 }, // Уменьшение размера шрифта для делений на оси X
  },
  autosize: true,
  margin: { l: 30, r: 50, b: 50, t: 50, pad: 4 }, // Настройка отступов
};

export interface DataPoint {
  x: number;
  y: number;
  color: string; // HEX, RGB или имя цвета
}

interface FourGridPlotPanelProps {
  dataLeftUp: DataPoint[];
  dataLeftDown: DataPoint[];
  dataRightUp: DataPoint[];
  dataRightDown: DataPoint[];
}

const FourGridPlotPanel: React.FC<FourGridPlotPanelProps> = ({
  dataLeftUp,
  dataLeftDown,
  dataRightUp,
  dataRightDown,
}) => {
  const chartLeftUpRef = useRef<HTMLDivElement>(null);
  const chartLeftDownRef = useRef<HTMLDivElement>(null);
  const chartRightUpRef = useRef<HTMLDivElement>(null);
  const chartRightDownRef = useRef<HTMLDivElement>(null);

  const createPlotData = (dataPoints: DataPoint[]) => {
    return dataPoints.map((point) => ({
      x: [point.x],
      y: [point.y],
      type: "scatter" as const,
      mode: "markers" as const,
      marker: { color: point.color },
    }));
  };

  const plotDataLeftUp = createPlotData(dataLeftUp);
  const plotDataLeftDown = createPlotData(dataLeftDown);
  const plotDataRightUp = createPlotData(dataRightUp);
  const plotDataRightDown = createPlotData(dataRightDown);

  return (
    <div className="flex flex-wrap w-full h-full">
      <div className="flex flex-row w-full h-1/2">
        <div ref={chartLeftUpRef} className="w-1/2 h-full" id="chartLeftUp">
          <Plot
            data={plotDataLeftUp}
            layout={plotLayout}
            config={plotConfig}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div
          ref={chartLeftDownRef}
          className="w-1/2 h-full"
          id="chartLeftDownRef"
        >
          <Plot
            data={plotDataLeftDown}
            layout={plotLayout}
            config={plotConfig}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      <div className="flex flex-row w-full h-1/2">
        <div
          ref={chartRightUpRef}
          className="w-1/2 h-full"
          id="chartRightUpRef"
        >
          <Plot
            data={plotDataRightUp}
            layout={plotLayout}
            config={plotConfig}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div
          ref={chartRightDownRef}
          className="w-1/2 h-full"
          id="chartRightDownRef"
        >
          <Plot
            data={plotDataRightDown}
            layout={plotLayout}
            config={plotConfig}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default FourGridPlotPanel;
