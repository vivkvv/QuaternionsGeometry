// PlotsManager.tsx
import React from "react";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import PlotPanel from "./PlotPanel";

interface PlotsManagerProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
}

const PlotsManager: React.FC<PlotsManagerProps> = ({
  time,
  quaternion1,
  quaternion2,
}) => {
  return (
    <div className="flex flex-wrap h-screen">
      {/* Create four PlotPanel with different coordinate systems */}
      {[0, 1, 2, 3].map((coordinateSystem) => (
        <div key={coordinateSystem} className="p-1 w-1/2 h-1/2">
          {
            <PlotPanel
              time={time}
              quaternion1={quaternion1}
              quaternion2={quaternion2}
              coordinateSystem={coordinateSystem}
              isOrthographicCamera={false}
            />
          }
        </div>
      ))}
    </div>
  );
};

export default PlotsManager;
