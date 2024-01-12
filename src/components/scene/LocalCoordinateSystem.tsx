// LocalCoordinateSystem.ts
import * as THREE from "three";
// import QuaternionProperties from "../QuaternionProperties";
import { TrigonometricalQuaternion } from "../../TrigonometricalQuaternion";
import { kdTree } from "kd-tree-javascript";
// import { OperationCanceledException } from "typescript";

const distance = (a: any, b: any) => {
  const result =
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2);

  return result;
};

class LocalCoordinateSystem extends THREE.Object3D {
  tree: any;
  constructor() {
    super();

    this.tree = new kdTree([], distance, ["x", "y", "z"]);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // цвет и интенсивность
    // directionalLight.position.set(5, 5, 5); // позиция источника света
    // this.add(directionalLight);

    this.createShere();

    // Здесь можно добавить оси, сетку и другие элементы
    this.createAxis(new THREE.Vector3(1, 0, 0), "white", "X");
    this.createAxis(new THREE.Vector3(0, 1, 0), "white", "Y");
    this.createAxis(new THREE.Vector3(0, 0, 1), "white", "Z");
  }

  adjustCamera(camera: THREE.Camera, quaternion: THREE.Quaternion) {
    const directionVector = new THREE.Vector3(
      quaternion.x,
      quaternion.y,
      quaternion.z
    );

    let normalizedDirection = directionVector.clone().normalize();
    if (normalizedDirection.z < 0) {
      normalizedDirection.x = -normalizedDirection.x;
      normalizedDirection.y = -normalizedDirection.y;
      normalizedDirection.z = -normalizedDirection.z;
    }

    if (
      normalizedDirection.x === 0 &&
      normalizedDirection.y === 0 &&
      normalizedDirection.z === 0
    ) {
      return;
    }

    const distance = camera.position.length();
    // Вычисляем позицию камеры как точку на противоположной стороне единичного шара
    const cameraPosition = normalizedDirection.multiplyScalar(-distance);
    // Устанавливаем позицию камеры
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    // Направляем взгляд камеры на начало координат
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  updateSpriteScaleForLabel(camera: THREE.Camera, label: string) {
    const sprite = this.getObjectByName(`sprite-${label}`);
    if (sprite) {
      const distance = camera.position.distanceTo(sprite.position);
      const scale = distance * 0.05; // Коэффициент масштабирования; подберите подходящее значение
      sprite.scale.set(scale, scale, 1);
    }
  }

  // distance from point to axe
  // axe is only one point, another point of axe is (0, 0, 0)
  getDistanceFromPointToAxe(
    point: THREE.Vector3,
    axePoint: THREE.Vector3
  ): number {
    const a2 = axePoint.x ** 2 + axePoint.y ** 2 + axePoint.z ** 2;
    if (a2 === 0) {
      return 0;
    }

    const d2 =
      ((axePoint.y * point.z - axePoint.z * point.y) ** 2 +
        (axePoint.x * point.z - axePoint.z * point.x) ** 2 +
        (axePoint.x * point.y - axePoint.y * point.x) ** 2) /
      a2;

    return Math.sqrt(d2);
  }

  getThreeQuaternionFromTrigonometricalQuaternion(
    time: number,
    quaternion: TrigonometricalQuaternion
  ): THREE.Quaternion {
    const phi0Radians = (quaternion.phi0 * Math.PI) / 180;
    const angularFrequency = 2 * Math.PI * quaternion.nu;
    const cos = Math.cos(phi0Radians + angularFrequency * time);
    const sin = Math.sin(phi0Radians + angularFrequency * time);
    const len = Math.sqrt(
      quaternion.n.n1 ** 2 + quaternion.n.n2 ** 2 + quaternion.n.n3 ** 2
    );

    const w = cos;

    const x = len > 0 ? (quaternion.n.n1 / len) * sin : 0;
    const y = len > 0 ? (quaternion.n.n2 / len) * sin : 0;
    const z = len > 0 ? (quaternion.n.n3 / len) * sin : 0;

    return new THREE.Quaternion(x, y, z, w);
  }

  createOrUpdateCylinder(
    id: string,
    target: THREE.Vector3,
    radius: number,
    rgbaColor: any
  ): void {
    const origin = new THREE.Vector3(0, 0, 0);

    if (target.equals(origin)) {
      return;
    }

    const direction = new THREE.Vector3()
      .subVectors(target, origin)
      .normalize();

    const length = 5;

    let cylinder = this.getObjectByName(
      `quaternionCylinder-${id}`
    ) as THREE.Mesh;

    let ring1 = this.getObjectByName(`quaternionRing1-${id}`) as THREE.Mesh;
    let ring2 = this.getObjectByName(`quaternionRing2-${id}`) as THREE.Mesh;

    const color = new THREE.Color(
      `rgb(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b})`
    );
    const opacity: number = rgbaColor.a;

    if (cylinder) {
      if (cylinder.material instanceof THREE.MeshBasicMaterial) {
        cylinder.material.color.set(color);
        cylinder.material.opacity = opacity;
      }
      cylinder.geometry.dispose();
      cylinder.geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        length,
        16,
        1,
        true
      );

      if (ring1) {
        if (ring1.material instanceof THREE.MeshBasicMaterial) {
          ring1.material.color.set(color); //"rgb(255, 255, 0)");
        }
        ring1.geometry.dispose();
        ring1.geometry = new THREE.RingGeometry(0.95 * radius, 1.05 * radius);
      }

      if (ring2) {
        if (ring2.material instanceof THREE.MeshBasicMaterial) {
          ring2.material.color.set(color); //"rgb(255, 255, 0)");
        }
        ring2.geometry.dispose();
        ring2.geometry = new THREE.RingGeometry(0.95 * radius, 1.05 * radius);
      }
    } else {
      // Создание нового цилиндра
      const cylinderGeometry = new THREE.CylinderGeometry(
        radius,
        radius,
        length,
        16,
        1,
        true
      );
      const cylinderMaterial = new THREE.MeshBasicMaterial({
        color: color, // Цвет цилиндра
        transparent: true, // Включаем прозрачность
        opacity: opacity, // Задаем полупрозрачность
        // wireframe: true,
        side: THREE.DoubleSide,
      });

      cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      cylinder.name = `quaternionCylinder-${id}`;
      this.add(cylinder);

      // Создаем также кольцо посеpедине цилиндра
      const ringGeometry = new THREE.RingGeometry(0.95 * radius, 1.05 * radius);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color), //"rgb(255, 255, 0)"), //color, // Цвет цилиндра
        transparent: false, // Включаем прозрачность
        //opacity: opacity, // Задаем полупрозрачность
        // wireframe: true,
        side: THREE.DoubleSide,
      });

      ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
      ring1.name = `quaternionRing1-${id}`;
      this.add(ring1);

      ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
      ring2.name = `quaternionRing2-${id}`;
      this.add(ring2);
    }

    // Настройка позиции и ориентации
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      axis,
      direction
    );
    cylinder.quaternion.copy(quaternion);

    // Центрируем цилиндр между началом координат и целевой точкой
    cylinder.position.copy(origin).add(target).multiplyScalar(0.5);

    // the same for the ring
    const additionalRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      Math.PI / 2
    );
    const ringQuaternion = new THREE.Quaternion().multiplyQuaternions(
      quaternion,
      additionalRotation
    );
    ring1.quaternion.copy(ringQuaternion);
    //ring.position.copy(cylinder.position);
    const endPosition = new THREE.Vector3()
      .copy(direction)
      .multiplyScalar(length / 2) // Смещение на половину длины цилиндра
      .add(cylinder.position);
    ring1.position.copy(endPosition);

    ring2.quaternion.copy(ringQuaternion);
    const beginPosition = new THREE.Vector3()
      .copy(direction)
      .multiplyScalar(-length / 2) // Смещение на половину длины цилиндра
      .add(cylinder.position);
    ring2.position.copy(beginPosition);
  }

  updateThreeQuaternionLine(
    id: string,
    threeQuaternion: THREE.Quaternion,
    color: THREE.Color,
    markPosition: boolean = false
  ) {
    const object = this.getObjectByName(`quaternionLine-${id}`);
    const line = object as THREE.Line;

    const newPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(
        threeQuaternion.x,
        threeQuaternion.y,
        threeQuaternion.z
      ),
    ];

    const ray = new THREE.Ray(
      newPoints[0],
      new THREE.Vector3().subVectors(newPoints[1], newPoints[0]).normalize()
    );
    const length = 2;
    const farPoint1 = ray.at(-length, new THREE.Vector3());
    const farPoint2 = ray.at(length, new THREE.Vector3());
    const points = [farPoint1, farPoint2];

    if (!line) {
      // const dashedMaterial = new THREE.LineDashedMaterial({
      //   color: color,
      //   //transparent: true,
      //   opacity: 1.0,
      //   //dashSize: 0.1,
      //   //gapSize: 0.1,
      // });
      const material = new THREE.LineBasicMaterial({ color });

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const dashedLine = new THREE.Line(geometry, material /*dashedMaterial*/);
      dashedLine.computeLineDistances();
      dashedLine.name = `quaternionLine-${id}`;
      this.add(dashedLine);

      // Создаем сферу
      const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.name = `quaternionSphere-${id}`;
      sphere.position.set(
        threeQuaternion.x,
        threeQuaternion.y,
        threeQuaternion.z
      ); // Устанавливаем позицию сферы на конец линии
      this.add(sphere);
    } else {
      line.geometry.setFromPoints(points);
      if (line.material instanceof THREE.LineBasicMaterial) {
        line.material.color.set(color);
      }
      line.geometry.attributes.position.needsUpdate = true;

      // Находим и обновляем сферу
      const sphere = this.getObjectByName(
        `quaternionSphere-${id}`
      ) as THREE.Mesh;
      if (sphere) {
        sphere.position.set(
          threeQuaternion.x,
          threeQuaternion.y,
          threeQuaternion.z
        ); // Обновляем позицию сферы

        if (sphere.material instanceof THREE.MeshBasicMaterial) {
          sphere.material.color.set(color);
        }
      }
    }

    if (markPosition) {
      const nearstPoint = this.tree.nearest(
        { x: threeQuaternion.x, y: threeQuaternion.y, z: threeQuaternion.z },
        1,
        0.001
      );

      if (nearstPoint.length === 0) {
        this.tree.insert({
          x: threeQuaternion.x,
          y: threeQuaternion.y,
          z: threeQuaternion.z,
        });

        const sphereGeometry = new THREE.SphereGeometry(0.02, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: "white" });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.name = `mark`;
        sphere.position.set(
          threeQuaternion.x,
          threeQuaternion.y,
          threeQuaternion.z
        );
        this.add(sphere);
      }
    }
  }

  updateQuaternionLine(
    id: string,
    time: number,
    quaternion: TrigonometricalQuaternion,
    rgbaColor: any
  ): THREE.Quaternion {
    const threeQuaternion =
      this.getThreeQuaternionFromTrigonometricalQuaternion(time, quaternion);

    const color = new THREE.Color(
      `rgb(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b})`
    );
    this.updateThreeQuaternionLine(id, threeQuaternion, color);

    return threeQuaternion;
  }

  createShere() {
    // const sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(1),
    //   new THREE.MeshBasicMaterial({
    //     color: "white",
    //     opacity: 0.01,
    //     transparent: true,
    //     side: THREE.DoubleSide
    //   })
    // );
    // this.add(sphere);
  }

  createAxis(direction: THREE.Vector3, color: string, label: string): void {
    // Создание линии оси
    const material = new THREE.LineBasicMaterial({ color });
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(direction.clone().multiplyScalar(1.2));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    // Добавление засечек
    for (let i = 0.1; i <= 1; i += 0.1) {
      const tick = new THREE.Mesh(
        new THREE.SphereGeometry(0.01),
        new THREE.MeshBasicMaterial({ color })
      );
      tick.position.copy(direction.clone().multiplyScalar(i));
      line.add(tick);
    }

    // Добавление лейбла
    const sprite = this.createLabel(label, color);
    sprite.name = `sprite-${label}`;
    sprite.position.copy(direction.clone().multiplyScalar(1.3));
    line.add(sprite);

    this.add(line);

    // console.log(`Axis ${label}`, line);
  }

  createLabel(text: string, color: string) {
    const canvas = document.createElement("canvas");
    const size = 64; // Размер канваса для лейбла
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = color; // Цвет текста
      context.textAlign = "center";
      context.font = "48px Arial";
      context.fillText(text, size / 2, size / 2 + 15);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.5, 0.5, 1); // Размер спрайта

    return sprite;
  }
}

export default LocalCoordinateSystem;
