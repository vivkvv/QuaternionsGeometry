// LocalCoordinateSystem.ts
import * as THREE from "three";
// import QuaternionProperties from "../QuaternionProperties";
import { TrigonometricalQuaternion } from "../../TrigonometricalQuaternion";
// import { OperationCanceledException } from "typescript";

class LocalCoordinateSystem extends THREE.Object3D {
  constructor() {
    super();

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // цвет и интенсивность
    // directionalLight.position.set(5, 5, 5); // позиция источника света
    // this.add(directionalLight);

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
    if(normalizedDirection.z < 0) {
      normalizedDirection.x = - normalizedDirection.x;
      normalizedDirection.y = - normalizedDirection.y;            
      normalizedDirection.z = - normalizedDirection.z;
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
    const direction = new THREE.Vector3()
      .subVectors(target, origin)
      .normalize();

    const length = 5;

    let cylinder = this.getObjectByName(
      `quaternionCylinder-${id}`
    ) as THREE.Mesh;

    let ring = this.getObjectByName(`quaternionRing-${id}`) as THREE.Mesh;

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
        //true
      );
    } else {
      // Создание нового цилиндра
      const geometry = new THREE.CylinderGeometry(radius, radius, length, 16, 1, /*true*/);
      const material = new THREE.MeshBasicMaterial({
        color: color, // Цвет цилиндра
        transparent: true, // Включаем прозрачность
        opacity: opacity, // Задаем полупрозрачность
        // wireframe: true,
        side: THREE.DoubleSide
      });

      cylinder = new THREE.Mesh(geometry, material);
      cylinder.name = `quaternionCylinder-${id}`;
      this.add(cylinder);
    }

    // Настройка позиции и ориентации
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      axis,
      direction
    );
    cylinder.quaternion.copy(quaternion);
    //cylinder.setRotationFromQuaternion(quaternion);

    // Центрируем цилиндр между началом координат и целевой точкой
    cylinder.position.copy(origin).add(target).multiplyScalar(0.5);
  }

  updateThreeQuaternionLine(
    id: string,
    threeQuaternion: THREE.Quaternion,
    color: number
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
      }
    }
  }

  updateQuaternionLine(
    id: string,
    time: number,
    quaternion: TrigonometricalQuaternion,
    color: number
  ): THREE.Quaternion {
    const threeQuaternion =
      this.getThreeQuaternionFromTrigonometricalQuaternion(time, quaternion);

    this.updateThreeQuaternionLine(id, threeQuaternion, color);

    return threeQuaternion;
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
