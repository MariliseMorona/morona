import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 100;
const MAX_DISTANCE = 30;

export default function ParticlesNetwork() {
  const pointsRef = useRef();
  const linesRef = useRef();

  const connections = useRef([]);
  const connectionMap = useRef(new Map());

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
    gradient.addColorStop(0.5, "rgba(255,255,255,0.6)");
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
    // MOVE PARTICLES (leve respiração)
    // ======================
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.002;
      pos[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time + i) * 0.002;
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // bounce leve
      for (let j = 0; j < 3; j++) {
        if (Math.abs(pos[i * 3 + j]) > 40) {
          velocities[i * 3 + j] *= -1;
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // ======================
    // CRIAÇÃO ORGÂNICA
    // ======================
    const spawnRate =
      1 + Math.floor((Math.sin(time * 0.3) + 1) * 2); // varia entre 2 e 8

    for (let k = 0; k < spawnRate; k++) {
      const i = Math.floor(Math.random() * PARTICLE_COUNT);
      const j = Math.floor(Math.random() * PARTICLE_COUNT);

      if (i === j) continue;

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
          life: 0.8 + Math.random() * 0.5, // vidas diferentes
          speed: 0.005 + Math.random() * 0.01, // velocidades diferentes
          key,
        });

        connectionMap.current.set(key, true);
      }
    }

    // ======================
    // UPDATE LINES
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

      // easing
      const t = 1 - Math.pow(1 - c.progress, 2);

      const px = ax + (bx - ax) * t;
      const py = ay + (by - ay) * t;
      const pz = az + (bz - az) * t;

      // linha
      linePositions[index++] = ax;
      linePositions[index++] = ay;
      linePositions[index++] = az;

      linePositions[index++] = px;
      linePositions[index++] = py;
      linePositions[index++] = pz;

      // glow ponta
      const glowSize = 0.6;

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
    // REMOVE DEAD
    // ======================
    connections.current = connections.current.filter((c) => {
      if (c.life <= 0) {
        connectionMap.current.delete(c.key);
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
          color="#00aaff"
          size={0.8}
          transparent
          depthWrite={false}
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
          color="#00aaff"
          transparent
          opacity={0.25}
        />
      </lineSegments>
    </>
  );
}