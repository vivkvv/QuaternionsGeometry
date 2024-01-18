import Plot from "react-plotly.js";
import React, { useEffect, useRef, useState } from "react";
import { TrigonometricalQuaternion } from "../../TrigonometricalQuaternion";
import LocalCoordinateSystem from "./LocalCoordinateSystem";
import * as THREE from "three";

const plotConfig = {
  displayModeBar: false, // Отключает отображение панели инструментов при наведении
};

const basePlotLayout = {
  paper_bgcolor: "black",
  plot_bgcolor: "black",
  showlegend: false,
  xaxis: {
    title: "N1",
    showgrid: true,
    zeroline: true,
    range: [-1.1, 1.1],
    dtick: 0.5,
    tick0: 0,
    tickcolor: "white",
    titlefont: {
      size: 10,
      color: "white",
    },
    tickfont: {
      size: 8,
      color: "white",
    },
    // gridcolor: "gray",
    zerolinecolor: "white",
    scaleanchor: 'y' as const,
    scaleratio: 1    
  },
  yaxis: {
    title: "W1",
    showgrid: true,
    zeroline: true,
    range: [-1.1, 1.1],
    dtick: 0.5,
    tick0: 0,
    tickcolor: "white",
    titlefont: {
      size: 10,
      color: "white",
    },
    tickfont: {
      size: 8,
      color: "white",
    },
    // gridcolor: "gray",
    zerolinecolor: "white",
    scaleanchor: 'x' as const,
    scaleratio: 1    
  },
  autosize: true,
  margin: { l: 30, r: 50, b: 50, t: 50, pad: 4 },
};

function updatePlotLayoutTitles(xTitle: string, yTitle: string) {
  return {
    ...basePlotLayout,
    xaxis: { ...basePlotLayout.xaxis, title: xTitle },
    yaxis: { ...basePlotLayout.yaxis, title: yTitle },
  };
}

// Создание изменённых конфигураций
const leftUpPlotLayout = updatePlotLayoutTitles("N1z", "W1");
const leftDownPlotLayout = updatePlotLayoutTitles("N1x", "N1y");
const rightUpPlotLayout = updatePlotLayoutTitles("N2z", "W2");
const rightDownPlotLayout = updatePlotLayoutTitles("N2x", "N2y");

interface DataPoint {
  x: number;
  y: number;
  color: string; // HEX, RGB или имя цвета
}

interface FourGridPlotPanelProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
}

const FourGridPlotPanel: React.FC<FourGridPlotPanelProps> = ({
  time,
  quaternion1,
  quaternion2,
}) => {
  const [dataLeftUp, setDataLeftUp] = useState<DataPoint[]>([]);
  const [dataLeftDown, setDataLeftDown] = useState<DataPoint[]>([]);
  const [dataRightUp, setDataRightUp] = useState<DataPoint[]>([]);
  const [dataRightDown, setDataRightDown] = useState<DataPoint[]>([]);

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

  const getQuaternionsInCS = (
    baseQuaternion: THREE.Quaternion,
    resultQuaternion: THREE.Quaternion
  ) => {
    const baseVector = new THREE.Vector3(
      baseQuaternion.x,
      baseQuaternion.y,
      baseQuaternion.z
    );
    const baseVectorNormalized = baseVector.clone().normalize();

    const zAxis =
      baseVector.z >= 0
        ? new THREE.Vector3(0, 0, 1)
        : new THREE.Vector3(0, 0, -1);
    const rotationQuaternion = new THREE.Quaternion().setFromUnitVectors(
      baseVectorNormalized,
      zAxis
    );

    const baseVectorTransformed = baseVector
      .clone()
      .applyQuaternion(rotationQuaternion);

    const vectorResult = new THREE.Vector3(
      resultQuaternion.x,
      resultQuaternion.y,
      resultQuaternion.z
    );
    const resultVectorTransformed = vectorResult
      .clone()
      .applyQuaternion(rotationQuaternion);

    return {
      transformedBase: new THREE.Quaternion(
        baseVectorTransformed.x,
        baseVectorTransformed.y,
        baseVectorTransformed.z,
        baseQuaternion.w
      ),
      transformedResult: new THREE.Quaternion(
        resultVectorTransformed.x,
        resultVectorTransformed.y,
        resultVectorTransformed.z,
        resultQuaternion.w
      ),
    };
  };

  const rgbaToRgb = (rgba: any) => {
    return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
  };  

  useEffect(() => {
    const threeQuaternion1 =
      LocalCoordinateSystem.getThreeQuaternionFromTrigonometricalQuaternion(
        time,
        quaternion1
      );
    const threeQuaternion2 =
      LocalCoordinateSystem.getThreeQuaternionFromTrigonometricalQuaternion(
        time,
        quaternion2
      );
    const threeResultQuaternion = threeQuaternion1
      .clone()
      .multiply(threeQuaternion2.clone());

    const {
      transformedBase: transformedBase1,
      transformedResult: transformedResult1,
    } = getQuaternionsInCS(threeQuaternion1, threeResultQuaternion);

    setDataLeftUp([
      { x: transformedBase1.z, y: transformedBase1.w, color: rgbaToRgb(quaternion1.color) },
      { x: transformedResult1.z, y: transformedResult1.w, color: "red" },
    ]);
    setDataRightUp([
      { x: transformedBase1.x, y: transformedBase1.y, color: rgbaToRgb(quaternion1.color) },
      { x: transformedResult1.x, y: transformedResult1.y, color: "red" },
    ]);

    const {
      transformedBase: transformedBase2,
      transformedResult: transformdedResult2,
    } = getQuaternionsInCS(threeQuaternion2, threeResultQuaternion);
    setDataLeftDown([
      { x: transformedBase2.z, y: transformedBase2.w, color: rgbaToRgb(quaternion2.color) },
      { x: transformdedResult2.z, y: transformdedResult2.w, color: "red" },
    ]);
    setDataRightDown([
      { x: transformedBase2.x, y: transformedBase2.y, color: rgbaToRgb(quaternion2.color) },
      { x: transformdedResult2.x, y: transformdedResult2.y, color: "red" },
    ]);
  }, [time, quaternion1, quaternion2]);

  return (
    <div className="flex flex-wrap w-full h-full">
      <div className="flex flex-row w-full h-1/2">
        <div ref={chartLeftUpRef} className="w-1/2 h-full" id="chartLeftUp">
          <Plot
            data={createPlotData(dataLeftUp)}
            layout={leftUpPlotLayout}
            config={plotConfig}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div
          ref={chartRightUpRef}
          className="w-1/2 h-full"
          id="chartRightUpRef"
        >
          <Plot
            data={createPlotData(dataRightUp)}
            layout={leftDownPlotLayout}
            config={plotConfig}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      <div className="flex flex-row w-full h-1/2">
        <div
          ref={chartLeftDownRef}
          className="w-1/2 h-full"
          id="chartLeftDownRef"
        >
          <Plot
            data={createPlotData(dataLeftDown)}
            layout={rightUpPlotLayout}
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
            data={createPlotData(dataRightDown)}
            layout={rightDownPlotLayout}
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
