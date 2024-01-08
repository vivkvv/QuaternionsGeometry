import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import LocalCoordinateSystem from "./LocalCoordinateSystem";
import { TrigonometricalQuaternion } from "../../TrigonometricalQuaternion";

interface GlobalSceneProps {
  time: number;
  quaternion1: TrigonometricalQuaternion;
  quaternion2: TrigonometricalQuaternion;
  coordinateSystem: number;
  isOrthographicCamera: boolean;
}

const GlobalScene: React.FC<GlobalSceneProps> = ({
  time,
  quaternion1,
  quaternion2,
  coordinateSystem,
  isOrthographicCamera,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef(time);
  const quaternion1Ref = useRef(quaternion1);
  const quaternion2Ref = useRef(quaternion2);
  const coordinateSystemRef = useRef(coordinateSystem);
  const isOrthographicCameraRef = useRef(isOrthographicCamera);

  useEffect(() => {
    timeRef.current = time;
    quaternion1Ref.current = quaternion1;
    quaternion2Ref.current = quaternion2;
    coordinateSystemRef.current = coordinateSystem;
    isOrthographicCameraRef.current = isOrthographicCamera;
  }, [time, quaternion1, quaternion2, coordinateSystem, isOrthographicCamera]); // Обновляем ссылки при изменении пропсов

  function getDefaultOrthographicCameraParams(width: number, height: number) {
    const aspectRatio = width / height;
    const frustumSize = 5; // Это значение можно регулировать для управления "зумом"

    return {
      left: (-frustumSize * aspectRatio) / 2,
      right: (frustumSize * aspectRatio) / 2,
      top: frustumSize / 2,
      bottom: -frustumSize / 2,
      near: 0.1,
      far: 100,
    };
  }

  useEffect(() => {
    if (!mountRef.current) return;

    const initializeCameras = (width: number, height: number) =>  {
      const perspectiveCamera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        1000
      );
      perspectiveCamera.up.set(0, 0, 2);
      perspectiveCamera.position.set(4, 1, 1);
      perspectiveCamera.lookAt(new THREE.Vector3(0, 0, 0));
  
      const orthoParams = getDefaultOrthographicCameraParams(width, height);
      const orthographicCamera = new THREE.OrthographicCamera(
        orthoParams.left,
        orthoParams.right,
        orthoParams.top,
        orthoParams.bottom,
        orthoParams.near,
        orthoParams.far
      );
      orthographicCamera.up.set(0, 0, 2);
      orthographicCamera.position.set(4, 1, 1);
      orthographicCamera.lookAt(new THREE.Vector3(0, 0, 0));
  
      return { perspectiveCamera, orthographicCamera };
    }  

    const width = window.innerWidth;
    const height = window.innerHeight;
    let { perspectiveCamera, orthographicCamera } = initializeCameras(
      width,
      height
    );

    const mount = mountRef.current;
    const scene = new THREE.Scene();

    let camera: THREE.Camera;

    // Функция для обновления камеры
    const updateCamera = () => {
      if (isOrthographicCameraRef.current) {
        camera = orthographicCamera;
      } else {
        camera = perspectiveCamera;
      }
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      //renderer.render(scene, camera);
    };

    // Вызовите функцию обновления камеры, чтобы установить начальное состояние
    updateCamera();

    // Функция для обработки изменения размера окна
    const handleResize = () => {
      //renderer.setSize(width, height);
      //camera.updateProjectionMatrix();

      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      renderer.setSize(newWidth, newHeight);

      // Обновление перспективной камеры
      perspectiveCamera.aspect = newWidth / newHeight;
      perspectiveCamera.updateProjectionMatrix();

      // Обновление параметров ортогональной камеры при изменении размера окна
      const orthoParams = getDefaultOrthographicCameraParams(
        newWidth,
        newHeight
      );
      orthographicCamera.left = orthoParams.left;
      orthographicCamera.right = orthoParams.right;
      orthographicCamera.top = orthoParams.top;
      orthographicCamera.bottom = orthoParams.bottom;
      orthographicCamera.updateProjectionMatrix();

      updateCamera();
    };

    const renderer = new THREE.WebGLRenderer({
      /*alpha: true, */ antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const localSystem = new LocalCoordinateSystem();
    scene.add(localSystem);

    const animate = () => {
      updateCamera();

      requestAnimationFrame(animate);

      localSystem.updateSpriteScaleForLabel(camera, "X");
      localSystem.updateSpriteScaleForLabel(camera, "Y");
      localSystem.updateSpriteScaleForLabel(camera, "Z");

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
        0.5
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
        new THREE.Vector3(quaternionLeft.x, quaternionLeft.y, quaternionLeft.z),
        r2Axe1,
        0xff0000,
        0.5
      );

      if (coordinateSystemRef.current === 0) {
        camera.position.set(4, 1, 1);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (coordinateSystemRef.current === 1) {
        localSystem.adjustCamera(camera, quaternionLeft);
      } else if (coordinateSystemRef.current === 2) {
        localSystem.adjustCamera(camera, quaternionRight);
      } else if (coordinateSystemRef.current === 3) {
        localSystem.adjustCamera(camera, quaternionResult);
      }

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
};

export default GlobalScene;
