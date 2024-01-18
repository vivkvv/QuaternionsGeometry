import React, { useMemo, useState } from "react";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
// import SketchExample from "./SketchPicker";

interface QuaternionPropertiesProps {
  index: number; // Добавляем пропс для индекса
  quaternion: TrigonometricalQuaternion; // Добавляем новый пропс
  setQuaternion: (newQuaternion: TrigonometricalQuaternion) => void; // Добавляем новый пропс
  time: number;
}

const QuaternionProperties: React.FC<QuaternionPropertiesProps> = ({
  index,
  quaternion, // Это текущее состояние кватерниона
  setQuaternion, // Это функция для обновления кватерниона
  time,
}) => {
  // ... состояние и обработчики ...
  const [phi0, setPhi0] = useState(quaternion.phi0); // Угол в градусах
  const [nu, setNu] = useState(quaternion.nu); // Частота ν
  const [n, setN] = useState(quaternion.n);

  const handlePhi0Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhi0 = parseFloat(event.target.value);
    const newQuaternion = {
      ...quaternion, // Копируем текущее состояние кватерниона
      phi0: newPhi0, // Обновляем значение phi0
    };
    setQuaternion(newQuaternion); // Устанавливаем новое состояние кватерниона
    setPhi0(newPhi0);
  };

  const handleNuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNu = parseFloat(event.target.value);
    const newQuaternion = {
      ...quaternion, // Копируем текущее состояние кватерниона
      nu: newNu, // Обновляем значение nu
    };
    setQuaternion(newQuaternion); // Устанавливаем новое состояние кватерниона
    setNu(newNu);
  };

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

  const trigonometricPartNumber = useMemo(() => {
    const phi0Radians = (phi0 * Math.PI) / 180;
    const angularFrequency = 2 * Math.PI * nu;
    return {
      cosValue: Math.cos(phi0Radians + angularFrequency * time),
      sinValue: Math.sin(phi0Radians + angularFrequency * time),
    };
  }, [phi0, nu, time]);

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
    const N = {
      n1: n.n1 / magnitude,
      n2: n.n2 / magnitude,
      n3: n.n3 / magnitude,
    };
    const { cosValue: cv, sinValue: sv } = trigonometricPartNumber;
    return `Q${index} = ${trigonometricPart.cosValue} + (${normalizedN.n1}i + ${
      normalizedN.n2
    }j + ${normalizedN.n3}k) * ${trigonometricPart.sinValue} = ${cv.toFixed(
      2
    )} + ${(N.n1 * sv).toFixed(2)}i + ${(N.n2 * sv).toFixed(2)}j+ ${(
      N.n3 * sv
    ).toFixed(2)}k`;
  }, [index, magnitude, n, trigonometricPart, trigonometricPartNumber, time]);

  return (
    <div className="flex flex-col bg-gray-100">
      {/* <div className="flex justify-between items-center gap-x-2">
        <div className="flex flex-col items-center w-full">
          <SketchExample
            initialColor={{
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a,
            }}
            onChange={handleColorChange}
          />
        </div>
      </div> */}

      <div className="flex justify-between items-center gap-x-2">
        <div className="flex flex-col items-center w-full">
          <label
            htmlFor={`phi0${index}`}
            className="text-sm font-medium text-gray-700"
          >
            φ₀°
          </label>
          <input
            id={`phi0${index}`}
            name={`phi0${index}`}
            type="number"
            value={phi0}
            onChange={handlePhi0Change}
            className="mt-1 p-2 border border-gray-300 w-full "
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <label
            htmlFor={`nu${index}`}
            className="text-sm font-medium text-gray-700"
          >
            ν, Hz
          </label>
          <input
            id={`nu${index}`}
            name={`nu${index}`}
            type="number"
            value={nu}
            onChange={handleNuChange}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div className="flex justify-between items-center gap-x-2 mb-4">
        <div className="flex flex-col items-center w-full">
          <label
            htmlFor={`Nx${index}`}
            className="text-sm font-medium text-gray-700"
          >
            n<sub>x</sub>
          </label>
          <input
            id={`Nx${index}`}
            name={`Nx${index}`}
            type="number"
            value={n.n1}
            onChange={handleDirectionVector("n1")}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <label
            htmlFor={`Ny${index}`}
            className="text-sm font-medium text-gray-700"
          >
            n<sub>y</sub>
          </label>
          <input
            id={`Ny${index}`}
            name={`Ny${index}`}
            type="number"
            value={n.n2}
            onChange={handleDirectionVector("n2")}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <label
            htmlFor={`Nz${index}`}
            className="text-sm font-medium text-gray-700"
          >
            n<sub>z</sub>
          </label>
          <input
            id={`Nz${index}`}
            name={`Nz${index}`}
            type="number"
            value={n.n3}
            onChange={handleDirectionVector("n3")}
            className="mt-1 p-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      <div>
        <p className="text-sm">{quaternionFormula}</p>
      </div>
    </div>
  );
};

export default QuaternionProperties;
