import React, { useState } from "react";
import "./App.css";
import CommonPanel from "./components/CommonPanel";
import PlotsManager from "./components/PlotsManager";
import { TrigonometricalQuaternion } from "./TrigonometricalQuaternion";

const App = () => {
  const [time, setTime] = useState(0);
  const [quaternion1, setQuaternion1] = useState<TrigonometricalQuaternion>({
    phi0: 45,
    nu: 0.017,
    n: { n1: 1, n2: 2, n3: 3 },
    color: { r: 7, g: 255, b: 0, a: 0.25 },
  });
  const [quaternion2, setQuaternion2] = useState<TrigonometricalQuaternion>({
    phi0: 60,
    nu: 0.02,
    n: { n1: -1, n2: 1, n3: 1 },
    color: { r: 0, g: 0, b: 255, a: 0.25 },
  });

  const [spheraColor, setSpheraColor] = useState<any>({
    color: { r: 128, g: 0, b: 0, a: 0.25 },
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <CommonPanel
        time={time}
        setTime={setTime}
        quaternion1={quaternion1}
        setQuaternion1={setQuaternion1}
        quaternion2={quaternion2}
        setQuaternion2={setQuaternion2}
        spheraColor={spheraColor}
        setSpheraColor={setSpheraColor}
      />
      <PlotsManager
        time={time}
        quaternion1={quaternion1}
        quaternion2={quaternion2}
        spheraColor={spheraColor}
      />
    </div>
  );
};

export default App;
