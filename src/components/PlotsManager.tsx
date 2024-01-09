// PlotsManager.tsx
import React, { useEffect, useState } from "react";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import * as THREE from "three";
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
  const [perspectiveCamera, setPerspectiveCamera] =
    useState<THREE.PerspectiveCamera>();
  const [orthographicCamera, setOrthographicCamera] =
    useState<THREE.OrthographicCamera>();

  useEffect(() => {
    // Создаем камеры здесь и сохраняем их в состоянии
    const perspCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    perspCamera.position.set(4, 1, 1);

    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 5;
    const orthoCamera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    orthoCamera.position.set(4, 1, 1);

    setPerspectiveCamera(perspCamera);
    setOrthographicCamera(orthoCamera);
  }, []);

  return (
    //<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", height: "100vh", width: "100vw" }}>
    <div className="flex flex-wrap h-screen">
    {/* <div className="grid grid-cols-2 grid-rows-2 gap-4"> */}
      {/* Создаем четыре PlotPanel с разными системами координат и камерами */}
      {[0, 1, 2, 3].map((coordinateSystem) => (
        <div key={coordinateSystem} className="p-1 w-1/2 h-1/2">
          {perspectiveCamera && orthographicCamera && (
            <PlotPanel
              time={time}
              quaternion1={quaternion1}
              quaternion2={quaternion2}
              coordinateSystem={coordinateSystem}
              isOrthographicCamera={false}
              perspectiveCamera={perspectiveCamera}
              orthographicCamera={orthographicCamera}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PlotsManager;
