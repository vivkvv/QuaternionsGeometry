import React, { useEffect, useState } from "react";
//import logo from './logo.svg';
import "./App.css";
import QuaternionPanel from "./components/QuaternionPanel";
import PlotPanel from "./components/PlotPanel";
import { TrigonometricalQuaternion } from "./TrigonometricalQuaternion";
import QuaternionManager from "./QuaternionManager";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// const App: React.FC = () => {
//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* <QuaternionPanel />
//       <PlotPanel /> */}
//       <QuaternionManager />
//     </div>
//   );
// };

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
      <PlotPanel
        time={time}
        quaternion1={quaternion1}
        quaternion2={quaternion2}
      />
    </div>
  );
};

export default App;
