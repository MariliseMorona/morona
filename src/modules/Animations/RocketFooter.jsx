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
      <div className="rocket-footer-rocket" ref={rocketRef}>
        <svg
          viewBox="0 0 120 120"
          className="rocket-footer-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rocketStroke" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="rocketGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="rocketThrust" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#7dd3fc" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g filter="url(#rocketGlow)">
            <g className="rocket-depth rocket-depth-back" opacity="0.28">
              <path
                d="M60 10 C74 28 80 48 80 70 L80 86 L40 86 L40 70 C40 48 46 28 60 10 Z"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.2"
                strokeLinejoin="round"
                transform="translate(-0.9, 1.2)"
              />
              <path
                d="M40 82 L24 104 L40 98 Z"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.0"
                strokeLinejoin="round"
                transform="translate(-0.8, 1.0)"
              />
              <path
                d="M80 82 L96 104 L80 98 Z"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.0"
                strokeLinejoin="round"
                transform="translate(-0.8, 1.0)"
              />
              <circle
                cx="60"
                cy="52"
                r="9"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.0"
                transform="translate(-0.8, 1.0)"
              />
            </g>

            <g className="rocket-depth rocket-depth-mid" opacity="0.5">
              <path
                d="M60 10 C74 28 80 48 80 70 L80 86 L40 86 L40 70 C40 48 46 28 60 10 Z"
                fill="none"
                stroke="url(#rocketStroke)"
                strokeWidth="1.8"
                strokeLinejoin="round"
                transform="translate(-0.4, 0.55)"
              />
              <path
                d="M40 82 L24 104 L40 98 Z"
                fill="none"
                stroke="url(#rocketStroke)"
                strokeWidth="1.6"
                strokeLinejoin="round"
                transform="translate(-0.35, 0.5)"
              />
              <path
                d="M80 82 L96 104 L80 98 Z"
                fill="none"
                stroke="url(#rocketStroke)"
                strokeWidth="1.6"
                strokeLinejoin="round"
                transform="translate(-0.35, 0.5)"
              />
              <circle
                cx="60"
                cy="52"
                r="9"
                fill="none"
                stroke="url(#rocketStroke)"
                strokeWidth="1.6"
                transform="translate(-0.35, 0.5)"
              />
            </g>

            <g
              className="rocket-outline"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.96"
            >
              <path
                d="M60 10 C74 28 80 48 80 70 L80 86 L40 86 L40 70 C40 48 46 28 60 10 Z"
                stroke="url(#rocketStroke)"
                strokeWidth="1.2"
              />
              <path
                d="M60 22 C70 36 74 52 74 70 L74 80 L46 80 L46 70 C46 52 50 36 60 22 Z"
                stroke="#7dd3fc"
                strokeWidth="0.9"
                opacity="0.55"
              />
              <path
                d="M60 6 C74 26 80 46 80 68 L40 68 C40 46 46 26 60 6 Z"
                stroke="#e0f2fe"
                strokeWidth="0.7"
                opacity="0.45"
              />

              <path
                d="M40 82 L24 104 L40 98 Z"
                stroke="url(#rocketStroke)"
                strokeWidth="1.2"
              />
              <path
                d="M80 82 L96 104 L80 98 Z"
                stroke="url(#rocketStroke)"
                strokeWidth="1.2"
              />

              <path
                d="M48 86 L42 96 L44 90 Z"
                stroke="#7dd3fc"
                strokeWidth="0.9"
              />
              <path
                d="M72 86 L78 96 L76 90 Z"
                stroke="#7dd3fc"
                strokeWidth="0.9"
              />

              <circle
                cx="60"
                cy="52"
                r="9"
                stroke="url(#rocketStroke)"
                strokeWidth="1.2"
              />
              <circle
                cx="60"
                cy="52"
                r="5.4"
                stroke="#e0f2fe"
                strokeWidth="0.7"
                opacity="0.55"
              />
              <path
                d="M56 48 C57 50 59 51 60 51"
                stroke="#e0f2fe"
                strokeWidth="0.7"
                opacity="0.75"
              />

              <path
                d="M50 30 C54 42 56 50 56 56"
                stroke="#bae6fd"
                strokeWidth="0.8"
                opacity="0.75"
              />
              <path
                d="M70 30 C66 42 64 50 64 56"
                stroke="#bae6fd"
                strokeWidth="0.8"
                opacity="0.75"
              />
            </g>

            <g className="rocket-flames" opacity="0.82">
              <path
                d="M52 96 C50 112 48 116 52 118 C54 116 54 110 54 100 Z"
                fill="url(#rocketThrust)"
                stroke="none"
              />
              <path
                d="M60 100 C57 120 57 124 60 126 C63 124 63 118 62 104 Z"
                fill="url(#rocketThrust)"
                stroke="none"
              />
              <path
                d="M68 96 C70 112 72 116 68 118 C66 116 66 110 66 100 Z"
                fill="url(#rocketThrust)"
                stroke="none"
              />
              <path
                d="M50 94 C46 108 44 114 50 118"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.8"
              >
                <animate
                  attributeName="d"
                  values="M50 94 C46 108 44 114 50 118;M50 94 C46 112 44 118 50 122;M50 94 C46 108 44 114 50 118"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M70 94 C74 108 76 114 70 118"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.8"
              >
                <animate
                  attributeName="d"
                  values="M70 94 C74 108 76 114 70 118;M70 94 C74 112 76 118 70 122;M70 94 C74 108 76 114 70 118"
                  dur="0.55s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M60 96 C58 114 58 120 60 124"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.9"
              >
                <animate
                  attributeName="d"
                  values="M60 96 C58 114 58 120 60 124;M60 96 C58 120 58 126 60 130;M60 96 C58 114 58 120 60 124"
                  dur="0.45s"
                  repeatCount="indefinite"
                />
              </path>
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
