// LocalCoordinateSystem.ts
import * as THREE from "three";
// import QuaternionProperties from "../QuaternionProperties";
import { TrigonometricalQuaternion } from "../../TrigonometricalQuaternion";

class LocalCoordinateSystem extends THREE.Object3D {
  constructor() {
    super();
    // Здесь можно добавить оси, сетку и другие элементы
    this.createAxis(new THREE.Vector3(1, 0, 0), "white", "X");
    this.createAxis(new THREE.Vector3(0, 1, 0), "white", "Y");
    this.createAxis(new THREE.Vector3(0, 0, 1), "white", "Z");

    //this.createQuaternion(time, quaternion1, "blue");
    //this.createQuaternion(time, quaternion2, "red");
  }

  updateQuaternionLine(
    id: number,
    time: number,
    quaternion: TrigonometricalQuaternion,
    color: string
  ) {
    const object = this.getObjectByName(`quaternionLine-${id}`);
    const line = object as THREE.Line;

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

    const newPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];

    if (!line) {
      const material = new THREE.LineBasicMaterial({ color: color });
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const newLine = new THREE.Line(geometry, material);
      newLine.name = `quaternionLine-${id}`;
      this.add(newLine);
    } else {
      line.geometry.setFromPoints(newPoints);
      line.geometry.attributes.position.needsUpdate = true;
    }
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
        new THREE.SphereGeometry(0.02),
        new THREE.MeshBasicMaterial({ color })
      );
      tick.position.copy(direction.clone().multiplyScalar(i));
      line.add(tick);
    }

    // Добавление лейбла
    const sprite = this.createLabel(label, color);
    sprite.position.copy(direction.clone().multiplyScalar(1.3));
    line.add(sprite);

    this.add(line);

    console.log(`Axis ${label}`, line);
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
