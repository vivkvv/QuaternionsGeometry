import React, { useMemo, useState } from "react";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";

interface QuaternionPropertiesProps {
  index: number; // Добавляем пропс для индекса
  quaternion: TrigonometricalQuaternion; // Добавляем новый пропс
  setQuaternion: (newQuaternion: TrigonometricalQuaternion) => void; // Добавляем новый пропс
}

const QuaternionProperties: React.FC<QuaternionPropertiesProps> = ({
  index,
  quaternion, // Это текущее состояние кватерниона
  setQuaternion, // Это функция для обновления кватерниона
}) => {
  // ... состояние и обработчики ...
  const [phi0, setPhi0] = useState(0); // Угол в градусах
  const [nu, setNu] = useState(0); // Частота ν
  const [n, setN] = useState({ n1: 0, n2: 0, n3: 0 });

  // const handlePhi0Change = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPhi0(parseFloat(event.target.value));
  // };

  // const handlePhi0Change = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newPhi0 = parseFloat(event.target.value);
  //   setQuaternion((prevQuaternion) => ({
  //     ...prevQuaternion,
  //     phi0: newPhi0,
  //   }));
  // };

  const handlePhi0Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhi0 = parseFloat(event.target.value);
    const newQuaternion = {
      ...quaternion, // Копируем текущее состояние кватерниона
      phi0: newPhi0, // Обновляем значение phi0
    };
    setQuaternion(newQuaternion); // Устанавливаем новое состояние кватерниона
    setPhi0(newPhi0);
  };

  // const handleNuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNu(parseFloat(event.target.value));
  // };

  const handleNuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNu = parseFloat(event.target.value);
    const newQuaternion = {
      ...quaternion, // Копируем текущее состояние кватерниона
      nu: newNu, // Обновляем значение nu
    };
    setQuaternion(newQuaternion); // Устанавливаем новое состояние кватерниона
    setNu(newNu);
  };

  // const handleDirectionVector =
  //   (component: "n1" | "n2" | "n3") =>
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setN((prevN) => ({
  //       ...prevN,
  //       [component]: parseFloat(event.target.value),
  //     }));
  //   };

  const handleDirectionVector =
    (component: "n1" | "n2" | "n3") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value);
      const newQuaternion = {
        ...quaternion, // Копируем текущее состояние кватерниона
        n: {
          ...quaternion.n, // Копируем текущее состояние вектора n
          [component]: newValue, // Обновляем соответствующую компоненту вектора n
        },
      };
      setQuaternion(newQuaternion); // Устанавливаем новое состояние кватерниона
     setN((prevN) => ({
        ...prevN,
        [component]: newValue,
      }));      
    };

  const magnitude = useMemo(() => {
    return Math.sqrt(n.n1 ** 2 + n.n2 ** 2 + n.n3 ** 2);
  }, [n]);

  const trigonometricPart = useMemo(() => {
    const phi0Radians = (phi0 * Math.PI) / 180;
    if (nu === 0) {
      const cosValue = Math.cos(phi0Radians).toFixed(2);
      const sinValue = Math.sin(phi0Radians).toFixed(2);
      return { cosValue, sinValue };
    }
    const angularFrequency = (2 * Math.PI * nu).toFixed(2);
    return {
      cosValue: `cos(${phi0Radians.toFixed(2)} + ${angularFrequency} * t)`,
      sinValue: `sin(${phi0Radians.toFixed(2)} + ${angularFrequency} * t)`,
    };
  }, [phi0, nu]);

  const quaternionFormula = useMemo(() => {
    if (magnitude === 0) {
      return (
        <span>
          Q{index} = {trigonometricPart.cosValue} + (0i + 0j + 0k) *{" "}
          {trigonometricPart.sinValue} /{" "}
          <span className="text-red-600">|n|</span>
        </span>
      );
    }
    const normalizedN = {
      n1: (n.n1 / magnitude).toFixed(2),
      n2: (n.n2 / magnitude).toFixed(2),
      n3: (n.n3 / magnitude).toFixed(2),
    };
    return `Q${index} = ${trigonometricPart.cosValue} + (${normalizedN.n1}i + ${normalizedN.n2}j + ${normalizedN.n3}k) * ${trigonometricPart.sinValue}`;
  }, [index, magnitude, n, trigonometricPart]);

  return (
    <div className="flex flex-col p-4 bg-gray-100">
      <div className="flex justify-between items-center gap-x-2 mb-4">
        <div className="flex flex-col items-center w-full">
          <label className="text-sm font-medium text-gray-700">φ₀°</label>
          <input
            type="number"
            value={phi0}
            onChange={handlePhi0Change}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <label className="text-sm font-medium text-gray-700">ν, Hz</label>
          <input
            type="number"
            value={nu}
            onChange={handleNuChange}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div className="flex justify-between items-center gap-x-2 mb-4">
        <div className="flex flex-col items-center w-full">
          <label className="text-sm font-medium text-gray-700">
            n<sub>x</sub>
          </label>
          <input
            type="number"
            value={n.n1}
            onChange={handleDirectionVector("n1")}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <label className="text-sm font-medium text-gray-700">
            n<sub>y</sub>
          </label>
          <input
            type="number"
            value={n.n2}
            onChange={handleDirectionVector("n2")}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <label className="text-sm font-medium text-gray-700">
            n<sub>z</sub>
          </label>
          <input
            type="number"
            value={n.n3}
            onChange={handleDirectionVector("n3")}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div>
        <p className="text-sm">
          {quaternionFormula}
          {/* Q{index} = cos(φ₀ + ω * t) + (n<sub>x</sub> * i + n<sub>y</sub> * j +
          n<sub>z</sub> * k) * sin(φ₀ + ω * t) / |n| */}
        </p>
      </div>
    </div>
  );
};

export default QuaternionProperties;
