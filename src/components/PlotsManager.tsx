// PlotsManager.tsx
import React, { useState } from "react";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import PlotPanel from "./PlotPanel";
import PlotViewContext from "./PlotViewContext";
import FourGridPlotPanel from "./scene/FourGridPlotPanel";

interface PlotsManagerProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
  spheraColor: any;
}

// const PlotsManager: React.FC<PlotsManagerProps> = ({
//   time,
//   quaternion1,
//   quaternion2,
//   spheraColor,
// }) => {
//   const [activePlotIndex, setActivePlotIndex] = useState<null | number>(null);

//   const toggleExclusiveView = (coordinateSystem: number | null) => {
//     setActivePlotIndex((prevIndex) =>
//       prevIndex === coordinateSystem ? null : coordinateSystem
//     );
//   };

//   return (
//     <div className="w-full">
//       {/* Контейнер для обычного режима */}
//       <div
//         className={`h-screen flex flex-wrap ${
//           activePlotIndex !== null ? "hidden" : ""
//         }`}
//       >
//         {[0, 1, 2, 3].map((coordinateSystem) => (
//           <div key={coordinateSystem} className="w-1/2 h-1/2">
//             <PlotPanel
//               index={coordinateSystem}
//               time={time}
//               quaternion1={quaternion1}
//               quaternion2={quaternion2}
//               coordinateSystem={coordinateSystem}
//               isOrthographicCamera={false}
//               spheraColor={spheraColor}
//               isExclusiveViewActive={activePlotIndex === coordinateSystem}
//               onToggleExclusiveView={() =>
//                 toggleExclusiveView(coordinateSystem)
//               }
//             />
//           </div>
//         ))}
//       </div>

//       {/* Контейнер для эксклюзивного режима */}
//       <div
//         className={`h-screen ${activePlotIndex === null ? "hidden" : "flex"}`}
//       >
//         {activePlotIndex !== null && (
//           <div className="w-full h-full">
//             <PlotPanel
//               index={activePlotIndex}
//               time={time}
//               quaternion1={quaternion1}
//               quaternion2={quaternion2}
//               coordinateSystem={activePlotIndex}
//               isOrthographicCamera={false}
//               spheraColor={spheraColor}
//               isExclusiveViewActive={true}
//               onToggleExclusiveView={() => toggleExclusiveView(null)}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

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

          // Используем FourGridPlotPanel для последнего индекса
          const PanelComponent =
            coordinateSystem === 3 ? FourGridPlotPanel : PlotPanel;

          const testData1 = {
            datasets: [
              {
                label: "Точка 1",
                data: [{ x: 10, y: 20 }],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
              {
                label: "Точка 2",
                data: [{ x: 15, y: 10 }],
                backgroundColor: "rgba(54, 162, 235, 0.5)",
              },
              {
                label: "Точка 3",
                data: [{ x: 7, y: 8 }],
                backgroundColor: "rgba(75, 192, 192, 0.5)",
              },
            ],
          };

          const testData2 = {
            datasets: [
              {
                label: "Точка 4",
                data: [{ x: 20, y: 5 }],
                backgroundColor: "rgba(153, 102, 255, 0.5)",
              },
              {
                label: "Точка 5",
                data: [{ x: 25, y: 15 }],
                backgroundColor: "rgba(255, 159, 64, 0.5)",
              },
            ],
          };

          return (
            <div key={coordinateSystem} className={panelClasses}>
              {coordinateSystem === 3 ? (
                <FourGridPlotPanel data1={testData1} data2={testData2} />
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
