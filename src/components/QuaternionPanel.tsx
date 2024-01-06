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
      <div className="flex items-center mb-4">
        <label className="text-sm font-medium text-gray-700 mr-2">t = </label>
        <input
          type="number"
          value={time}
          onChange={(e) => {
            setTime(Number(e.target.value));
          }}
          className="mt-1 p-2 border border-gray-300"
          style={{ flex: "1 1 auto" }} // Это позволит полю ввода заполнить оставшееся пространство
        />
      </div>
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
    </div>
  );
};

export default QuaternionPanel;
