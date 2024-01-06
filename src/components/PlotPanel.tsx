import React, { useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import QuaternionsPlot from "./QuaternionsPlot";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";

interface PlotPanelProps {
  time: number,
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
}

const PlotPanel: React.FC<PlotPanelProps> = ({ time, quaternion1, quaternion2 }) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleRunClick = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div style={{ flex: 1, padding: "10px", backgroundColor: "#e0e0e0" }}>
      {/* Контейнер для кнопок */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        {/* Кнопка Run с иконкой */}
        <button onClick={handleRunClick} style={{ marginRight: "10px" }}>
          {isRunning ? <FaPause /> : <FaPlay />}
        </button>

        {/* Дополнительные кнопки */}
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button key={num} style={{ marginRight: num !== 6 ? "10px" : "0" }}>
            Coord {num}
          </button>
        ))}

        {/* Кнопка более сложного компонента */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "60px",
            height: "60px",
            border: "1px solid black",
          }}
        >
          {/* Здесь будет сложный компонент */}
        </div>
      </div>

      {/* Здесь будет отображаться графика */}
      <div>
        <QuaternionsPlot time={time} quaternion1={quaternion1} quaternion2={quaternion2} />
      </div>
    </div>
  );
};

export default PlotPanel;
