import { Environment, Html, Lightformer, OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { tableById } from '@/data/tables';
import { useCoarsePointer } from '@/hooks/useMedia';
import { useI18n } from '@/i18n';
import type { RestaurantTable } from '@/types';
import type { FloorPlanProps, TableState } from './planTypes';
import { TOP } from './geometry';
import { Barrels, Facade, Fans, Hearth, Palms, Pendants, SalonBar, TableDressing, VaultRibs, WineVault } from './props';
import { glow, herringbone, marble, plaster } from './textures';

/** Textures are drawn once per page load and shared by every mount of the scene. */
let tex: { floor: THREE.Texture; noir: THREE.Texture; counter: THREE.Texture; wall: THREE.Texture; glow: THREE.Texture } | null = null;
const textures = () => (tex ??= { floor: herringbone(), noir: marble('#0e0d0c', '#8a7a62', 21), counter: marble('#e6dfd3', '#9c9288', 8), wall: plaster(), glow: glow() });

/** The floor's UVs are laid out in metres, rotated 45°, so the herringbone runs diagonally. */
function useFloorGeometry() {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(22, 16, 1, 1);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const c = Math.SQRT1_2;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      uv.setXY(i, (x * c - y * c) / 3, (x * c + y * c) / 3);
    }
    return g;
  }, []);
}

/** Light-pool colour and strength under a table; the champagne/oxblood match the status legend. */
function poolStyle(state: TableState, selected: boolean, hovered: boolean): [string, number] {
  if (selected) return ['#f0d9a8', 1];
  if (state === 'free') return [hovered ? '#f0d9a8' : '#d9b46e', hovered ? 1 : 0.8];
  if (state === 'booked') return ['#a8382c', 0.5];
  if (state === 'idle') return ['#ffb36b', 0.28];
  return ['#000000', 0];
}

function clothStyle(state: TableState, selected: boolean, hovered: boolean) {
  if (selected) return { color: '#f0d9a8', emissive: '#c5a46d', emissiveIntensity: 0.35 };
  if (state === 'booked') return { color: '#6a332d', emissive: '#000000', emissiveIntensity: 0 };
  return { color: hovered ? '#fbf4e4' : '#ece4d4', emissive: '#000000', emissiveIntensity: 0 };
}

function footprint(t: RestaurantTable): { round?: number; w: number; d: number } {
  if (t.shape === 'round') {
    const r = t.maxSeats > 2 ? 0.62 : 0.48;
    return { round: r, w: r * 2, d: r * 2 };
  }
  if (t.shape === 'square') return { w: 0.85, d: 0.85 };
  if (t.shape === 'counter') return { w: t.w ?? 6, d: t.d ?? 0.8 };
  if (t.shape === 'room') return { w: 1, d: (t.d ?? 4) * 0.6 };
  return { w: t.w ?? 2, d: t.d ?? 1 };
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
  const { t: dict } = useI18n();
  const canPick = interactive && state === 'free';
  const lit = hovered && canPick;
  const pool = useRef<THREE.MeshBasicMaterial>(null);
  const size = footprint(t);
  const [poolColor, poolStrength] = poolStyle(state, selected, lit);
  const cloth = clothStyle(state, selected, lit);
  const faded = state === 'unsuitable';
  const { glow: glowTex, counter } = textures();

  // Ease the light pool towards its target; the selected table breathes gently.
  useFrame(({ clock }, dt) => {
    const m = pool.current;
    if (!m) return;
    const target = selected ? poolStrength * (0.8 + Math.sin(clock.elapsedTime * 2.4) * 0.2) : poolStrength;
    m.opacity += (target - m.opacity) * Math.min(1, dt * 6);
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    // Free tables keep the site's utensil cursor; unavailable ones show not-allowed.
    document.body.style.cursor = canPick ? '' : 'not-allowed';
  };
  const out = () => {
    setHovered(false);
    document.body.style.cursor = '';
  };

  const clothMaterial = (
    <meshStandardMaterial {...cloth} roughness={0.92} transparent={faded} opacity={faded ? 0.3 : 1} depthWrite={!faded} />
  );

  return (
    <group position={[t.x, 0, t.z]}>
      {/* Pool of light on the floor — lamplight in explore mode, status in booking mode */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} renderOrder={1}>
        <planeGeometry args={[size.w + 2.4, size.d + 2.4]} />
        <meshBasicMaterial ref={pool} map={glowTex} color={poolColor} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {t.shape === 'counter' ? (
        <>
          <mesh position={[0, (TOP - 0.05) / 2, -0.05]} castShadow receiveShadow>
            <boxGeometry args={[size.w, TOP - 0.05, size.d * 0.7]} />
            <meshStandardMaterial color="#2a1810" roughness={0.5} transparent={faded} opacity={faded ? 0.3 : 1} />
          </mesh>
          <mesh position={[0, TOP - 0.025, 0]} castShadow receiveShadow>
            <boxGeometry args={[size.w + 0.1, 0.05, size.d]} />
            <meshStandardMaterial
              map={counter}
              color={selected ? '#f0d9a8' : state === 'booked' ? '#b0786e' : '#ffffff'}
              emissive={cloth.emissive}
              emissiveIntensity={cloth.emissiveIntensity}
              roughness={0.12}
              transparent={faded}
              opacity={faded ? 0.3 : 1}
            />
          </mesh>
        </>
      ) : size.round ? (
        <>
          {/* Linen cloth falling over a round top */}
          <mesh position={[0, TOP - 0.12, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[size.round * 1.04, size.round * 1.12, 0.24, 48]} />
            {clothMaterial}
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.06, 0.6, 10]} />
            <meshStandardMaterial color="#1c120c" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <cylinderGeometry args={[0.24, 0.28, 0.04, 24]} />
            <meshStandardMaterial color="#c5a46d" metalness={0.85} roughness={0.32} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, TOP - 0.12, 0]} castShadow receiveShadow>
            <boxGeometry args={[size.w + 0.1, 0.24, size.d + 0.1]} />
            {clothMaterial}
          </mesh>
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => (
              <mesh key={`${sx}${sz}`} position={[sx * (size.w / 2 - 0.08), 0.3, sz * (size.d / 2 - 0.08)]} castShadow>
                <boxGeometry args={[0.06, 0.6, 0.06]} />
                <meshStandardMaterial color="#1c120c" roughness={0.5} />
              </mesh>
            )),
          )}
        </>
      )}

      {/* Generous invisible hit area covering the table and its chairs */}
      {interactive && (
        <mesh
          position={[0, 0.6, 0]}
          onPointerOver={over}
          onPointerOut={out}
          onClick={(e) => {
            e.stopPropagation();
            if (canPick) onSelect?.(t.id);
          }}
        >
          <boxGeometry args={[size.w + 1.6, 1.2, size.d + 1.6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      )}

      {interactive && (hovered || selected) && (
        <Html position={[0, 2.2, 0]} center distanceFactor={14} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="border border-champagne/40 bg-obsidian/90 px-3 py-2 text-center text-[11px] text-ivory" style={{ whiteSpace: 'nowrap', width: 'max-content' }}>
            <p className="font-semibold uppercase tracking-[0.16em]">{t.label}</p>
            <p className="text-stone">
              {dict.plan.seats(t.minSeats, t.maxSeats)} ·{' '}
              {selected ? dict.plan.selected : state === 'free' ? dict.plan.available : state === 'booked' ? dict.plan.reserved : dict.plan.notForParty}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

/** Plaster partition with a brass cap rail. */
function Wall({ x, z, w, d, h = 0.9 }: { x: number; z: number; w: number; d: number; h?: number }) {
  const { wall } = textures();
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial map={wall} roughness={0.9} />
      </mesh>
      <mesh position={[0, h + 0.015, 0]}>
        <boxGeometry args={[w + 0.02, 0.03, d + 0.04]} />
        <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.3} />
      </mesh>
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
        className={`tap-target relative grid h-10 w-10 place-items-center rounded-full border text-xs font-semibold transition-colors ${
          active ? 'border-champagne bg-champagne text-obsidian' : 'border-champagne/70 bg-obsidian/85 text-champagne hover:bg-champagne hover:text-obsidian'
        }`}
      >
        {index}
      </button>
    </Html>
  );
}

/** No touch gesture: one finger is left to the page (scroll) and to tapping tables. */
const TOUCH_NONE = -1 as THREE.TOUCH;

function CameraRig({ focus, touch }: { focus: [number, number] | null; touch: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const gl = useThree((s) => s.gl);

  // OrbitControls claims every touch (touch-action: none on the element it listens to — R3F's wrapper div, not the
  // canvas), which would trap the page's scrolling on a phone. On touch screens one finger scrolls the page or taps
  // a table, and two fingers turn the room. touch-action combines with ancestors, so both elements need pan-y.
  useEffect(() => {
    if (!touch) return;
    const id = requestAnimationFrame(() => {
      for (const el of [gl.domElement, controls.current?.domElement]) if (el) el.style.touchAction = 'pan-y';
    });
    return () => cancelAnimationFrame(id);
  }, [gl, touch]);

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
      rotateSpeed={touch ? 0.9 : 0.5}
      touches={touch ? { ONE: TOUCH_NONE, TWO: THREE.TOUCH.DOLLY_ROTATE } : undefined}
      enableDamping
    />
  );
}

/**
 * Nothing that casts a shadow moves, so the shadow map is drawn once (plus a few frames while
 * textures settle) instead of every frame — roughly halving the GPU work per frame.
 */
function StaticShadows({ version }: { version: string }) {
  const gl = useThree((s) => s.gl);
  const frames = useRef(0);
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    frames.current = 0;
  }, [gl, version]);
  useFrame(() => {
    if (frames.current < 6) {
      gl.shadowMap.needsUpdate = true;
      frames.current++;
    }
  });
  return null;
}

const PALMS: [number, number][] = [
  [-1.9, 7.25],
  [1.9, 7.25],
  [-10.3, 7.3],
  [10.3, 7.3],
  [-4.3, -7.4],
  [4.3, -7.4],
];

export default function FloorPlanScene({ mode, tables, selectedId, onSelectTable, spaces = [], activeSpaceId, onSelectSpace }: FloorPlanProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const touch = useCoarsePointer();
  const [visible, setVisible] = useState(true);
  // Resolution steps down if the device struggles, and back up when it recovers.
  const [dpr, setDpr] = useState(1.5);
  const floorGeo = useFloorGeometry();
  const tx = textures();

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
  const pendantSpots = useMemo<[number, number][]>(() => tables.filter((x) => x.table.area === 'main').map((x) => [x.table.x, x.table.z]), [tables]);

  return (
    <div ref={wrap} className="relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,#211914,#11110F_70%)] lg:aspect-[16/10]">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        shadows
        camera={{ position: [0, 20, 19], fov: 34 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => (document.body.style.cursor = '')}
        aria-label={t.plan.canvas}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} flipflops={3} onFallback={() => setDpr(1)} />
        <color attach="background" args={['#120f0d']} />
        <fog attach="fog" args={['#120f0d', 32, 56]} />

        {/* Lighting: soft fill, a warm key that casts shadows, lamplight over the main room */}
        <ambientLight intensity={0.28} />
        <hemisphereLight args={['#f4e6d0', '#1a1410', 0.5]} />
        <directionalLight
          position={[7, 16, 9]}
          intensity={1.35}
          color="#ffe2b8"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-13}
          shadow-camera-right={13}
          shadow-camera-top={11}
          shadow-camera-bottom={-11}
          shadow-camera-near={1}
          shadow-camera-far={45}
          shadow-bias={-0.0004}
          shadow-normalBias={0.03}
        />
        <pointLight position={[-2.6, 3.2, 0.4]} color="#ffc98a" intensity={7} distance={9} decay={1.4} />
        <pointLight position={[2.6, 3.2, 0.4]} color="#ffc98a" intensity={7} distance={9} decay={1.4} />

        {/* Reflections for brass, glass and marble — built from light panels, no image download */}
        <Environment resolution={256} frames={1} environmentIntensity={0.55}>
          <Lightformer form="rect" intensity={2.2} color="#ffdcae" position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[14, 8, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#c5a46d" position={[-9, 3, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#c5a46d" position={[9, 3, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer form="ring" intensity={4} color="#ff8a3d" position={[0, 1.5, -9]} scale={2.5} />
        </Environment>

        {/* Herringbone teak floor, black marble in Salon Noir */}
        <mesh geometry={floorGeo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial map={tx.floor} roughness={0.5} metalness={0.05} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.75, 0.006, -4.25]} receiveShadow>
          <planeGeometry args={[4.5, 7.5]} />
          <meshStandardMaterial map={tx.noir} roughness={0.14} metalness={0.25} />
        </mesh>

        {/* Shell (cut-away walls) */}
        <Wall x={0} z={-8} w={22} d={0.2} h={2.4} />
        <Wall x={-11} z={0} w={0.2} d={16} h={1.1} />
        <Wall x={11} z={0} w={0.2} d={16} h={1.1} />
        <Wall x={-6.5} z={-4.25} w={0.15} d={7.5} />
        <Wall x={6.5} z={-3} w={0.15} d={10} />
        <Wall x={8.75} z={-2.6} w={4.5} d={0.15} />
        <Wall x={-8.75} z={-0.5} w={4.5} d={0.15} />

        {/* Reception desk: walnut with a brass top and a lamp */}
        <group position={[0, 0, 6.6]}>
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 1, 0.55]} />
            <meshStandardMaterial color="#3a2416" roughness={0.45} />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <boxGeometry args={[2.5, 0.04, 0.62]} />
            <meshStandardMaterial color="#c5a46d" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0.8, 1.25, 0]}>
            <sphereGeometry args={[0.1, 16, 12]} />
            <meshBasicMaterial color="#ffd7a3" toneMapped={false} />
          </mesh>
        </group>

        <Facade />
        <VaultRibs />
        <Pendants spots={pendantSpots} />
        <Fans />
        <Hearth />
        <WineVault />
        <SalonBar />
        <Barrels />
        <Palms spots={PALMS} />
        <TableDressing tables={tables} />

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

        <StaticShadows version={tables.map((x) => x.table.id).join()} />
        <CameraRig focus={focus} touch={touch} />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] lg:text-[10px] uppercase tracking-[0.2em] text-muted">{touch ? t.plan.dragTouch : t.plan.drag}</p>
    </div>
  );
}
