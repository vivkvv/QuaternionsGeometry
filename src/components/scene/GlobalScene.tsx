import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import LocalCoordinateSystem from "./LocalCoordinateSystem";
import { TrigonometricalQuaternion } from "../../TrigonometricalQuaternion";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
  }, [time, quaternion1, quaternion2, coordinateSystem, isOrthographicCamera]);

  function getDefaultOrthographicCameraParams(width: number, height: number) {
    const aspectRatio = width / height;
    const frustumSize = 5;

    return {
      left: (-frustumSize * aspectRatio) / 2,
      right: (frustumSize * aspectRatio) / 2,
      top: frustumSize / 2,
      bottom: -frustumSize / 2,
      near: 0.1,
      far: 100,
    };
  }

  const perspectiveCamera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cam.position.set(4, 1, 1);
    cam.up.set(0, 0, 1);
    return cam;
  }, []);

  const orthographicCamera = useMemo(() => {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 5;

    const cam = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    cam.position.set(2, 1, 1);
    cam.up.set(0, 0, 1);
    return cam;
  }, []);

  useEffect(() => {
    if (!mountRef.current){
      return;
    }

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const mount = mountRef.current;
    const scene = new THREE.Scene();

    let camera = new THREE.Camera();

    const updateCamera = () => {
      if (isOrthographicCameraRef.current) {
        camera = orthographicCamera;
      } else {
        camera = perspectiveCamera;
      }
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    };

    updateCamera();

    const handleResize = () => {
      if (!mountRef.current) {
        return;
      }

      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      renderer.setSize(newWidth, newHeight);

      perspectiveCamera.aspect = newWidth / newHeight;
      perspectiveCamera.updateProjectionMatrix();

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

    const orthographicControl = new OrbitControls(
      orthographicCamera,
      renderer.domElement
    );
    orthographicControl.enablePan = false;

    const perspectiveControl = new OrbitControls(
      perspectiveCamera,
      renderer.domElement
    );
    perspectiveControl.enablePan = false;

    mount.appendChild(renderer.domElement);

    const localSystem = new LocalCoordinateSystem();
    scene.add(localSystem);

    const animate = () => {
      updateCamera();

      orthographicControl.update();
      perspectiveControl.update();

      requestAnimationFrame(animate);

      localSystem.updateSpriteScaleForLabel(camera, "X");
      localSystem.updateSpriteScaleForLabel(camera, "Y");
      localSystem.updateSpriteScaleForLabel(camera, "Z");

      const quaternionLeft = localSystem.updateQuaternionLine(
        "1",
        timeRef.current,
        quaternion1Ref.current,
        quaternion1Ref.current.color
      );

      const quaternionRight = localSystem.updateQuaternionLine(
        "2",
        timeRef.current,
        quaternion2Ref.current,
        quaternion2Ref.current.color
      );

      const quaternionResult = new THREE.Quaternion().multiplyQuaternions(
        quaternionLeft,
        quaternionRight
      );

      localSystem.updateThreeQuaternionLine(
        "3",
        quaternionResult,
        new THREE.Color("rgb(255, 0, 0)")
      );

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
        quaternion2Ref.current.color
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
        quaternion1Ref.current.color
      );

      if (coordinateSystemRef.current === 0) {
        // camera.position.set(4, 1, 1);
        // camera.lookAt(new THREE.Vector3(0, 0, 0));
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
  }, [orthographicCamera, perspectiveCamera]);

  return (
    <div className="w-full h-full bg-black">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default GlobalScene;
