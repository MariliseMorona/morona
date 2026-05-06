import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 100;
const MAX_DISTANCE = 30;
const MAX_CONNECTIONS_PER_NODE = 2;

export default function ParticlesNetwork() {
  const pointsRef = useRef();
  const linesRef = useRef();

  const connections = useRef([]);
  const connectionMap = useRef(new Map());
  const connectionCount = useRef(new Array(PARTICLE_COUNT).fill(0));

  // ======================
  // INIT PARTICLES
  // ======================
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = Math.random() * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, []);

  const linePositions = useMemo(
    () => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6),
    []
  );

  // ======================
  // TEXTURE
  // ======================
  const texture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.6)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
  }, []);

  // ======================
  // ANIMATION
  // ======================
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array;

    // ======================
    // DEPTH + PARALLAX
    // ======================
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;

      let x = pos[ix];
      let y = pos[ix + 1];
      let z = pos[ix + 2];

      // profundidade viva
      z += Math.sin(time * 0.3 + i) * 0.02;

      // normaliza z (-40 → 40)
      const depthNorm = (z + 40) / 80;

      // parallax (longe = move menos)
      const parallax = 1 - depthNorm;

      pos[ix] =
        x +
        (velocities[ix] + Math.sin(time + i) * 0.002) * parallax;

      pos[ix + 1] =
        y +
        (velocities[ix + 1] + Math.cos(time + i) * 0.002) * parallax;

      pos[ix + 2] = z;

      // bounce leve
      if (Math.abs(pos[ix]) > 40) velocities[ix] *= -1;
      if (Math.abs(pos[ix + 1]) > 40) velocities[ix + 1] *= -1;
      if (Math.abs(pos[ix + 2]) > 40) velocities[ix + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // ======================
    // CONNECTION SPAWN
    // ======================

    const spawnRate =
      1 + Math.floor((Math.sin(time * 0.3) + 1) * 2);

    for (let k = 0; k < spawnRate; k++) {
      const i = Math.floor(Math.random() * PARTICLE_COUNT);
      const j = Math.floor(Math.random() * PARTICLE_COUNT);

      if (i === j) continue;
      if (connectionCount.current[i] >= MAX_CONNECTIONS_PER_NODE) continue;
      if (connectionCount.current[j] >= MAX_CONNECTIONS_PER_NODE) continue;

      const key = i < j ? `${i}-${j}` : `${j}-${i}`;

      if (connectionMap.current.has(key)) continue;

      const dx = pos[i * 3] - pos[j * 3];
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2];

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < MAX_DISTANCE) {
        connections.current.push({
          i,
          j,
          progress: 0,
          life: 0.8 + Math.random() * 0.5,
          speed: 0.005 + Math.random() * 0.01,
          key,
        });

        connectionCount.current[i]++;
        connectionCount.current[j]++;

        connectionMap.current.set(key, true);
      }
    }

    // ======================
    // DRAW LINES (COM DEPTH)
    // ======================
    let index = 0;

    connections.current.forEach((c) => {
      c.progress += c.speed;
      c.life -= 0.003;

      if (c.progress > 1) c.progress = 1;

      const i = c.i;
      const j = c.j;

      const ax = pos[i * 3];
      const ay = pos[i * 3 + 1];
      const az = pos[i * 3 + 2];

      const bx = pos[j * 3];
      const by = pos[j * 3 + 1];
      const bz = pos[j * 3 + 2];

      const t = 1 - Math.pow(1 - c.progress, 2);

      const px = ax + (bx - ax) * t;
      const py = ay + (by - ay) * t;
      const pz = az + (bz - az) * t;

      // linha principal
      linePositions[index++] = ax;
      linePositions[index++] = ay;
      linePositions[index++] = az;

      linePositions[index++] = px;
      linePositions[index++] = py;
      linePositions[index++] = pz;

      // glow ponta
      const glowSize = 0.5;

      linePositions[index++] = px;
      linePositions[index++] = py;
      linePositions[index++] = pz;

      linePositions[index++] =
        px + (Math.random() - 0.5) * glowSize;
      linePositions[index++] =
        py + (Math.random() - 0.5) * glowSize;
      linePositions[index++] =
        pz + (Math.random() - 0.5) * glowSize;
    });

    linesRef.current.geometry.setDrawRange(0, index / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    // ======================
    // CLEANUP
    // ======================
    connections.current = connections.current.filter((c) => {
      if (c.life <= 0) {
        connectionMap.current.delete(c.key);

        connectionCount.current[c.i]--;
        connectionCount.current[c.j]--;

        return false;
      }
      return true;
    });
  });

  return (
    <>
      {/* PARTICLES */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          map={texture}
          color="#7dd3fc"
          size={1.2}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* LINES */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>

        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
        />
      </lineSegments>
    </>
  );
}
