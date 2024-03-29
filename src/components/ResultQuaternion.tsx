import { useEffect, useState } from "react";
import { TrigonometricalQuaternion } from "../TrigonometricalQuaternion";
import LocalCoordinateSystem from "./scene/LocalCoordinateSystem";

interface ResultQuaternionProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
}

const ResultQuaternion: React.FC<ResultQuaternionProps> = ({
  time,
  quaternion1,
  quaternion2,
}) => {
  const [quaternionDescription, setQuaternionDescription] = useState("");

  useEffect(() => {
    const threeQuaternion1 =
      LocalCoordinateSystem.getThreeQuaternionFromTrigonometricalQuaternion(
        time,
        quaternion1
      );
    const threeQuaternion2 =
      LocalCoordinateSystem.getThreeQuaternionFromTrigonometricalQuaternion(
        time,
        quaternion2
      );
    const threeResultQuaternion = threeQuaternion1
      .clone()
      .multiply(threeQuaternion2.clone());

    // Форматируем описание кватерниона в строку
    const description = `Result: (w: ${threeResultQuaternion.w.toFixed(2)},
    x: ${threeResultQuaternion.x.toFixed(2)}, y: ${threeResultQuaternion.y.toFixed(2)}, z: ${threeResultQuaternion.z.toFixed(2)})`;
    setQuaternionDescription(description);
  }, [time, quaternion1, quaternion2]);

  return <div>{quaternionDescription}</div>;
};

export default ResultQuaternion;
