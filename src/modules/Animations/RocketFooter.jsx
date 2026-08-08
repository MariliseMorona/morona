import { useEffect, useRef } from "react";
import "./rocketFooter.css";

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
    <div className="rocket-footer-track rocket-footer-track--wide" ref={trackRef} aria-hidden="true">
      <div className="rocket-footer-sky">
        {Array.from({ length: 34 }).map((_, i) => (
          <span
            key={i}
            className={`rocket-star rocket-star-${(i % 5) + 1}`}
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 17) % 100}%`,
              animationDelay: `${(i % 7) * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="rocket-footer-rocket" ref={rocketRef}>
        <svg
          viewBox="0 0 120 120"
          className="rocket-footer-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rocketBody" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="60%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="rocketWindow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="rocketFin" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <radialGradient id="rocketFlame" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="80%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g>
            <path
              d="M60 10 C74 28 80 48 80 70 L80 86 L40 86 L40 70 C40 48 46 28 60 10 Z"
              fill="url(#rocketBody)"
              stroke="#bae6fd"
              strokeWidth="1.2"
            />
            <path
              d="M60 6 C74 26 80 46 80 68 L40 68 C40 46 46 26 60 6 Z"
              fill="#e0f2fe"
              opacity="0.35"
            />

            <circle cx="60" cy="52" r="9" fill="url(#rocketWindow)" />
            <circle cx="60" cy="52" r="9" fill="none" stroke="#0369a1" strokeWidth="1.4" />
            <path d="M56 48 C57 50 59 51 60 51" stroke="#fff7ed" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            <path
              d="M40 82 L24 104 L40 98 Z"
              fill="url(#rocketFin)"
              stroke="#1e3a8a"
              strokeWidth="1"
            />
            <path
              d="M80 82 L96 104 L80 98 Z"
              fill="url(#rocketFin)"
              stroke="#1e3a8a"
              strokeWidth="1"
            />

            <path
              d="M48 86 L42 96 L44 90 Z"
              fill="#38bdf8"
              opacity="0.85"
            />
            <path
              d="M72 86 L78 96 L76 90 Z"
              fill="#38bdf8"
              opacity="0.85"
            />

            <g className="rocket-flames">
              <ellipse cx="52" cy="96" rx="6" ry="14" fill="url(#rocketFlame)">
                <animate
                  attributeName="ry"
                  values="14;18;16;20;14"
                  dur="0.45s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0.85;0.95;0.9;1"
                  dur="0.45s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <ellipse cx="60" cy="100" rx="8" ry="18" fill="url(#rocketFlame)">
                <animate
                  attributeName="ry"
                  values="18;22;20;24;18"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <ellipse cx="68" cy="96" rx="6" ry="14" fill="url(#rocketFlame)">
                <animate
                  attributeName="ry"
                  values="14;20;16;18;14"
                  dur="0.55s"
                  repeatCount="indefinite"
                />
              </ellipse>
            </g>

            <g stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
              <path d="M50 30 C54 42 56 50 56 56" fill="none" />
              <path d="M70 30 C66 42 64 50 64 56" fill="none" />
            </g>
          </g>
        </svg>

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
