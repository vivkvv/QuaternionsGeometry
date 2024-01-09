import React, { useState } from "react";
import "./App.css";
import QuaternionPanel from "./components/QuaternionPanel";
import PlotsManager from "./components/PlotsManager";

const App = () => {
  const [time, setTime] = useState(0);
  const [quaternion1, setQuaternion1] = useState({
    phi0: 45,
    nu: 0.017,
    n: { n1: 1, n2: 2, n3: 3 },
  });
  const [quaternion2, setQuaternion2] = useState({
    phi0: 60,
    nu: 0.02,
    n: { n1: -1, n2: 1, n3: 1 },
  });
  

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <QuaternionPanel
        time={time}
        setTime={setTime}
        quaternion1={quaternion1}
        setQuaternion1={setQuaternion1}
        quaternion2={quaternion2}
        setQuaternion2={setQuaternion2}
      />
      <PlotsManager
        time={time}
        quaternion1={quaternion1}
        quaternion2={quaternion2}
      />
    </div>
  );
};

export default App;
