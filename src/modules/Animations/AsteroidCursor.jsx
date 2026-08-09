import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./asteroidCursor.css";

const lerp = (a, b, t) => a + (b - a) * t;

const buildAsteroidWire = () => {
  const R = 1.0;
  const seedPoints = [];
  const radialNoise = [0.18, -0.12, 0.22, -0.08, 0.1, -0.2, 0.14, -0.05, 0.17, -0.16, 0.09, -0.21];
  const rings = 10;
  const segs = 16;

  for (let r = 0; r <= rings; r++) {
    const phi = (r / rings) * Math.PI;
    const ringNoise = radialNoise[r % radialNoise.length] * 0.35;
    for (let s = 0; s <= segs; s++) {
      const theta = (s / segs) * Math.PI * 2;
      const segNoise = ((Math.sin(theta * 3 + r * 1.7) + Math.cos(theta * 5 - r * 0.9)) / 2) * 0.18;
      const rad = R + ringNoise + segNoise;
      const sp = Math.sin(phi);
      seedPoints.push(
        new THREE.Vector3(
          Math.cos(theta) * sp * rad,
          Math.cos(phi) * rad,
          Math.sin(theta) * sp * rad
        )
      );
    }
  }

  const allLines = [];

  for (let r = 0; r <= rings; r++) {
    const ringPts = [];
    for (let s = 0; s <= segs; s++) {
      ringPts.push(seedPoints[r * (segs + 1) + s]);
    }
    allLines.push(new THREE.BufferGeometry().setFromPoints(ringPts));
  }

  for (let s = 0; s <= segs; s += 2) {
    const segPts = [];
    for (let r = 0; r <= rings; r++) {
      segPts.push(seedPoints[r * (segs + 1) + s]);
    }
    allLines.push(new THREE.BufferGeometry().setFromPoints(segPts));
  }

  const craterCenters = [
    [0.55, 0.35, 0.85, 0.22],
    [-0.7, 0.1, -0.65, 0.17],
    [0.2, -0.8, -0.55, 0.14],
    [-0.1, 0.9, 0.4, 0.12],
    [0.9, -0.4, 0.15, 0.1],
  ];

  craterCenters.forEach(([cx, cy, cz, cr]) => {
    const len = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1;
    const nx = cx / len, ny = cy / len, nz = cz / len;
    const nvec = new THREE.Vector3(nx, ny, nz);
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(up, nvec).normalize();
    const fwd = new THREE.Vector3().crossVectors(nvec, right).normalize();
    const pts = [];
    const segs2 = 20;
    for (let i = 0; i <= segs2; i++) {
      const t = (i / segs2) * Math.PI * 2;
      const rr = cr * (0.85 + 0.15 * Math.sin(t * 5));
      const p = new THREE.Vector3()
        .copy(nvec)
        .multiplyScalar(R * 0.98)
        .addScaledVector(right, Math.cos(t) * rr)
        .addScaledVector(fwd, Math.sin(t) * rr);
      pts.push(p);
    }
    allLines.push(new THREE.BufferGeometry().setFromPoints(pts));
  });

  const crackStarts = [
    [0.6, -0.2, 0.75, 4],
    [-0.5, 0.55, -0.65, 3],
    [0.1, -0.9, 0.4, 3],
  ];
  crackStarts.forEach(([sx, sy, sz, pts]) => {
    const crack = [];
    for (let i = 0; i < pts; i++) {
      const t = i / (pts - 1);
      const px = sx + (Math.random() - 0.5) * 0.25 * t;
      const py = sy + (Math.random() - 0.5) * 0.25 * t;
      const pz = sz + (Math.random() - 0.5) * 0.25 * t;
      const len = Math.sqrt(px * px + py * py + pz * pz);
      const k = R * 0.95 / (len || 1);
      crack.push(new THREE.Vector3(px * k, py * k, pz * k));
    }
    allLines.push(new THREE.BufferGeometry().setFromPoints(crack));
  });

  return allLines;
};

const ASTEROID_PARTS = buildAsteroidWire();

const ASTEROID_LAYERS = [
  { z: -0.06, color: "#38bdf8", opacity: 0.45, scale: 1.012 },
  { z: 0.0, color: "#0ea5e9", opacity: 0.98, scale: 1.0 },
];

const Asteroid3D = () => {
  const grp = useRef(null);
  useFrame((_, dt) => {
    const g = grp.current;
    if (!g) return;
    g.rotation.x += dt * 0.35;
    g.rotation.y += dt * 0.55;
    g.rotation.z += dt * 0.22;
  });
  return (
    <group scale={[0.7, 0.7, 0.7]}>
      <group ref={grp}>
        {ASTEROID_LAYERS.map((layer, li) => (
          <group
            key={li}
            position={[0, 0, layer.z]}
            scale={[layer.scale, layer.scale, layer.scale]}
          >
            {ASTEROID_PARTS.map((geom, pi) => (
              <line key={pi} geometry={geom}>
                <lineBasicMaterial
                  color={layer.color}
                  transparent
                  opacity={layer.opacity}
                />
              </line>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
};

export const AsteroidCursor = () => {
  const wrapRef = useRef(null);
  const targetRef = useRef({ x: -9999, y: -9999, down: false, press: 0 });
  const currentRef = useRef({ x: -9999, y: -9999, scale: 1, glow: 0 });

  useEffect(() => {
    const onMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (currentRef.current.x < -9000) {
        currentRef.current.x = e.clientX;
        currentRef.current.y = e.clientY;
      }
    };
    const onDown = () => {
      targetRef.current.down = true;
      targetRef.current.press = 1;
    };
    const onUp = () => {
      targetRef.current.down = false;
    };
    const onLeave = () => {
      targetRef.current.x = -9999;
      targetRef.current.y = -9999;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });

    let raf = 0;
    const step = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      c.x = lerp(c.x, t.x, 0.2);
      c.y = lerp(c.y, t.y, 0.2);
      t.press = lerp(t.press, t.down ? 1 : 0, 0.22);
      c.scale = lerp(c.scale, 1 - t.press * 0.35, 0.22);
      c.glow = lerp(c.glow, t.down ? 1 : 0.05, 0.18);

      const el = wrapRef.current;
      if (el) {
        el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%) scale(${c.scale})`;
        const g = c.glow;
        el.style.setProperty(
          "--glow-shadow",
          `0 0 ${10 + g * 30}px rgba(14,165,233,${0.35 + g * 0.55}), 0 0 ${22 + g * 50}px rgba(56,189,248,${0.22 + g * 0.4})`
        );
        el.style.opacity = (t.x < -9000 ? 0 : 1).toString();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="asteroid-cursor-wrap"
      ref={wrapRef}
      aria-hidden="true"
    >
      <Canvas
        className="asteroid-cursor-canvas"
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.4], fov: 42, near: 0.1, far: 100 }}
      >
        <Asteroid3D />
      </Canvas>
    </div>
  );
};

export default AsteroidCursor;
