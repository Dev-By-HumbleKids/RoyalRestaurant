import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { RestaurantTable } from '@/types';

/** Height of every table surface, in metres. */
export const TOP = 0.8;

const _q = new THREE.Quaternion();
const _e = new THREE.Euler();

/** Matrix from position, rotation (yaw applied last) and scale. */
export function m4(x: number, y: number, z: number, ry = 0, s: number | [number, number, number] = 1, rx = 0, rz = 0) {
  const scale = typeof s === 'number' ? new THREE.Vector3(s, s, s) : new THREE.Vector3(...s);
  return new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz, 'YXZ')), scale);
}

export type Item = { m: THREE.Matrix4; c?: THREE.Color };

const box = (w: number, h: number, d: number, x = 0, y = 0, z = 0) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);
const lathe = (pts: [number, number][], seg: number) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);

/** Shared geometries, built once when the 3D chunk first renders. */
let cache: ReturnType<typeof build> | null = null;
export const geo = () => (cache ??= build());

function build() {
  const legs = [-1, 1].flatMap((sx) => [-1, 1].map((sz) => box(0.035, 0.45, 0.035, sx * 0.18, 0.225, sz * 0.17)));
  return {
    // Dining chair: local +z faces the table.
    chairFrame: mergeGeometries([...legs, box(0.035, 0.52, 0.035, -0.19, 0.72, -0.2), box(0.035, 0.52, 0.035, 0.19, 0.72, -0.2), box(0.42, 0.045, 0.04, 0, 0.97, -0.2)]),
    chairCushion: mergeGeometries([box(0.42, 0.07, 0.4, 0, 0.48, 0), box(0.36, 0.34, 0.05, 0, 0.75, -0.18)]),
    plate: new THREE.CylinderGeometry(0.13, 0.1, 0.014, 28).translate(0, 0.007, 0),
    glass: lathe(
      [
        [0, 0],
        [0.034, 0],
        [0.034, 0.004],
        [0.004, 0.01],
        [0.004, 0.09],
        [0.026, 0.105],
        [0.04, 0.145],
        [0.036, 0.2],
      ],
      14,
    ),
    candle: new THREE.CylinderGeometry(0.024, 0.024, 0.11, 12).translate(0, 0.055, 0),
    flame: new THREE.SphereGeometry(0.016, 8, 6).scale(1, 2, 1),
    bottle: lathe(
      [
        [0, 0],
        [0.037, 0],
        [0.039, 0.006],
        [0.039, 0.2],
        [0.033, 0.235],
        [0.013, 0.265],
        [0.012, 0.32],
        [0.015, 0.33],
        [0, 0.335],
      ],
      10,
    ),
    rack: mergeGeometries([box(0.3, 1.7, 0.9, 0, 0.85, 0), ...[0.2, 0.47, 0.74, 1.01, 1.28, 1.55].map((y) => box(0.36, 0.025, 0.9, 0.06, y, 0))]),
    cord: new THREE.CylinderGeometry(0.006, 0.006, 1, 5).translate(0, 0.5, 0),
    globe: new THREE.SphereGeometry(0.15, 18, 12),
    shade: new THREE.CylinderGeometry(0.05, 0.17, 0.12, 18, 1, true),
    frond: new THREE.SphereGeometry(1, 10, 6).scale(0.13, 0.022, 0.58).translate(0, 0, 0.56),
    pot: lathe(
      [
        [0, 0],
        [0.2, 0],
        [0.27, 0.42],
        [0.29, 0.45],
        [0, 0.45],
      ],
      20,
    ),
    trunk: new THREE.CylinderGeometry(0.035, 0.06, 1, 7).translate(0, 0.5, 0),
    barrel: lathe(
      [
        [0, 0],
        [0.3, 0],
        [0.36, 0.25],
        [0.38, 0.45],
        [0.36, 0.65],
        [0.3, 0.9],
        [0, 0.9],
      ],
      20,
    ),
  };
}

export interface Seat {
  x: number;
  z: number;
  /** Unit vector from the chair towards the table. */
  fx: number;
  fz: number;
}

/** Where the chairs go around a table (relative to the table centre). */
export function seatLayout(t: RestaurantTable): Seat[] {
  const out: Seat[] = [];
  if (t.shape === 'counter') {
    for (let i = 0; i < 8; i++) out.push({ x: -2.6 + i * 0.75, z: 0.75, fx: 0, fz: -1 });
  } else if (t.shape === 'rect' || t.shape === 'room') {
    const n = Math.ceil(t.maxSeats / 2);
    const len = t.shape === 'room' ? (t.d ?? 4) * 0.6 : (t.w ?? 2);
    const step = Math.min(0.75, (len - 0.5) / Math.max(1, n - 1));
    for (let i = 0; i < n; i++) {
      const o = (i - (n - 1) / 2) * step;
      if (t.shape === 'room') out.push({ x: -0.75, z: o, fx: 1, fz: 0 }, { x: 0.75, z: o, fx: -1, fz: 0 });
      else out.push({ x: o, z: -0.75, fx: 0, fz: 1 }, { x: o, z: 0.75, fx: 0, fz: -1 });
    }
  } else {
    const r = t.maxSeats > 2 ? 0.95 : 0.75;
    for (let i = 0; i < t.maxSeats; i++) {
      const a = (i / t.maxSeats) * Math.PI * 2;
      out.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, fx: -Math.cos(a), fz: -Math.sin(a) });
    }
  }
  return out;
}
