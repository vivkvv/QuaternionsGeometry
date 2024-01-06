// TrigonometricalQuaternion.ts
export interface TrigonometricalQuaternion {
    phi0: number; // Угол φ₀ в градусах
    nu: number;   // Частота ν
    n: { n1: number; n2: number; n3: number }; // Компоненты вектора
  }
  