// QuaternionPanel.tsx
import React from "react";
import QuaternionProperties from "./QuaternionProperties";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";

// Добавляем интерфейс для пропсов
interface QuaternionPanelProps {
  time: number;
  setTime: (newTime: number) => void;
  quaternion1: TrigonometricalQuaternion;
  setQuaternion1: (newQuaternion: TrigonometricalQuaternion) => void;
  quaternion2: TrigonometricalQuaternion;
  setQuaternion2: (newQuaternion: TrigonometricalQuaternion) => void;
}

const QuaternionPanel: React.FC<QuaternionPanelProps> = ({
  time,
  setTime,
  quaternion1,
  setQuaternion1,
  quaternion2,
  setQuaternion2,
}) => {
  return (
    <div style={{ width: "25%", padding: "10px", backgroundColor: "#f0f0f0" }}>
      <div className="font-bold text-lg">
        <p>
          Q = cos(&phi;<sub>0</sub> + 2&pi;&nu;t) + (i&middot;cos&alpha; +
          j&middot;cos&beta; + k&middot;cos(&gamma;)) &middot; sin(&phi;
          <sub>0</sub> + 2&pi;&nu;t)
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex items-center mb-4 space-x-2">
        <label
          htmlFor="timeInput"
          className="text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          t{" "}
        </label>
        <input
          id="timeInput"
          type="number"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          className="flex-1 mt-1 p-2 border border-gray-300"
        />
      </div>
      <hr className="my-4" />
      <QuaternionProperties
        index={1}
        quaternion={quaternion1}
        setQuaternion={setQuaternion1}
      />
      <hr className="my-4" />
      <QuaternionProperties
        index={2}
        quaternion={quaternion2}
        setQuaternion={setQuaternion2}
      />
      <hr className="my-4" />
    </div>
  );
};

export default QuaternionPanel;
