// PlotsManager.tsx
import React, { useState } from "react";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import PlotPanel from "./PlotPanel";
import PlotViewContext from "./PlotViewContext";
import FourGridPlotPanel, { DataPoint } from "./scene/FourGridPlotPanel";

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

  const toggleExclusiveView = (coordinateSystem: number) => {
    setActivePlotIndex((prevIndex) =>
      prevIndex === coordinateSystem ? null : coordinateSystem
    );
  };

  return (
    <PlotViewContext.Provider value={{ activePlotIndex, setActivePlotIndex }}>
      <div className="flex flex-wrap w-full h-full">
        {[0, 1, 2, 3].map((coordinateSystem) => {
          let panelClasses = "w-1/2 h-1/2"; // Обычный размер для сетки 2x2
          // Если активен эксклюзивный режим...
          if (activePlotIndex !== null) {
            // Если этот PlotPanel активен, используем всю область
            if (activePlotIndex === coordinateSystem) {
              panelClasses = "w-full h-full";
            } else {
              // Если другой PlotPanel активен, скрываем этот
              panelClasses = "hidden";
            }
          }

          const dataFor: DataPoint[] = [
            { x: 0.1, y: 0.2, color: 'red' },
            { x: 0.3, y: 0.4, color: 'blue' },
            { x: 0.5, y: 0.6, color: 'green' }
          ];

          return (
            <div key={coordinateSystem} className={panelClasses}>
              {coordinateSystem === 3 ? (
                <FourGridPlotPanel
                  dataLeftUp={dataFor}
                  dataLeftDown={dataFor}
                  dataRightUp={dataFor}
                  dataRightDown={dataFor}
                />
              ) : (
                <PlotPanel
                  index={coordinateSystem}
                  time={time}
                  quaternion1={quaternion1}
                  quaternion2={quaternion2}
                  coordinateSystem={coordinateSystem}
                  isOrthographicCamera={false}
                  spheraColor={spheraColor}
                  onToggleExclusiveView={() =>
                    toggleExclusiveView(coordinateSystem)
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </PlotViewContext.Provider>
  );
};

export default PlotsManager;
