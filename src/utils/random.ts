/** 数学与随机工具函数 */

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function chance(p: number): boolean {
  return Math.random() < p;
}

let gaussianSpare: number | null = null;

/** 标准正态分布随机数（Box-Muller），均值为 mean，标准差为 std */
export function gaussian(mean = 0, std = 1): number {
  if (gaussianSpare !== null) {
    const v = gaussianSpare;
    gaussianSpare = null;
    return mean + v * std;
  }
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const mag = Math.sqrt(-2 * Math.log(u));
  const z0 = mag * Math.cos(2 * Math.PI * v);
  const z1 = mag * Math.sin(2 * Math.PI * v);
  gaussianSpare = z1;
  return mean + z0 * std;
}

/** 线性插值 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
