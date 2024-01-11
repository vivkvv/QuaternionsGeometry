// TrigonometricalQuaternion.ts
export interface TrigonometricalQuaternion {
  phi0: number; // angle φ₀
  nu: number;   // frequency ν
  n: { n1: number; n2: number; n3: number }; // components
  color: any;
}
