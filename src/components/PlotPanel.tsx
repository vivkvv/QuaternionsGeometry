import React, { useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import QuaternionsPlot from "./QuaternionsPlot";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";

interface PlotPanelProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
  coordinateSystem: number;
  setCoordinateSystem: (newCoordinateSystem: number) => void;
  isOrthographicCamera: boolean;
  setOrthographicCamera: (orthographicCamera: boolean) => void;
}

const PlotPanel: React.FC<PlotPanelProps> = ({
  time,
  quaternion1,
  quaternion2,
  coordinateSystem,
  setCoordinateSystem,
  isOrthographicCamera,
  setOrthographicCamera,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  //const [coordinateSystem, setCoordinateSystem] = useState(0);

  const handleRunClick = () => {
    setIsRunning(!isRunning);
  };

  const handleCoordChange = (num: number) => {
    setCoordinateSystem(num);
  };

  const handleCameraTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOrthographicCamera(event.target.checked);
  };

  return (
    <div style={{ flex: 1, padding: "10px", backgroundColor: "#e0e0e0" }}>
      {/* Контейнер для кнопок */}
      <div className="flex space-x-2.5 mb-4">
        {/* Кнопка Run с иконкой */}
        <button onClick={handleRunClick} style={{ marginRight: "10px" }}>
          {isRunning ? <FaPause /> : <FaPlay />}
        </button>

        {/* Чекбокс для типа камеры */}
        <div className="flex items-center mb-4">
          <label htmlFor="cameraType" className="text-xs mr-2">
            Orthographic Camera:
          </label>
          <input
            id="cameraType"
            type="checkbox"
            checked={isOrthographicCamera}
            onChange={handleCameraTypeChange}
            className="form-checkbox h-4 w-4"
          />
        </div>

        {/* Кнопки координат*/}
        <div className="flex items-center justify-center space-x-2 mb-4">
          {[0, 1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => handleCoordChange(num)}
              className={`w-8 h-8 flex justify-center items-center border-2 ${
                coordinateSystem === num
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-transparent"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
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
        <QuaternionsPlot
          time={time}
          quaternion1={quaternion1}
          quaternion2={quaternion2}
          coordinateSystem={coordinateSystem}
          isOrthographicCamera={isOrthographicCamera}
        />
      </div>
    </div>
  );
};

export default PlotPanel;
