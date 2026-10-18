import { Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { tableById } from '@/data/tables';
import type { RestaurantTable } from '@/types';
import type { FloorPlanProps, TableState } from './planTypes';

const C = {
  floor: '#221D18',
  wall: '#2A231D',
  champagne: '#C5A46D',
  free: '#C5A46D',
  booked: '#7A3B33',
  unsuitable: '#3A342E',
  selected: '#F0D9A8',
  marble: '#0D0C0B',
};

const tableColor = (state: TableState, selected: boolean, hovered: boolean) => {
  if (selected) return C.selected;
  if (state === 'booked') return C.booked;
  if (state === 'unsuitable') return C.unsuitable;
  return hovered ? C.selected : C.free;
};

function Seats({ t }: { t: RestaurantTable }) {
  const positions = useMemo(() => {
    const out: [number, number, number][] = [];
    if (t.shape === 'counter') {
      for (let i = 0; i < 8; i++) out.push([-2.6 + i * 0.75, 0.25, 0.75]);
    } else if (t.shape === 'rect' || t.shape === 'room') {
      const n = Math.ceil(t.maxSeats / 2);
      const len = t.shape === 'room' ? (t.d ?? 4) * 0.55 : (t.w ?? 2);
      for (let i = 0; i < n; i++) {
        const o = -len / 2 + (len / Math.max(1, n - 1)) * i;
        if (t.shape === 'room') out.push([-0.75, 0.25, o], [0.75, 0.25, o]);
        else out.push([o, 0.25, -0.75], [o, 0.25, 0.75]);
      }
    } else {
      const r = t.maxSeats > 2 ? 0.95 : 0.75;
      for (let i = 0; i < t.maxSeats; i++) {
        const a = (i / t.maxSeats) * Math.PI * 2;
        out.push([Math.cos(a) * r, 0.25, Math.sin(a) * r]);
      }
    }
    return out;
  }, [t]);
  return (
    <>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.32, 0.5, 0.32]} />
          <meshStandardMaterial color="#3B2E25" roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

function Table3D({
  t,
  state,
  selected,
  interactive,
  onSelect,
}: {
  t: RestaurantTable;
  state: TableState;
  selected: boolean;
  interactive: boolean;
  onSelect?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const canPick = interactive && state === 'free';
  const color = tableColor(state, selected, hovered && canPick);
  const top = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (!top.current) return;
    const target = selected ? 0.95 : hovered && canPick ? 0.88 : 0.78;
    top.current.position.y += (target - top.current.position.y) * Math.min(1, dt * 8);
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = canPick ? 'pointer' : 'not-allowed';
  };
  const out = () => {
    setHovered(false);
    document.body.style.cursor = '';
  };

  let geometry: JSX.Element;
  if (t.shape === 'round') geometry = <cylinderGeometry args={[t.maxSeats > 2 ? 0.62 : 0.48, t.maxSeats > 2 ? 0.62 : 0.48, 0.08, 40]} />;
  else if (t.shape === 'square') geometry = <boxGeometry args={[0.85, 0.08, 0.85]} />;
  else if (t.shape === 'counter') geometry = <boxGeometry args={[t.w ?? 6, 0.12, t.d ?? 0.8]} />;
  else if (t.shape === 'room') geometry = <boxGeometry args={[1, 0.08, (t.d ?? 4) * 0.6]} />;
  else geometry = <boxGeometry args={[t.w ?? 2, 0.08, t.d ?? 1]} />;

  return (
    <group position={[t.x, 0, t.z]}>
      <mesh
        ref={top}
        position={[0, 0.78, 0]}
        onPointerOver={interactive ? over : undefined}
        onPointerOut={interactive ? out : undefined}
        onClick={
          interactive
            ? (e) => {
                e.stopPropagation();
                if (canPick) onSelect?.(t.id);
              }
            : undefined
        }
        castShadow
      >
        {geometry}
        <meshStandardMaterial
          color={color}
          emissive={selected ? '#C5A46D' : '#000000'}
          emissiveIntensity={selected ? 0.35 : 0}
          metalness={state === 'free' || selected ? 0.55 : 0.1}
          roughness={0.35}
          transparent={state === 'unsuitable'}
          opacity={state === 'unsuitable' ? 0.45 : 1}
        />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.76, 8]} />
        <meshStandardMaterial color="#2A221B" />
      </mesh>
      <Seats t={t} />
      {interactive && (hovered || selected) && (
        <Html position={[0, 2.4, 0]} center distanceFactor={14} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="border border-champagne/40 bg-obsidian/90 px-3 py-2 text-center text-[11px] text-ivory" style={{ whiteSpace: 'nowrap', width: 'max-content' }}>
            <p className="font-semibold uppercase tracking-[0.16em]">{t.label}</p>
            <p className="text-stone">
              {t.minSeats}–{t.maxSeats} seats · {selected ? 'Selected' : state === 'free' ? 'Available' : state === 'booked' ? 'Reserved' : 'Not for your party'}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

function Hearth() {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current) light.current.intensity = 14 + Math.sin(clock.elapsedTime * 7) * 2 + Math.sin(clock.elapsedTime * 13) * 1.2;
  });
  return (
    <group position={[0, 0, -7.4]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[4.4, 2, 0.9]} />
        <meshStandardMaterial color="#2B1E16" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, 0.3]}>
        <boxGeometry args={[3, 0.7, 0.4]} />
        <meshStandardMaterial color="#E0702F" emissive="#E0602A" emissiveIntensity={2.2} />
      </mesh>
      <pointLight ref={light} position={[0, 1.2, 1.4]} color="#FF8A3D" distance={9} decay={1.6} />
    </group>
  );
}

function Wall({ x, z, w, d, h = 0.5 }: { x: number; z: number; w: number; d: number; h?: number }) {
  return (
    <mesh position={[x, h / 2, z]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={C.wall} roughness={0.9} />
    </mesh>
  );
}

/** The 1926 barrel vault, drawn as champagne ribs over the main room. */
function VaultRibs() {
  const geo = useMemo(() => new THREE.TorusGeometry(6, 0.035, 6, 64, Math.PI), []);
  return (
    <group>
      {[-4.5, -2.5, -0.5, 1.5, 3.5].map((z) => (
        <mesh key={z} geometry={geo} position={[0, 0.5, z]}>
          <meshStandardMaterial color={C.champagne} emissive={C.champagne} emissiveIntensity={0.25} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function WineRacks() {
  return (
    <group position={[8.75, 0, -5.3]}>
      {[-1.6, -0.55, 0.5, 1.55].map((x) => (
        <mesh key={x} position={[x, 0.8, -1.6]}>
          <boxGeometry args={[0.8, 1.6, 0.4]} />
          <meshStandardMaterial color="#3A2A1F" emissive="#C5A46D" emissiveIntensity={0.08} />
        </mesh>
      ))}
      {[-1.6, -0.55, 0.5, 1.55].map((x) => (
        <mesh key={`b${x}`} position={[x, 0.8, 0.6]}>
          <boxGeometry args={[0.8, 1.6, 0.4]} />
          <meshStandardMaterial color="#3A2A1F" emissive="#C5A46D" emissiveIntensity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function Hotspot({ x, z, index, active, onSelect, label }: { x: number; z: number; index: number; active: boolean; onSelect: () => void; label: string }) {
  return (
    <Html position={[x, 1.4, z]} center distanceFactor={14} zIndexRange={[30, 0]}>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`${index}. ${label}`}
        aria-pressed={active}
        className={`grid h-10 w-10 place-items-center rounded-full border text-xs font-semibold transition-colors ${
          active ? 'border-champagne bg-champagne text-obsidian' : 'border-champagne/70 bg-obsidian/85 text-champagne hover:bg-champagne hover:text-obsidian'
        }`}
      >
        {index}
      </button>
    </Html>
  );
}

function CameraRig({ focus }: { focus: [number, number] | null }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    target.set(focus ? focus[0] * 0.5 : 0, 0, focus ? focus[1] * 0.5 : 0.8);
    c.target.lerp(target, Math.min(1, dt * 2.5));
    c.update();
  });
  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={0.45}
      maxPolarAngle={1.05}
      minAzimuthAngle={-0.7}
      maxAzimuthAngle={0.7}
      rotateSpeed={0.5}
      enableDamping
    />
  );
}

export default function FloorPlanScene({ mode, tables, selectedId, onSelectTable, spaces = [], activeSpaceId, onSelectSpace }: FloorPlanProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering when the canvas is off-screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => void (document.body.style.cursor = ''), []);

  const selected = selectedId ? tableById.get(selectedId) : undefined;
  const activeSpace = spaces.find((s) => s.id === activeSpaceId);
  const focus: [number, number] | null = selected ? [selected.x, selected.z] : activeSpace ? [activeSpace.hotspot.x, activeSpace.hotspot.z] : null;

  return (
    <div ref={wrap} className="relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,#211914,#11110F_70%)] lg:aspect-[16/10]">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 20, 19], fov: 34 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => (document.body.style.cursor = '')}
        aria-label="Interactive 3D floor plan"
      >
        <color attach="background" args={['#120F0D']} />
        <fog attach="fog" args={['#120F0D', 30, 52]} />
        <ambientLight intensity={0.75} />
        <hemisphereLight args={['#F4EFE6', '#1A1410', 0.45]} />
        <directionalLight position={[6, 14, 8]} intensity={1.1} color="#FFE7C2" />
        <spotLight position={[0, 10, 2]} angle={0.7} penumbra={0.8} intensity={30} color="#FFD9A0" />

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[22, 16]} />
          <meshStandardMaterial color={C.floor} roughness={0.85} />
        </mesh>
        {/* Salon Noir marble floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.75, 0.01, -4.25]}>
          <planeGeometry args={[4.5, 7.5]} />
          <meshStandardMaterial color={C.marble} roughness={0.25} metalness={0.3} />
        </mesh>

        {/* Shell (cut-away walls) */}
        <Wall x={0} z={-8} w={22} d={0.2} h={1.2} />
        <Wall x={-11} z={0} w={0.2} d={16} />
        <Wall x={11} z={0} w={0.2} d={16} />
        <Wall x={-6.5} z={-4.25} w={0.15} d={7.5} h={0.9} />
        <Wall x={6.5} z={-3} w={0.15} d={10} h={0.9} />
        <Wall x={8.75} z={-2.6} w={4.5} d={0.15} h={0.9} />
        <Wall x={-8.75} z={-0.5} w={4.5} d={0.15} h={0.9} />
        {/* Facade arches */}
        {[-8.5, -6, -3.5, 3.5, 6, 8.5].map((x) => (
          <mesh key={x} position={[x, 0, 8]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.9, 0.06, 6, 24, Math.PI]} />
            <meshStandardMaterial color={C.champagne} emissive={C.champagne} emissiveIntensity={0.3} />
          </mesh>
        ))}
        {/* Reception desk */}
        <mesh position={[0, 0.5, 6.6]}>
          <boxGeometry args={[2.4, 1, 0.5]} />
          <meshStandardMaterial color="#4A3222" roughness={0.6} />
        </mesh>

        <VaultRibs />
        <Hearth />
        <WineRacks />

        {tables.map(({ table, state }) => (
          <Table3D
            key={table.id}
            t={table}
            state={state}
            selected={table.id === selectedId}
            interactive={mode === 'select'}
            onSelect={onSelectTable}
          />
        ))}

        {mode === 'explore' &&
          spaces.map((s, i) => (
            <Hotspot
              key={s.id}
              x={s.hotspot.x}
              z={s.hotspot.z}
              index={i + 1}
              label={s.name}
              active={s.id === activeSpaceId}
              onSelect={() => onSelectSpace?.(s.id)}
            />
          ))}

        <CameraRig focus={focus} />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.2em] text-muted">Drag to rotate</p>
    </div>
  );
}
