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
  isSetTrace: boolean;
  isSpheraVisible: boolean;
  spheraColor: any;
  isCylindersVisible: boolean;
  isGreatCirclesVisible: boolean;
}

const GlobalScene: React.FC<GlobalSceneProps> = ({
  time,
  quaternion1,
  quaternion2,
  coordinateSystem,
  isOrthographicCamera,
  isSetTrace,
  isSpheraVisible,
  spheraColor,
  isCylindersVisible,
  isGreatCirclesVisible
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef(time);
  const quaternion1Ref = useRef(quaternion1);
  const quaternion2Ref = useRef(quaternion2);
  const coordinateSystemRef = useRef(coordinateSystem);
  const isOrthographicCameraRef = useRef(isOrthographicCamera);
  const isSetTraceRef = useRef(isSetTrace);
  const isSpheraVisibleRef = useRef(isSpheraVisible);
  const spheraColorRef = useRef(spheraColor);
  const isCylindersVisibleRef = useRef(isCylindersVisible);
  const isGreatCirclesVisibleRef = useRef(isGreatCirclesVisible);

  const cameraRef = useRef(new THREE.Camera());
  const perspectiveCamera = useMemo(() => {
    const width = mountRef.current ? mountRef.current.clientWidth : window.innerWidth;
    const height = mountRef.current ? mountRef.current.clientHeight : window.innerHeight;          

    const cam = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    cam.position.set(4, 1, 1);
    cam.up.set(0, 0, 1);
    return cam;
  }, []);

  const orthographicCamera = useMemo(() => {
    const width = mountRef.current ? mountRef.current.clientWidth : window.innerWidth;
    const height = mountRef.current ? mountRef.current.clientHeight : window.innerHeight;          

    const aspect = width / height;
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
    isSetTraceRef.current = isSetTrace;
  }, [isSetTrace]);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    quaternion1Ref.current = quaternion1;
  }, [quaternion1]);

  useEffect(() => {
    quaternion2Ref.current = quaternion2;
  }, [quaternion2]);

  useEffect(() => {
    coordinateSystemRef.current = coordinateSystem;
  }, [coordinateSystem]);

  useEffect(() => {
    isOrthographicCameraRef.current = isOrthographicCamera;

    if (isOrthographicCameraRef.current) {
      cameraRef.current = orthographicCamera;
    } else {
      cameraRef.current = perspectiveCamera;
    }
    cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
  }, [isOrthographicCamera, perspectiveCamera, orthographicCamera]);

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

  const scene = useMemo(() => {
    return new THREE.Scene();
  }, []);

  const localSystem = useMemo(() => {
    return new LocalCoordinateSystem();
  }, []);

  scene.add(localSystem);
  localSystem.createOrUpdateSphera(
    spheraColorRef.current,
    isSpheraVisibleRef.current
  );

  useEffect(() => {
    isSpheraVisibleRef.current = isSpheraVisible;
    spheraColorRef.current = spheraColor;
    localSystem.createOrUpdateSphera(
      spheraColorRef.current,
      isSpheraVisibleRef.current
    );
  }, [isSpheraVisible, spheraColor, localSystem]);

  useEffect(() => {
    isCylindersVisibleRef.current = isCylindersVisible;
    localSystem.updateCylinderVisibility("4", isCylindersVisibleRef.current);
    localSystem.updateCylinderVisibility("5", isCylindersVisibleRef.current);
  }, [isCylindersVisible, localSystem]);

  useEffect(() => {
    isGreatCirclesVisibleRef.current = isGreatCirclesVisible;
    localSystem.updateCirclesVisibility(isGreatCirclesVisibleRef.current);
  }, [isGreatCirclesVisible, localSystem]);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const mount = mountRef.current;
    //const scene = new THREE.Scene();

    const handleResize = () => {
      if (!mountRef.current || !renderer) {
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
    };

    const renderer = new THREE.WebGLRenderer({
      /*alpha: true, */ antialias: true,
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    handleResize();

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

    const animate = () => {
      orthographicControl.update();
      perspectiveControl.update();

      requestAnimationFrame(animate);

      localSystem.updateSpriteScaleForLabel(cameraRef.current, "X");
      localSystem.updateSpriteScaleForLabel(cameraRef.current, "Y");
      localSystem.updateSpriteScaleForLabel(cameraRef.current, "Z");

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

      localSystem.updateCircleLines(quaternionLeft, quaternionRight);

      localSystem.updateThreeQuaternionLine(
        "3",
        quaternionResult,
        new THREE.Color("rgb(255, 0, 0)"),
        isSetTraceRef.current
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

      localSystem.updateCircleLines(quaternionLeft, quaternionRight);

      if (coordinateSystemRef.current === 0) {
        // camera.position.set(4, 1, 1);
        // camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (coordinateSystemRef.current === 1) {
        localSystem.adjustCamera(cameraRef.current, quaternionLeft);
      } else if (coordinateSystemRef.current === 2) {
        localSystem.adjustCamera(cameraRef.current, quaternionRight);
      } else if (coordinateSystemRef.current === 3) {
        localSystem.adjustCamera(cameraRef.current, quaternionResult);
      }

      renderer.render(scene, cameraRef.current);
    };

    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [orthographicCamera, perspectiveCamera, localSystem, scene]);

  return (
    <div className="w-full h-full bg-black">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default GlobalScene;
