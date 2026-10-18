import * as THREE from 'three';

/**
 * Procedural textures drawn on canvases at load time — no image downloads, and every
 * surface stays deterministic (seeded) so the room looks the same on every visit.
 */

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}

function finish(c: HTMLCanvasElement, repeat: [number, number] = [1, 1], srgb = true) {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 8;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Teak herringbone, seamless. One tile = 4 plank lengths. */
export function herringbone() {
  const size = 1024;
  const W = 64;
  const L = 256;
  const [c, g] = canvas(size);
  const r = rng(11);
  g.fillStyle = '#140d08';
  g.fillRect(0, 0, size, size);

  const plank = (x: number, y: number, w: number, h: number) => {
    const horizontal = w > h;
    const light = 19 + r() * 9;
    const fill = `hsl(${22 + r() * 9}, ${40 + r() * 14}%, ${light}%)`;
    const grain = Array.from({ length: 5 + Math.floor(r() * 4) }, () => ({ at: 0.1 + r() * 0.8, wobble: (r() - 0.5) * 6, a: 0.08 + r() * 0.18 }));
    const sheen = 0.03 + r() * 0.06;
    for (const ox of [-size, 0, size]) {
      for (const oy of [-size, 0, size]) {
        const X = x + ox;
        const Y = y + oy;
        if (X > size || Y > size || X + w < 0 || Y + h < 0) continue;
        g.fillStyle = fill;
        g.fillRect(X, Y, w, h);
        const grad = horizontal ? g.createLinearGradient(X, Y, X + w, Y) : g.createLinearGradient(X, Y, X, Y + h);
        grad.addColorStop(0, `rgba(255,220,180,${sheen})`);
        grad.addColorStop(0.5, 'rgba(0,0,0,0)');
        grad.addColorStop(1, `rgba(0,0,0,${sheen * 1.5})`);
        g.fillStyle = grad;
        g.fillRect(X, Y, w, h);
        for (const line of grain) {
          g.strokeStyle = `rgba(20,10,4,${line.a})`;
          g.lineWidth = 1;
          g.beginPath();
          if (horizontal) {
            const yy = Y + h * line.at;
            g.moveTo(X, yy);
            g.quadraticCurveTo(X + w / 2, yy + line.wobble, X + w, yy);
          } else {
            const xx = X + w * line.at;
            g.moveTo(xx, Y);
            g.quadraticCurveTo(xx + line.wobble, Y + h / 2, xx, Y + h);
          }
          g.stroke();
        }
        g.strokeStyle = 'rgba(8,4,2,0.75)';
        g.lineWidth = 2;
        g.strokeRect(X + 1, Y + 1, w - 2, h - 2);
      }
    }
  };

  // Lattice vectors (W, W) and (L, −L); 32 planks of each direction fill the 1024 tile.
  for (let m = 0; m < 2; m++) {
    for (let s = 0; s < size / W; s++) {
      const x = (((m * L + s * W) % size) + size) % size;
      const y = (((-m * L + s * W) % size) + size) % size;
      plank(x, y, L, W);
      plank(x, (y + W) % size, W, L);
    }
  }
  return finish(c);
}

/** Polished marble with soft veins. */
export function marble(base: string, vein: string, seed: number) {
  const size = 1024;
  const [c, g] = canvas(size);
  const r = rng(seed);
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.03)';
    g.beginPath();
    g.arc(r() * size, r() * size, 10 + r() * 60, 0, Math.PI * 2);
    g.fill();
  }
  g.strokeStyle = vein;
  g.lineCap = 'round';
  for (let i = 0; i < 16; i++) {
    let x = r() * size;
    let y = r() * size;
    let a = r() * Math.PI * 2;
    g.globalAlpha = 0.15 + r() * 0.45;
    g.lineWidth = 0.6 + r() * 2.4;
    g.shadowColor = vein;
    g.shadowBlur = 6;
    g.beginPath();
    g.moveTo(x, y);
    for (let k = 0; k < 60; k++) {
      a += (r() - 0.5) * 0.7;
      x += Math.cos(a) * 14;
      y += Math.sin(a) * 14;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1;
  g.shadowBlur = 0;
  return finish(c);
}

/** Old hand-made brick for the 1928 hearth. */
export function brick() {
  const [c, g] = canvas(512);
  const r = rng(5);
  g.fillStyle = '#2a1d16';
  g.fillRect(0, 0, 512, 512);
  const bw = 64;
  const bh = 24;
  for (let row = 0; row < 512 / bh + 1; row++) {
    const off = row % 2 ? bw / 2 : 0;
    for (let col = -1; col < 512 / bw + 1; col++) {
      const l = 22 + r() * 14;
      g.fillStyle = `hsl(${10 + r() * 12}, ${35 + r() * 20}%, ${l}%)`;
      g.fillRect(col * bw + off + 2, row * bh + 2, bw - 4, bh - 4);
      g.fillStyle = `rgba(0,0,0,${r() * 0.25})`;
      g.fillRect(col * bw + off + 2, row * bh + bh * 0.55, bw - 4, bh * 0.45 - 2);
    }
  }
  return finish(c, [2.4, 1.1]);
}

/** Lime plaster — faint mottling so long walls do not read as flat colour. */
export function plaster() {
  const [c, g] = canvas(512);
  const r = rng(3);
  g.fillStyle = '#3d3129';
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = r() > 0.5 ? 'rgba(255,235,210,0.025)' : 'rgba(0,0,0,0.04)';
    g.beginPath();
    g.arc(r() * 512, r() * 512, 4 + r() * 30, 0, Math.PI * 2);
    g.fill();
  }
  return finish(c, [6, 1]);
}

/** Soft round light pool, used for lamplight and table status glows. */
export function glow() {
  const [c, g] = canvas(256);
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.45, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.7, 'rgba(255,255,255,0.35)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
