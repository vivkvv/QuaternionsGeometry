import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import LocalCoordinateSystem from "./LocalCoordinateSystem";
import { TrigonometricalQuaternion } from "../../TrigonometricalQuaternion";

interface GlobalSceneProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
}

const GlobalScene: React.FC<GlobalSceneProps> = ({
  time,
  quaternion1,
  quaternion2,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef(time);
  const quaternion1Ref = useRef(quaternion1);
  const quaternion2Ref = useRef(quaternion2);

  useEffect(() => {
    timeRef.current = time;
    quaternion1Ref.current = quaternion1;
    quaternion2Ref.current = quaternion2;
  }, [time, quaternion1, quaternion2]); // Обновляем ссылки при изменении пропсов

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(2, 1, 1);
    camera.up.set(0, 0, 2);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const localSystem = new LocalCoordinateSystem();
    scene.add(localSystem);

    const animate = () => {
      requestAnimationFrame(animate);

      localSystem.updateQuaternionLine(
        1,
        timeRef.current,
        quaternion1Ref.current,
        "blue"
      );
      localSystem.updateQuaternionLine(
        2,
        timeRef.current,
        quaternion2Ref.current,
        "red"
      );

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
      camera.updateProjectionMatrix();
    });

    return () => {
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default GlobalScene;
