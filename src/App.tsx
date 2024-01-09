import React, { useEffect, useState } from "react";
//import logo from './logo.svg';
import "./App.css";
import QuaternionPanel from "./components/QuaternionPanel";
// import PlotPanel from "./components/PlotPanel";
import PlotsManager from "./components/PlotsManager";

const App = () => {
  const [time, setTime] = useState(0);
  const [quaternion1, setQuaternion1] = useState({
    phi0: 0,
    nu: 0,
    n: { n1: 0, n2: 0, n3: 0 },
  });
  const [quaternion2, setQuaternion2] = useState({
    phi0: 0,
    nu: 0,
    n: { n1: 0, n2: 0, n3: 0 },
  });
  //const [coordinateSystem, setCoordinateSystem] = useState(0);
  //const [isOrthographicCamera, setOrthographicCamera] = useState(false);

  // Логирование при изменении time
  useEffect(() => {
    console.log("Time updated:", time);
  }, [time]);

  // Логирование при изменении quaternion1
  useEffect(() => {
    console.log("Quaternion1 updated:", quaternion1);
  }, [quaternion1]);

  // Логирование при изменении quaternion2
  useEffect(() => {
    console.log("Quaternion2 updated:", quaternion2);
  }, [quaternion2]);

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
        //coordinateSystem={coordinateSystem}
        //setCoordinateSystem={setCoordinateSystem}
        //isOrthographicCamera={isOrthographicCamera}
        //setOrthographicCamera={setOrthographicCamera}
      />
    </div>
  );
};

export default App;
