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
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(4, 1, 1);
    camera.up.set(0, 0, 2);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const localSystem = new LocalCoordinateSystem();
    scene.add(localSystem);

    const animate = () => {
      requestAnimationFrame(animate);

      localSystem.updateSpriteScaleForLabel(camera, 'X');
      localSystem.updateSpriteScaleForLabel(camera, 'Y');
      localSystem.updateSpriteScaleForLabel(camera, 'Z');

      const quaternionLeft = localSystem.updateQuaternionLine(
        "1",
        timeRef.current,
        quaternion1Ref.current,
        0xff0000
      );

      const quaternionRight = localSystem.updateQuaternionLine(
        "2",
        timeRef.current,
        quaternion2Ref.current,
        0x0000ff
      );

      const quaternionResult = new THREE.Quaternion().multiplyQuaternions(
        quaternionLeft,
        quaternionRight
      );

      localSystem.updateThreeQuaternionLine("3", quaternionResult, 0x00ff00);

      // расстояние от точки первого кватерниона до оси второго
      const r1Axe2 = localSystem.getDistanceFromPointToAxe(
        new THREE.Vector3(quaternionLeft.x, quaternionLeft.y, quaternionLeft.z),
        new THREE.Vector3(
          quaternionRight.x,
          quaternionRight.y,
          quaternionRight.z
        )
      );
      localSystem.createOrUpdateCylinder(
        "4",
        new THREE.Vector3(
          quaternionRight.x,
          quaternionRight.y,
          quaternionRight.z
        ),
        r1Axe2,
        0x0000ff,
        0.1
      );

      // расстояние от точки второго кватерниона до оси первого
      const r2Axe1 = localSystem.getDistanceFromPointToAxe(
        new THREE.Vector3(
          quaternionRight.x,
          quaternionRight.y,
          quaternionRight.z
        ),
        new THREE.Vector3(quaternionLeft.x, quaternionLeft.y, quaternionLeft.z)
      );
      localSystem.createOrUpdateCylinder(
        "5",
        new THREE.Vector3(
          quaternionLeft.x,
          quaternionLeft.y,
          quaternionLeft.z
        ),
        r2Axe1,
        0xff0000,
        0.1
      );      

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
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
