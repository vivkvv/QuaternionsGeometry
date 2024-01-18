// QuaternionPanel.tsx
import React, { useState } from "react";
import QuaternionProperties from "./QuaternionProperties";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import SketchExample from "./SketchPicker";
import ResultQuaternion from "./ResultQuaternion";

// Добавляем интерфейс для пропсов
interface CommonPanelProps {
  time: number;
  setTime: (newTime: number) => void;
  quaternion1: TrigonometricalQuaternion;
  setQuaternion1: (newQuaternion: TrigonometricalQuaternion) => void;
  quaternion2: TrigonometricalQuaternion;
  setQuaternion2: (newQuaternion: TrigonometricalQuaternion) => void;

  spheraColor: any;
  setSpheraColor: (color: any) => void;
}

const CommonPanel: React.FC<CommonPanelProps> = ({
  time,
  setTime,
  quaternion1,
  setQuaternion1,
  quaternion2,
  setQuaternion2,
  spheraColor,
  setSpheraColor,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [quaternion1Color, setQuaternion1Color] = useState(quaternion1.color);
  const [quaternion2Color, setQuaternion2Color] = useState(quaternion2.color);

  const handleQuaternion1ColorChange = (color: any) => {
    //const newColor = color; //`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    const newQuaternion = {
      ...quaternion1,
      color: color, // Обновляем цвет в кватернионе
    };
    setQuaternion1(newQuaternion); // Устанавливаем новое состояние кватерниона
    setQuaternion1Color(color);
  };

  const handleQuaternion2ColorChange = (color: any) => {
    //const newColor = color; //`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    const newQuaternion = {
      ...quaternion2,
      color: color, // Обновляем цвет в кватернионе
    };
    setQuaternion2(newQuaternion); // Устанавливаем новое состояние кватерниона
    setQuaternion2Color(color);
  };

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

      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center justify-between"
      >
        Color options
        <span className={`ml-2 ${showOptions ? "rotate-90" : ""}`}>▶</span>
      </button>
      {showOptions && (
        <div>
          <div className="flex justify-between items-center">
            <label className="mr-2">Left quaternion</label>
            <div className="flex flex-col items-center">
              <SketchExample
                initialColor={{
                  r: quaternion1Color.r,
                  g: quaternion1Color.g,
                  b: quaternion1Color.b,
                  a: quaternion1Color.a,
                }}
                onChange={handleQuaternion1ColorChange}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="mr-2">Right quaternion</label>
            <div className="flex flex-col items-center">
              <SketchExample
                initialColor={{
                  r: quaternion2Color.r,
                  g: quaternion2Color.g,
                  b: quaternion2Color.b,
                  a: quaternion2Color.a,
                }}
                onChange={handleQuaternion2ColorChange}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="mr-2">Sphera</label>
            <div className="flex flex-col items-center">
              <SketchExample
                initialColor={{
                  r: spheraColor.color.r,
                  g: spheraColor.color.g,
                  b: spheraColor.color.b,
                  a: spheraColor.color.a,
                }}
                // onChange={handleQuaternion2ColorChange}
                onChange={(color: any) => setSpheraColor({ color: color })}
              />
            </div>{" "}
          </div>

          {/* <div className="flex justify-between items-center">
            <label className="mr-2">Result quaternion</label>
            <div className="flex flex-col items-center">
              <SketchExample />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="mr-2">Circles</label>
            <div className="flex flex-col items-center">
              <SketchExample />
            </div>
          </div> */}
        </div>
      )}

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
        time={time}
      />
      <hr className="my-4" />
      <QuaternionProperties
        index={2}
        quaternion={quaternion2}
        setQuaternion={setQuaternion2}
        time={time}
      />
      <hr className="my-4" />
      <ResultQuaternion
        time={time}
        quaternion1={quaternion1}
        quaternion2={quaternion2}
      />
      <hr className="my-4" />
    </div>
  );
};

export default CommonPanel;
