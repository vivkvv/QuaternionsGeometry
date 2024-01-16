// PlotsManager.tsx
import React, { useState } from "react";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import PlotPanel from "./PlotPanel";

interface PlotsManagerProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
  spheraColor: any;
}

const PlotsManager: React.FC<PlotsManagerProps> = ({
  time,
  quaternion1,
  quaternion2,
  spheraColor,
}) => {
  const [activePlotIndex, setActivePlotIndex] = useState<null | number>(null);

  const toggleExclusiveView = (coordinateSystem: number | null) => {
    setActivePlotIndex((prevIndex) =>
      prevIndex === coordinateSystem ? null : coordinateSystem
    );
  };

  return (
    <div className="w-full">
      {/* Контейнер для обычного режима */}
      <div
        className={`h-screen flex flex-wrap ${
          activePlotIndex !== null ? "hidden" : ""
        }`}
      >
        {[0, 1, 2, 3].map((coordinateSystem) => (
          <div key={coordinateSystem} className="w-1/2 h-1/2">
            <PlotPanel
              index={coordinateSystem}
              time={time}
              quaternion1={quaternion1}
              quaternion2={quaternion2}
              coordinateSystem={coordinateSystem}
              isOrthographicCamera={false}
              spheraColor={spheraColor}
              isExclusiveViewActive={activePlotIndex === coordinateSystem}
              onToggleExclusiveView={() =>
                toggleExclusiveView(coordinateSystem)
              }
            />
          </div>
        ))}
      </div>

      {/* Контейнер для эксклюзивного режима */}
      <div
        className={`h-screen ${activePlotIndex === null ? "hidden" : "flex"}`}
      >
        {activePlotIndex !== null && (
          <div className="w-full h-full">
            <PlotPanel
              index={activePlotIndex}
              time={time}
              quaternion1={quaternion1}
              quaternion2={quaternion2}
              coordinateSystem={activePlotIndex}
              isOrthographicCamera={false}
              spheraColor={spheraColor}
              isExclusiveViewActive={true}
              onToggleExclusiveView={() => toggleExclusiveView(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotsManager;
