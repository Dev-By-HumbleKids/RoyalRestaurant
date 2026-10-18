import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { RestaurantTable } from '@/types';
import type { PlanTable } from './planTypes';
import { geo, m4, seatLayout, TOP, type Item } from './geometry';
import { brick } from './textures';

/** One draw call for many copies of the same object. */
export function Instances({ geometry, material, items, shadows = true }: { geometry: THREE.BufferGeometry; material: THREE.Material; items: Item[]; shadows?: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    items.forEach((it, i) => {
      mesh.setMatrixAt(i, it.m);
      if (it.c) mesh.setColorAt(i, it.c);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  return <instancedMesh key={items.length} ref={ref} args={[geometry, material, items.length]} castShadow={shadows} receiveShadow={shadows} />;
}

/** Candle spots on a table: one in the middle, three along long tables. */
function candleSpots(t: RestaurantTable): [number, number][] {
  if (t.shape === 'counter') return [-2, 0, 2].map((x) => [x, -0.05]);
  if (t.shape === 'room') return [-0.8, 0, 0.8].map((z) => [0, z * ((t.d ?? 4) / 6)]);
  if (t.shape === 'rect') return [[-0.5, 0], [0.5, 0]];
  return [[0, 0]];
}

const BOTTLE_COLORS = ['#1d3523', '#2c1b10', '#132219', '#3a2313', '#0e1d16', '#40301a'].map((c) => new THREE.Color(c));

/** Chairs, place settings and candles for every table — a handful of instanced draw calls. */
export function TableDressing({ tables }: { tables: PlanTable[] }) {
  const g = geo();
  const ids = tables.map((x) => x.table.id).join();
  const sets = useMemo(() => {
    const chairs: Item[] = [];
    const plates: Item[] = [];
    const glasses: Item[] = [];
    const candles: Item[] = [];
    const flames: Item[] = [];
    for (const { table: t } of tables) {
      for (const s of seatLayout(t)) {
        const ry = Math.atan2(s.fx, s.fz);
        chairs.push({ m: m4(t.x + s.x, 0, t.z + s.z, ry) });
        const px = t.x + s.x + s.fx * 0.47;
        const pz = t.z + s.z + s.fz * 0.47;
        plates.push({ m: m4(px, TOP, pz) });
        glasses.push({ m: m4(px + s.fx * 0.13 - s.fz * 0.15, TOP, pz + s.fz * 0.13 + s.fx * 0.15) });
      }
      for (const [cx, cz] of candleSpots(t)) {
        candles.push({ m: m4(t.x + cx, TOP, t.z + cz) });
        flames.push({ m: m4(t.x + cx, TOP + 0.13, t.z + cz) });
      }
    }
    return { chairs, plates, glasses, candles, flames };
    // The layout only depends on which tables exist, not on their live status.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  const mats = useMemo(
    () => ({
      wood: new THREE.MeshStandardMaterial({ color: '#2a1810', roughness: 0.55, metalness: 0.05 }),
      leather: new THREE.MeshStandardMaterial({ color: '#5b1f1a', roughness: 0.42, metalness: 0.05 }),
      porcelain: new THREE.MeshStandardMaterial({ color: '#f4efe6', roughness: 0.18, metalness: 0 }),
      glass: new THREE.MeshPhysicalMaterial({ color: '#e8f0f0', roughness: 0.04, metalness: 0, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }),
      wax: new THREE.MeshStandardMaterial({ color: '#efe4cc', roughness: 0.6, emissive: '#ffb060', emissiveIntensity: 0.25 }),
      flame: new THREE.MeshBasicMaterial({ color: '#ffc874', toneMapped: false }),
    }),
    [],
  );

  return (
    <group>
      <Instances geometry={g.chairFrame} material={mats.wood} items={sets.chairs} />
      <Instances geometry={g.chairCushion} material={mats.leather} items={sets.chairs} />
      <Instances geometry={g.plate} material={mats.porcelain} items={sets.plates} />
      <Instances geometry={g.glass} material={mats.glass} items={sets.glasses} shadows={false} />
      <Instances geometry={g.candle} material={mats.wax} items={sets.candles} shadows={false} />
      <Instances geometry={g.flame} material={mats.flame} items={sets.flames} shadows={false} />
    </group>
  );
}

/** The 1928 hearth: brick, a copper hood, logs, embers and moving flames. */
export function Hearth() {
  const light = useRef<THREE.PointLight>(null);
  const flames = useRef<THREE.Group>(null);
  const brickTex = useMemo(brick, []);
  const flameSpots = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ x: -1.1 + i * 0.275, h: 0.35 + ((i * 37) % 10) / 22, phase: i * 1.7, inner: i % 2 === 0 })),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (light.current) light.current.intensity = 16 + Math.sin(t * 7) * 2.2 + Math.sin(t * 13.3) * 1.4;
    flames.current?.children.forEach((f, i) => {
      const p = flameSpots[i];
      f.scale.set(1 + Math.sin(t * 9 + p.phase) * 0.12, 1 + Math.sin(t * 6.3 + p.phase) * 0.28 + Math.sin(t * 15 + p.phase) * 0.1, 1);
    });
  });

  return (
    <group position={[0, 0, -7.4]}>
      {/* Brick body and chimney */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 2.4, 0.9]} />
        <meshStandardMaterial map={brickTex} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.82, 0.452]}>
        <planeGeometry args={[3.1, 1.15]} />
        <meshBasicMaterial color="#070403" />
      </mesh>
      {/* Copper hood */}
      <group position={[0, 2.85, 0.15]} scale={[1, 1, 0.42]}>
        <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
          <cylinderGeometry args={[0.85, 1.85, 0.9, 4, 1]} />
          <meshStandardMaterial color="#8c5a38" metalness={0.85} roughness={0.32} />
        </mesh>
      </group>
      <mesh position={[0, 3.9, 0.1]} castShadow>
        <boxGeometry args={[1.1, 1.3, 0.8]} />
        <meshStandardMaterial map={brickTex} roughness={0.92} />
      </mesh>
      {/* Stone hearth slab, logs and embers */}
      <mesh position={[0, 0.125, 0.65]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 0.25, 1.5]} />
        <meshStandardMaterial color="#2a2521" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.275, 0.75]}>
        <boxGeometry args={[2.7, 0.05, 0.55]} />
        <meshBasicMaterial color="#ff4f12" toneMapped={false} />
      </mesh>
      {[-0.75, -0.25, 0.25, 0.75].map((x, i) => (
        <mesh key={x} position={[x, 0.36, 0.72 + (i % 2) * 0.08]} rotation={[0, 0.25 * (i % 2 ? 1 : -1), Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.95, 10]} />
          <meshStandardMaterial color="#1b110b" roughness={0.95} emissive="#ff4a10" emissiveIntensity={0.18} />
        </mesh>
      ))}
      <group ref={flames} position={[0, 0.38, 0.75]}>
        {flameSpots.map((f) => (
          <group key={f.x} position={[f.x, 0, 0]}>
          <mesh position={[0, f.h / 2, 0]}>
            <coneGeometry args={[f.inner ? 0.09 : 0.14, f.h, 8]} />
            <meshBasicMaterial
              color={f.inner ? '#ffd27a' : '#ff7a2a'}
              transparent
              opacity={f.inner ? 0.9 : 0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          </group>
        ))}
      </group>
      <pointLight ref={light} position={[0, 1.1, 1.6]} color="#ff8a3d" distance={10} decay={1.5} />
    </group>
  );
}

/** Barrel vault ribs in brass, landing on short columns. */
const RIB_Z = [-4.5, -2.5, -0.5, 1.5, 3.5];

export function VaultRibs() {
  const rib = useMemo(() => new THREE.TorusGeometry(6, 0.045, 8, 72, Math.PI), []);
  const zs = RIB_Z;
  const parts = useMemo(() => {
    const spots = RIB_Z.flatMap((z) => [-6, 6].map((x) => ({ m: m4(x, 0, z) })));
    return {
      shaft: new THREE.CylinderGeometry(0.11, 0.13, 0.9, 16).translate(0, 0.45, 0),
      cap: new THREE.BoxGeometry(0.3, 0.06, 0.3).translate(0, 0.92, 0),
      stone: new THREE.MeshStandardMaterial({ color: '#d8cdbb', roughness: 0.6 }),
      brass: new THREE.MeshStandardMaterial({ color: '#c5a46d', metalness: 0.85, roughness: 0.3 }),
      spots,
    };
  }, []);
  return (
    <group>
      {zs.map((z) => (
        <mesh key={z} geometry={rib} position={[0, 0.9, z]}>
          <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.28} emissive="#c5a46d" emissiveIntensity={0.08} />
        </mesh>
      ))}
      <Instances geometry={parts.shaft} material={parts.stone} items={parts.spots} />
      <Instances geometry={parts.cap} material={parts.brass} items={parts.spots} shadows={false} />
    </group>
  );
}

/** Warm pendant lamps hanging from the vault above the main-room tables. */
export function Pendants({ spots }: { spots: [number, number][] }) {
  const g = geo();
  const items = useMemo(() => {
    const cords: Item[] = [];
    const lamps: Item[] = [];
    for (const [x, z] of spots) {
      const top = 0.9 + Math.sqrt(Math.max(0, 36 - x * x));
      const bottom = 2.75;
      cords.push({ m: m4(x, bottom + 0.08, z, 0, [1, top - bottom, 1]) });
      lamps.push({ m: m4(x, bottom, z) });
    }
    return { cords, lamps };
  }, [spots]);
  const mats = useMemo(
    () => ({
      cord: new THREE.MeshBasicMaterial({ color: '#0c0a08' }),
      globe: new THREE.MeshBasicMaterial({ color: '#ffd7a3', toneMapped: false }),
      shade: new THREE.MeshStandardMaterial({ color: '#c5a46d', metalness: 0.9, roughness: 0.3, side: THREE.DoubleSide }),
    }),
    [],
  );
  const shades = useMemo(() => items.lamps.map((l) => ({ m: l.m.clone().multiply(new THREE.Matrix4().makeTranslation(0, 0.1, 0)) })), [items]);
  return (
    <group>
      <Instances geometry={g.cord} material={mats.cord} items={items.cords} shadows={false} />
      <Instances geometry={g.globe} material={mats.globe} items={items.lamps} shadows={false} />
      <Instances geometry={g.shade} material={mats.shade} items={shades} shadows={false} />
    </group>
  );
}

/** Slow ceiling fans under the vault. */
export function Fans() {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame((_, dt) => refs.current.forEach((f) => f && (f.rotation.y += dt * 0.6)));
  return (
    <>
      {[-2.8, 2.8].map((x, i) => {
        const top = 0.9 + Math.sqrt(36 - x * x);
        return (
          <group key={x} position={[x, 0, -0.6]}>
            <mesh position={[0, (top + 4.6) / 2, 0]}>
              <cylinderGeometry args={[0.015, 0.015, top - 4.6, 6]} />
              <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.3} />
            </mesh>
            <group ref={(el) => (refs.current[i] = el)} position={[0, 4.6, 0]}>
              <mesh>
                <cylinderGeometry args={[0.09, 0.07, 0.12, 14]} />
                <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.3} />
              </mesh>
              {[0, 1, 2, 3, 4].map((b) => (
                <group key={b} rotation={[0, (b / 5) * Math.PI * 2, 0]}>
                  <mesh position={[0, 0, 0.44]} rotation={[0.12, 0, 0]}>
                    <boxGeometry args={[0.14, 0.012, 0.72]} />
                    <meshStandardMaterial color="#3b2416" roughness={0.6} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        );
      })}
    </>
  );
}

/** The Vault: racks of bottles along both walls and the original 1926 bank-vault door. */
export function WineVault() {
  const g = geo();
  const sets = useMemo(() => {
    const racks: Item[] = [];
    const bottles: Item[] = [];
    let n = 0;
    for (const [x, dir] of [
      [6.85, 1],
      [10.65, -1],
    ] as const) {
      for (const z of [-7.25, -6.3, -5.35, -4.4, -3.45]) {
        racks.push({ m: m4(x, 0, z, dir > 0 ? 0 : Math.PI) });
        for (const y of [0.25, 0.52, 0.79, 1.06, 1.33, 1.6]) {
          for (const dz of [-0.33, -0.11, 0.11, 0.33]) {
            // Bottles lie on their side with the base towards the aisle.
            bottles.push({ m: m4(x + dir * 0.4, y, z + dz, 0, 1, 0, dir > 0 ? Math.PI / 2 : -Math.PI / 2), c: BOTTLE_COLORS[n++ % BOTTLE_COLORS.length] });
          }
        }
      }
    }
    return { racks, bottles };
  }, []);
  const mats = useMemo(
    () => ({
      rack: new THREE.MeshStandardMaterial({ color: '#2b1a10', roughness: 0.7 }),
      bottle: new THREE.MeshStandardMaterial({ roughness: 0.15, metalness: 0.2 }),
    }),
    [],
  );
  return (
    <group>
      <Instances geometry={g.rack} material={mats.rack} items={sets.racks} />
      <Instances geometry={g.bottle} material={mats.bottle} items={sets.bottles} shadows={false} />
      {/* Vault door on the north wall */}
      <group position={[8.75, 1.15, -7.86]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.95, 0.95, 0.16, 48]} />
          <meshStandardMaterial color="#6f6c66" metalness={0.92} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <torusGeometry args={[0.95, 0.07, 12, 64]} />
          <meshStandardMaterial color="#c5a46d" metalness={0.95} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 24]} />
          <meshStandardMaterial color="#c5a46d" metalness={0.95} roughness={0.25} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0, 0.16]} rotation={[0, 0, (i / 3) * Math.PI]}>
            <boxGeometry args={[0.9, 0.04, 0.04]} />
            <meshStandardMaterial color="#c5a46d" metalness={0.95} roughness={0.25} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Salon Noir: a black-lacquer bar with a back shelf, and a small chandelier. */
export function SalonBar() {
  const g = geo();
  const bottles = useMemo(
    () =>
      [1.25, 1.75].flatMap((y, row) =>
        Array.from({ length: 12 }, (_, i) => ({ m: m4(-10.25 + i * 0.27, y, -7.82), c: BOTTLE_COLORS[(i + row * 3) % BOTTLE_COLORS.length] })),
      ),
    [],
  );
  const bottleMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.15, metalness: 0.2 }), []);
  const bulbs = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ m: m4(-8.75 + Math.cos((i / 10) * Math.PI * 2) * 0.55, 2.55, -4.25 + Math.sin((i / 10) * Math.PI * 2) * 0.55) })), []);
  const bulbMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffe0b0', toneMapped: false }), []);
  const bulbGeo = useMemo(() => new THREE.SphereGeometry(0.06, 10, 8), []);
  return (
    <group>
      <mesh position={[-8.75, 0.53, -7.35]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 1.06, 0.55]} />
        <meshStandardMaterial color="#0b0a09" metalness={0.3} roughness={0.18} />
      </mesh>
      <mesh position={[-8.75, 1.08, -7.35]}>
        <boxGeometry args={[3.5, 0.05, 0.66]} />
        <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.25} />
      </mesh>
      {[1.22, 1.72].map((y) => (
        <mesh key={y} position={[-8.75, y, -7.82]}>
          <boxGeometry args={[3.4, 0.03, 0.22]} />
          <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      <Instances geometry={g.bottle} material={bottleMat} items={bottles} shadows={false} />
      {/* Chandelier */}
      <mesh position={[-8.75, 3.1, -4.25]}>
        <cylinderGeometry args={[0.008, 0.008, 1.1, 5]} />
        <meshBasicMaterial color="#0c0a08" />
      </mesh>
      <mesh position={[-8.75, 2.55, -4.25]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.018, 8, 48]} />
        <meshStandardMaterial color="#c5a46d" metalness={0.95} roughness={0.25} />
      </mesh>
      <Instances geometry={bulbGeo} material={bulbMat} items={bulbs} shadows={false} />
      <pointLight position={[-8.75, 2.3, -4.25]} color="#ffcf96" intensity={5} distance={6} decay={1.6} />
    </group>
  );
}

/** Oak barrels in the Cellar Room. */
export function Barrels() {
  const g = geo();
  return (
    <>
      {[
        [10.4, 1.45],
        [10.4, -2.0],
        [7.15, 1.5],
      ].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh geometry={g.barrel} castShadow receiveShadow>
            <meshStandardMaterial color="#5a3820" roughness={0.75} />
          </mesh>
          {[0.15, 0.75].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.345, 0.012, 6, 32]} />
              <meshStandardMaterial color="#26221e" metalness={0.8} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

/** Potted palms — a nod to Yangon's colonial-era hotel lobbies. */
export function Palms({ spots }: { spots: [number, number][] }) {
  const g = geo();
  const sets = useMemo(() => {
    const pots: Item[] = [];
    const trunks: Item[] = [];
    const fronds: Item[] = [];
    spots.forEach(([x, z], p) => {
      pots.push({ m: m4(x, 0, z) });
      trunks.push({ m: m4(x, 0.4, z, 0, [1, 0.85, 1]) });
      for (let i = 0; i < 10; i++) {
        const yaw = (i / 10) * Math.PI * 2 + p;
        const droop = 0.25 + (i % 3) * 0.22;
        fronds.push({ m: m4(x, 1.22 - (i % 3) * 0.05, z, yaw, 1, droop) });
      }
    });
    return { pots, trunks, fronds };
  }, [spots]);
  const mats = useMemo(
    () => ({
      pot: new THREE.MeshStandardMaterial({ color: '#c5a46d', metalness: 0.75, roughness: 0.35 }),
      trunk: new THREE.MeshStandardMaterial({ color: '#4a3524', roughness: 0.9 }),
      leaf: new THREE.MeshStandardMaterial({ color: '#2f4a2a', roughness: 0.65, side: THREE.DoubleSide }),
    }),
    [],
  );
  return (
    <group>
      <Instances geometry={g.pot} material={mats.pot} items={sets.pots} />
      <Instances geometry={g.trunk} material={mats.trunk} items={sets.trunks} />
      <Instances geometry={g.frond} material={mats.leaf} items={sets.fronds} />
    </group>
  );
}

/** South facade: stone plinth, arched glazing and a brass revolving door. */
export function Facade() {
  const door = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (door.current) door.current.rotation.y += dt * 0.25;
  });
  const arches = [-8.5, -6, -3.5, 3.5, 6, 8.5];
  return (
    <group>
      {[
        [-6, 10],
        [6, 10],
      ].map(([x, w]) => (
        <mesh key={x} position={[x, 0.15, 8]} castShadow receiveShadow>
          <boxGeometry args={[w, 0.3, 0.3]} />
          <meshStandardMaterial color="#d8cdbb" roughness={0.7} />
        </mesh>
      ))}
      {arches.map((x) => (
        <group key={x} position={[x, 0.3, 8]}>
          <mesh>
            <torusGeometry args={[0.95, 0.06, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.28} />
          </mesh>
          <mesh>
            <circleGeometry args={[0.93, 32, 0, Math.PI]} />
            <meshPhysicalMaterial color="#9fb4b8" roughness={0.05} metalness={0.1} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.03, 0.9, 0.03]} />
            <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Revolving door */}
      <group position={[0, 0, 8]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 1.2, 40, 1, true]} />
          <meshPhysicalMaterial color="#9fb4b8" roughness={0.05} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, 1.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.035, 8, 48]} />
          <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.28} />
        </mesh>
        <group ref={door} position={[0, 0.6, 0]}>
          {[0, 1].map((i) => (
            <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
              <boxGeometry args={[1.75, 1.15, 0.025]} />
              <meshPhysicalMaterial color="#c5a46d" metalness={0.6} roughness={0.15} transparent opacity={0.35} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
