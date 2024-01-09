// QuaternionManager.js
import React, { useState } from "react";
import { TrigonometricalQuaternion } from "./TrigonometricalQuaternion";
import QuaternionPanel from "./components/QuaternionPanel";
//import QuaternionsPlot from "./components/QuaternionsPlot";
/*
const QuaternionManager: React.FC = () => {
  const [time, setTime] = useState(0);
  const [quaternion1, setQuaternion1] = useState<TrigonometricalQuaternion>({
    phi0: 0,
    nu: 0,
    n: { n1: 0, n2: 0, n3: 0 },
  });
  const [quaternion2, setQuaternion2] = useState<TrigonometricalQuaternion>({
    phi0: 0,
    nu: 0,
    n: { n1: 0, n2: 0, n3: 0 },
  });

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <QuaternionPanel
        time={time}
        setTime={setTime}
        quaternion1={quaternion1}
        setQuaternion1={setQuaternion1}
        quaternion2={quaternion2}
        setQuaternion2={setQuaternion2}
        coordinateSystem={coordinateSystem}
        setCoordinateSystem={setCoordinateSystem}
      />
      <QuaternionsPlot time={time} quaternion1={quaternion1} quaternion2={quaternion2} coordinateSystem={setCoordinateSystem} />
    </div>
  );
};

export default QuaternionManager;
*/