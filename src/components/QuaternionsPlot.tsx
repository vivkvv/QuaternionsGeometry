// QuaternionsPlot.js
import React from "react";
import GlobalScene from "./scene/GlobalScene";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";

interface QuaternionsPlotProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
}

const QuaternionsPlot: React.FC<QuaternionsPlotProps> = ({
  time,
  quaternion1,
  quaternion2,
}) => {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#000" }}>
      <GlobalScene
        time={time}
        quaternion1={quaternion1}
        quaternion2={quaternion2}
      />
    </div>
  );
};

export default QuaternionsPlot;
