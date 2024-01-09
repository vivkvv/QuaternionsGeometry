// ControlPanel.tsx
import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";

interface ControlPanelProps {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  coordinateSystem: number;
  setCoordinateSystem: (num: number) => void;
  isOrthographicCamera: boolean;
  setOrthographicCamera: (orthographicCamera: boolean) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  setIsRunning,
  coordinateSystem,
  setCoordinateSystem,
  isOrthographicCamera,
  setOrthographicCamera,
}) => {
  return (
    <div className="flex items-center">
      {/* Кнопка Run с иконкой */}
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? <FaPause /> : <FaPlay />}
      </button>

      {/* Чекбокс для типа камеры */}
      <div className="flex items-center">
        <label htmlFor="cameraType" className="text-xs mr-2">
          Orthographic Camera:
        </label>
        <input
          id="cameraType"
          type="checkbox"
          checked={isOrthographicCamera}
          onChange={(e) => setOrthographicCamera(e.target.checked)}
          className="form-checkbox h-4 w-4 mr-2"
        />
      </div>

      {/* Кнопки координат */}
      <div className="flex items-center justify-center space-x-2">
        {[0, 1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => setCoordinateSystem(num)}
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
    </div>
  );
};

export default ControlPanel;
