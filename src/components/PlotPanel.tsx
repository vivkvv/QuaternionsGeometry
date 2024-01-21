import React, { useEffect, useRef, useState } from "react";
import ControlPanel from "./ControlPanel";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import GlobalScene from "./scene/GlobalScene";

interface PlotPanelProps {
  index: number;
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
  coordinateSystem: number;
  isOrthographicCamera: boolean;

  spheraColor: any;
  // isExclusiveViewActive: boolean;
  onToggleExclusiveView: () => void;
}

const PlotPanel: React.FC<PlotPanelProps> = ({
  index,
  time,
  quaternion1,
  quaternion2,
  coordinateSystem,
  isOrthographicCamera,

  spheraColor,

  // isExclusiveViewActive,
  onToggleExclusiveView,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  const [localCoordinateSystem, setLocalCoordinateSystem] =
    useState(coordinateSystem);
  const [localOrthographicCamera, setLocalOrthographicCamera] =
    useState(isOrthographicCamera);
  const [localSetTrace, setLocalSetTrace] = useState(false);

  const [localIsSpheraVisible, localSetIsSpheraVisible] = useState(false);

  const controlPanelRef = useRef<HTMLDivElement>(null);
  const [controlPanelHeight, setControlPanelHeight] = useState(0);

  const [localIsCylinders, localSetCylinders] = useState(false);
  const [localIsGreatCircles, localSetGreatCircles] = useState(false);

  const [localIsQuaternion1Visible, localSetQuaternion1Visible] =
    useState(true);
  const [localIsQuaternion2Visible, localSetQuaternion2Visible] =
    useState(true);
  const [localIsResultQuaternionVisible, localSetResultQuaternionVisible] =
    useState(true);

  const [clearTraces, setClearTraces] = useState(false);

  useEffect(() => {
    if (controlPanelRef.current) {
      setControlPanelHeight(controlPanelRef.current.offsetHeight);
    }
  }, []);

  const handleClearTraces = () => {
    setClearTraces(!clearTraces);
  };  

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden h-full">
      <div ref={controlPanelRef}>
        <ControlPanel
          index={index}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          coordinateSystem={localCoordinateSystem}
          setCoordinateSystem={setLocalCoordinateSystem}
          isOrthographicCamera={localOrthographicCamera}
          setOrthographicCamera={setLocalOrthographicCamera}
          isSetTrace={localSetTrace}
          setIsSetTrace={setLocalSetTrace}
          isSpheraVisible={localIsSpheraVisible}
          setIsSpheraVisible={localSetIsSpheraVisible}
          isCylinders={localIsCylinders}
          setIsCylinders={localSetCylinders}
          isGreatCircles={localIsGreatCircles}
          setIsGreatCircles={localSetGreatCircles}
          isQuaternion1Visible={localIsQuaternion1Visible}
          setIsQuaternion1Visible={localSetQuaternion1Visible}
          isQuaternion2Visible={localIsQuaternion2Visible}
          setIsQuaternion2Visible={localSetQuaternion2Visible}
          isResultQuaternionVisible={localIsResultQuaternionVisible}
          setIsResultQuaternionVisible={localSetResultQuaternionVisible}
          // isExclusiveViewActive={isExclusiveViewActive}
          onToggleExclusiveView={onToggleExclusiveView}
          onClearTraces={handleClearTraces}
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
          isSpheraVisible={localIsSpheraVisible}
          spheraColor={spheraColor}
          isCylindersVisible={localIsCylinders}
          isGreatCirclesVisible={localIsGreatCircles}
          isQuaternion1Visible={localIsQuaternion1Visible}
          isQuaternion2Visible={localIsQuaternion2Visible}
          isResultQuaternionVisible={localIsResultQuaternionVisible}
          clearTraces={clearTraces}
        />
      </div>
    </div>
  );
};

export default PlotPanel;
