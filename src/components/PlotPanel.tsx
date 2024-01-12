import React, { useEffect, useRef, useState } from "react";
import ControlPanel from "./ControlPanel";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import GlobalScene from "./scene/GlobalScene";

interface PlotPanelProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
  coordinateSystem: number;
  isOrthographicCamera: boolean;
}

const PlotPanel: React.FC<PlotPanelProps> = ({
  time,
  quaternion1,
  quaternion2,
  coordinateSystem,
  isOrthographicCamera,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  const [localCoordinateSystem, setLocalCoordinateSystem] =
    useState(coordinateSystem);
  const [localOrthographicCamera, setLocalOrthographicCamera] =
    useState(isOrthographicCamera);
  const [localSetTrace, setLocalSetTrace] = useState(false);

  const controlPanelRef = useRef<HTMLDivElement>(null);
  const [controlPanelHeight, setControlPanelHeight] = useState(0);

  useEffect(() => {
    if (controlPanelRef.current) {
      setControlPanelHeight(controlPanelRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden h-full">
      <div ref={controlPanelRef}>
        <ControlPanel
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          coordinateSystem={localCoordinateSystem}
          setCoordinateSystem={setLocalCoordinateSystem}
          isOrthographicCamera={localOrthographicCamera}
          setOrthographicCamera={setLocalOrthographicCamera}
          isSetTrace={localSetTrace}
          setIsSetTrace={setLocalSetTrace}
        />
      </div>
      <div style={{ height: `calc(100% - ${controlPanelHeight}px)` }}>
        <GlobalScene
          time={time}
          quaternion1={quaternion1}
          quaternion2={quaternion2}
          coordinateSystem={localCoordinateSystem}
          isOrthographicCamera={localOrthographicCamera}
          isSetTrace={localSetTrace}
        />
      </div>
    </div>
  );
};

export default PlotPanel;
