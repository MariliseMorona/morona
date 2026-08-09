import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./rocketFooter.css";

/* =========================================================
 *  Helpers de interpolação e wireframe manual do foguete
 * ========================================================= */

const catmullRomKeyframes = (progress, values) => {
  const n = values.length;
  const scaled = Math.max(0, Math.min(1, progress)) * (n - 1);
  const i = Math.floor(scaled);
  const t = scaled - i;
  const p0 = values[Math.max(0, i - 1)];
  const p1 = values[i];
  const p2 = values[Math.min(n - 1, i + 1)];
  const p3 = values[Math.min(n - 1, i + 2)];
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
};

const circle = (radius, y, segments = 64) => {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
};

const outlineProfile = () => {
  const noseBaseY = 3.0;
  const noseHeight = 5.2;
  const noseTipY = noseBaseY + noseHeight;
  const noseBaseRadius = 1.3;
  const bodyRadius = 1.35;
  const bodyHeight = 2.6;
  const bodyTopY = noseBaseY;
  const bodyBotY = bodyTopY - bodyHeight;

  const pts = [
    new THREE.Vector3(0, noseTipY, 0),
    new THREE.Vector3(noseBaseRadius * 0.03, noseTipY - noseHeight * 0.22, 0),
    new THREE.Vector3(noseBaseRadius * 0.08, noseTipY - noseHeight * 0.38, 0),
    new THREE.Vector3(noseBaseRadius * 0.16, noseTipY - noseHeight * 0.5, 0),
    new THREE.Vector3(noseBaseRadius * 0.28, noseTipY - noseHeight * 0.6, 0),
    new THREE.Vector3(noseBaseRadius * 0.42, noseTipY - noseHeight * 0.7, 0),
    new THREE.Vector3(noseBaseRadius * 0.6, noseTipY - noseHeight * 0.79, 0),
    new THREE.Vector3(noseBaseRadius * 0.8, noseTipY - noseHeight * 0.87, 0),
    new THREE.Vector3(noseBaseRadius * 0.95, noseTipY - noseHeight * 0.94, 0),
    new THREE.Vector3(noseBaseRadius, noseBaseY, 0),
    new THREE.Vector3(1.48, noseBaseY - 0.04, 0),
    new THREE.Vector3(bodyRadius, bodyTopY - 0.1, 0),
    new THREE.Vector3(bodyRadius, bodyBotY + 0.1, 0),
    new THREE.Vector3(1.44, bodyBotY - 0.08, 0),
    new THREE.Vector3(1.35, bodyBotY - 0.1, 0),
    new THREE.Vector3(2.6, bodyBotY - 2.55, 0),
    new THREE.Vector3(1.35, bodyBotY - 1.9, 0),
    new THREE.Vector3(0, bodyBotY - 0.2, 0),
  ];
  const mirr = pts.map(p => new THREE.Vector3(-p.x, p.y, 0)).reverse();
  const fullPts = [...pts, ...mirr, pts[0].clone()];
  return new THREE.BufferGeometry().setFromPoints(fullPts);
};

const buildRocketWireParts = () => {
  const noseBaseY = 3.0;
  const noseBaseRadius = 1.3;
  const bodyRadius = 1.35;
  const bodyHeight = 2.6;
  const bodyTopY = noseBaseY;
  const bodyBotY = bodyTopY - bodyHeight;

  const noseBaseRing = circle(noseBaseRadius, noseBaseY, 56);

  const bodyTopRing = circle(bodyRadius, bodyTopY, 56);
  const bodyBotRing = circle(bodyRadius, bodyBotY, 56);
  const bodyMidRing = circle(bodyRadius, noseBaseY - bodyHeight / 2, 32);

  const windowOuterTorus = new THREE.TorusGeometry(0.62, 0.0001, 10, 48);
  const windowInnerTorus = new THREE.TorusGeometry(0.36, 0.0001, 10, 36);
  const windowFrameBig = circle(0.62, bodyTopY - 1.4, 48);
  const windowFrameSmall = circle(0.36, bodyTopY - 1.4, 32);
  windowFrameBig.rotateX(Math.PI / 2);
  windowFrameSmall.rotateX(Math.PI / 2);
  windowFrameBig.translate(0, bodyTopY - 1.4, bodyRadius + 0.01);
  windowFrameSmall.translate(0, bodyTopY - 1.4, bodyRadius + 0.01);

  const outline0 = outlineProfile();
  const outline1 = outlineProfile(); outline1.rotateY(Math.PI / 2);
  const outline2 = outlineProfile(); outline2.rotateY(Math.PI);
  const outline3 = outlineProfile(); outline3.rotateY(-Math.PI / 2);

  return [
    { geom: outline0, type: "line", accent: false },
    { geom: outline1, type: "line", accent: false },
    { geom: outline2, type: "line", accent: false },
    { geom: outline3, type: "line", accent: false },
    { geom: noseBaseRing, type: "line" },
    { geom: bodyTopRing, type: "line" },
    { geom: bodyMidRing, type: "line" },
    { geom: bodyBotRing, type: "line" },
    { geom: windowFrameBig, type: "line" },
    { geom: windowFrameSmall, type: "line", accent: true },
    { geom: windowOuterTorus, type: "edge", accent: true },
    { geom: windowInnerTorus, type: "edge", accent: true },
  ];
};

const ROCKET_LAYERS = [
  { z: -0.08, color: "#38bdf8", opacity: 0.5, scale: 1.01 },
  { z: 0.0, color: "#0ea5e9", opacity: 0.99, scale: 1.0 },
];

const ACCENT = "#e0f2fe";

/* =========================================================
 *  Componente 3D do foguete (R3F, wireframe manual)
 * ========================================================= */
const Rocket3D = () => {
  const tiltRef = useRef(null);
  const wireParts = useMemo(buildRocketWireParts, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = tiltRef.current;
    if (!g) return;
    const p = ((t % 7) / 7 + 1) % 1;
    g.rotation.x = (catmullRomKeyframes(p, [5, 3, 7, 2, 5]) * Math.PI) / 180;
    g.rotation.y = (catmullRomKeyframes(p, [-6, -2, 5, -3, -6]) * Math.PI) / 180;
    g.rotation.z = (catmullRomKeyframes(p, [-1.5, -0.5, 1.5, 0, -1.5]) * Math.PI) / 180;
    g.position.y = Math.sin(t * 1.3) * 0.015;
  });

  return (
    <group scale={[0.55, 0.55, 0.55]}>
      <group position={[0, -0.05, 0]}>
        <group rotation={[0, 0, -Math.PI / 2]}>
          <group ref={tiltRef}>
            {ROCKET_LAYERS.map((layer, li) => (
              <group
                key={li}
                position={[0, 0, layer.z]}
                scale={[layer.scale, layer.scale, layer.scale]}
              >
                {wireParts.map((p, pi) => {
                  const color = p.accent ? ACCENT : layer.color;
                  const opacity = p.accent ? Math.min(1, layer.opacity + 0.05) : layer.opacity;
                  if (p.type === "pair") {
                    return (
                      <lineSegments key={pi} geometry={p.geom}>
                        <lineBasicMaterial color={color} transparent opacity={opacity * 0.82} />
                      </lineSegments>
                    );
                  }
                  if (p.type === "edge") {
                    return (
                      <lineSegments key={pi} geometry={new THREE.EdgesGeometry(p.geom, 0)}>
                        <lineBasicMaterial color={color} transparent opacity={opacity} />
                      </lineSegments>
                    );
                  }
                  return (
                    <line key={pi} geometry={p.geom}>
                      <lineBasicMaterial color={color} transparent opacity={opacity} />
                    </line>
                  );
                })}
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
};

/* =========================================================
 *  Wrapper público: Canvas R3F + engine de voo (RAF)
 * ========================================================= */
export const RocketFooter = () => {
  const rocketRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const rocket = rocketRef.current;
    const track = trackRef.current;
    if (!rocket || !track) return undefined;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      rocket.style.left = "50%";
      rocket.style.top = "50%";
      rocket.style.transform = "translate3d(-50%, -50%, 0)";
      return undefined;
    }

    const state = {
      x: 0,
      y: 0,
      baseVx: 0,
      baseVy: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      dir: 1,
      scale: 1,
      phase: 0,
      wobAmpX: 0,
      wobAmpY: 0,
      wobFreqX: 0,
      wobFreqY: 0,
      burstTimer: 0,
      burstMul: 1,
      steepTimer: 0,
      steepDir: 0,
    };

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const rand = (min, max) => min + Math.random() * (max - min);
    const randSign = () => (Math.random() < 0.5 ? -1 : 1);

    let nextPlanAt = 0;
    let rafId = 0;
    let lastT = performance.now();

    const planNextLeg = () => {
      const rect = track.getBoundingClientRect();
      const rocketRect = rocket.getBoundingClientRect();
      const rocketW = rocketRect.width || 84;
      const rocketH = rocketRect.height || 84;

      const leftEdge = -rocketW * 1.0;
      const rightEdge = rect.width + rocketW * 1.0;
      const topLimit = clamp(rocketH * 0.2, 4, rect.height * 0.18);
      const bottomLimit = clamp(
        rect.height - rocketH * 0.55,
        rect.height * 0.55,
        rect.height - rocketH * 0.2
      );

      const startFromLeft = state.x <= leftEdge;
      const startFromRight = state.x >= rightEdge;

      let targetX;
      let targetY;

      if (startFromLeft) {
        targetX = rightEdge;
        targetY = rand(topLimit, bottomLimit);
        state.dir = 1;
      } else if (startFromRight) {
        targetX = leftEdge;
        targetY = rand(topLimit, bottomLimit);
        state.dir = -1;
      } else {
        const currentDir = state.dir || (Math.random() < 0.5 ? -1 : 1);
        state.dir = currentDir;
        targetX = currentDir > 0 ? rightEdge : leftEdge;
        targetY = rand(topLimit, bottomLimit);
      }

      const dx = targetX - state.x;
      const dy = targetY - state.y;
      const dist = Math.hypot(dx, dy) || 1;

      const speedMode = Math.random();
      let baseSpeed;
      if (speedMode < 0.22) {
        baseSpeed = rand(50, 90);
      } else if (speedMode < 0.8) {
        baseSpeed = rand(120, 200);
      } else {
        baseSpeed = rand(220, 340);
      }

      const speedScale = rect.width > 0 ? clamp(rect.width / 1000, 0.7, 1.35) : 1;
      const speed = baseSpeed * speedScale;

      state.baseVx = (dx / dist) * speed;
      state.baseVy = (dy / dist) * speed;
      state.vx = state.baseVx;
      state.vy = state.baseVy;

      state.scale = rand(0.85, 1.25);
      state.phase = rand(0, Math.PI * 2);

      state.wobAmpX = rand(6, 20) * randSign();
      state.wobAmpY = rand(14, 42) * randSign();
      state.wobFreqX = rand(0.35, 0.9);
      state.wobFreqY = rand(0.25, 0.75);

      state.burstTimer = rand(0.5, 2.0);
      state.burstMul = 1;

      state.steepTimer = rand(1.2, 3.5);
      state.steepDir = 0;

      const planWindow = rand(2200, 5200);
      nextPlanAt = lastT + planWindow;
    };

    const init = () => {
      const rect = track.getBoundingClientRect();
      const rocketRect = rocket.getBoundingClientRect();
      const rocketW = rocketRect.width || 84;
      state.x = -(rocketW * 1.1);
      state.y = rand(Math.max(12, rect.height * 0.1), Math.max(40, rect.height * 0.85));
      state.dir = 1;
      planNextLeg();
    };

    const step = (t) => {
      const dt = Math.min(48, t - lastT) / 1000;
      lastT = t;

      state.phase += dt * 4.5;

      state.burstTimer -= dt;
      if (state.burstTimer <= 0) {
        state.burstMul = state.burstMul > 1.15 ? rand(0.9, 1.1) : rand(1.25, 1.9);
        state.burstTimer = rand(0.8, 2.2);
      }

      state.steepTimer -= dt;
      if (state.steepTimer <= 0) {
        state.steepDir = Math.random() < 0.22 ? randSign() * rand(2.4, 5.5) : 0;
        state.steepTimer = rand(1.2, 3.0);
      }

      const wobX = Math.sin(state.phase * state.wobFreqX) * state.wobAmpX;
      const wobY = Math.cos(state.phase * state.wobFreqY) * state.wobAmpY;

      const effectiveVx = state.baseVx * state.burstMul + wobX;
      const effectiveVy = state.baseVy * state.burstMul + wobY + state.steepDir * 22;

      state.vx = state.vx + (effectiveVx - state.vx) * 0.22;
      state.vy = state.vy + (effectiveVy - state.vy) * 0.22;

      state.x += state.vx * dt;
      state.y += state.vy * dt;

      if (t >= nextPlanAt) planNextLeg();

      const rect = track.getBoundingClientRect();
      const rocketRect = rocket.getBoundingClientRect();
      const rocketW = rocketRect.width || 84;
      const rocketH = rocketRect.height || 84;
      const leftEdge = -rocketW * 0.9;
      const rightEdge = rect.width + rocketW * 0.9;
      const topLimit = -rocketH * 0.15;
      const bottomLimit = rect.height + rocketH * 0.2;

      if (state.dir > 0 && state.x > rightEdge) {
        state.x = leftEdge;
        state.y = rand(Math.max(10, rect.height * 0.08), Math.max(40, rect.height * 0.9));
        nextPlanAt = t + 600;
        planNextLeg();
      } else if (state.dir < 0 && state.x < leftEdge) {
        state.x = rightEdge;
        state.y = rand(Math.max(10, rect.height * 0.08), Math.max(40, rect.height * 0.9));
        nextPlanAt = t + 600;
        planNextLeg();
      }

      state.y = clamp(state.y, topLimit, bottomLimit);

      const desiredAngle =
        (Math.atan2(state.vy, Math.abs(state.vx)) * 180) / Math.PI;
      const smoothed = state.angle + (desiredAngle - state.angle) * 0.12;
      state.angle = smoothed;

      const flip = state.dir < 0 ? -1 : 1;
      const burstWarp = 1 + (state.burstMul - 1) * 0.35;
      rocket.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(
        2
      )}px, 0) rotate(${smoothed.toFixed(2)}deg) scaleX(${flip}) scale(${(
        state.scale * burstWarp
      ).toFixed(3)})`;

      rafId = requestAnimationFrame(step);
    };

    init();
    rafId = requestAnimationFrame(step);

    const handleResize = () => {
      planNextLeg();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="rocket-footer-track rocket-footer-track--wide"
      ref={trackRef}
      aria-hidden="true"
    >
      <div className="rocket-footer-rocket" ref={rocketRef}>
        <Canvas
          className="rocket-footer-canvas"
          gl={{ antialias: true, alpha: true }}
          frameloop="always"
          dpr={[1, 2]}
          camera={{ position: [0, 0, 14], fov: 28, near: 0.1, far: 100 }}
        >
          <ambientLight intensity={0.3} />
          <Rocket3D />
        </Canvas>

        <div className="rocket-trail">
          <div className="rocket-trail-core" />
          <div className="rocket-trail-soft" />
        </div>

        <div className="rocket-smoke">
          <span className="rocket-puff puff-1" />
          <span className="rocket-puff puff-2" />
          <span className="rocket-puff puff-3" />
          <span className="rocket-puff puff-4" />
        </div>
      </div>
    </div>
  );
};

export default RocketFooter;
