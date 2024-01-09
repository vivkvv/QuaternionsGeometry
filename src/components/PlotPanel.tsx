import React, { useState } from "react";
import ControlPanel from "./ControlPanel";
//import QuaternionsPlot from "./QuaternionsPlot";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import GlobalScene from "./scene/GlobalScene";

interface PlotPanelProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
  coordinateSystem: number;
  isOrthographicCamera: boolean;
  perspectiveCamera: THREE.PerspectiveCamera;
  orthographicCamera: THREE.OrthographicCamera;
}

const PlotPanel: React.FC<PlotPanelProps> = ({
  time,
  quaternion1,
  quaternion2,
  coordinateSystem,
  isOrthographicCamera,
  perspectiveCamera,
  orthographicCamera,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  const [localCoordinateSystem, setLocalCoordinateSystem] =
    useState(coordinateSystem);
  const [localOrthographicCamera, setLocalOrthographicCamera] =
    useState(isOrthographicCamera);

  return (
    <div className="border-2 border-gray-200 shadow rounded-lg overflow-hidden m-2">
      <ControlPanel
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        coordinateSystem={localCoordinateSystem}
        setCoordinateSystem={setLocalCoordinateSystem}
        isOrthographicCamera={localOrthographicCamera}
        setOrthographicCamera={setLocalOrthographicCamera}
      />
      <div>
        <GlobalScene
          time={time}
          quaternion1={quaternion1}
          quaternion2={quaternion2}
          coordinateSystem={localCoordinateSystem}
          isOrthographicCamera={localOrthographicCamera}
          perspectiveCamera={perspectiveCamera}
          orthographicCamera={orthographicCamera}
        />
      </div>
    </div>
  );
};

export default PlotPanel;
