import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 70;
const MAX_DISTANCE = 42;
const MAX_CONNECTIONS_PER_NODE = 3;

export default function ParticlesNetwork() {
  const pointsRef = useRef();
  const linesRef = useRef();

  const connections = useRef([]);
  const connectionMap = useRef(new Map());
  const connectionCount = useRef(new Array(PARTICLE_COUNT).fill(0));

  const starMagnitudes = useMemo(() => {
    const m = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = Math.random();
      if (r < 0.08) m[i] = 3;
      else if (r < 0.28) m[i] = 2.2;
      else if (r < 0.6) m[i] = 1.5;
      else m[i] = 1;
    }
    return m;
  }, []);

  const maxConnectionsByMagnitude = useMemo(() => {
    const m = new Uint8Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const mag = starMagnitudes[i];
      if (mag >= 2.2) m[i] = Math.max(MAX_CONNECTIONS_PER_NODE + 2, 5);
      else if (mag >= 1.5) m[i] = MAX_CONNECTIONS_PER_NODE + 1;
      else m[i] = MAX_CONNECTIONS_PER_NODE;
    }
    return m;
  }, [starMagnitudes]);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.35) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      velocities[i * 3] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    return { positions, velocities };
  }, []);

  const basePositions = useMemo(
    () => new Float32Array(positions),
    [positions]
  );

  const linePositions = useMemo(
    () => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6),
    []
  );

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

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array;

    const rotY = time * 0.012;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const rotX = Math.sin(time * 0.008) * 0.12;
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;

      let x = basePositions[ix];
      let y = basePositions[ix + 1];
      let z = basePositions[ix + 2];

      x += Math.sin(time * 0.05 + i * 0.13) * 0.15;
      y += Math.cos(time * 0.045 + i * 0.17) * 0.15;
      z += Math.sin(time * 0.06 + i * 0.11) * 0.1;

      x += velocities[ix] * 0.25;
      y += velocities[ix + 1] * 0.25;
      z += velocities[ix + 2] * 0.25;

      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      pos[ix] = x1;
      pos[ix + 1] = y1;
      pos[ix + 2] = z2;

      if (Math.abs(basePositions[ix]) > 40) velocities[ix] *= -1;
      if (Math.abs(basePositions[ix + 1]) > 40) velocities[ix + 1] *= -1;
      if (Math.abs(basePositions[ix + 2]) > 40) velocities[ix + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    const spawnAttempts = Math.random() < 0.55 ? 1 : 0;

    for (let k = 0; k < spawnAttempts; k++) {
      const candidates = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (connectionCount.current[i] < maxConnectionsByMagnitude[i]) {
          candidates.push(i);
        }
      }
      if (candidates.length < 2) break;

      const i = candidates[Math.floor(Math.random() * candidates.length)];

      let bestJ = -1;
      let bestDist = MAX_DISTANCE;

      for (let j = 0; j < PARTICLE_COUNT; j++) {
        if (j === i) continue;
        if (connectionCount.current[j] >= maxConnectionsByMagnitude[j]) continue;

        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (connectionMap.current.has(key)) continue;

        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < bestDist) {
          bestDist = dist;
          bestJ = j;
        }
      }

      if (bestJ === -1) continue;

      const j = bestJ;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      const magAvg = (starMagnitudes[i] + starMagnitudes[j]) * 0.5;

      connections.current.push({
        i,
        j,
        progress: 0,
        life: 3.2 + Math.random() * 2.4 + magAvg * 0.8,
        speed: 0.0022 + Math.random() * 0.0018 + 0.0006 * (4 - magAvg),
        key,
      });

      connectionCount.current[i]++;
      connectionCount.current[j]++;
      connectionMap.current.set(key, true);
    }

    let index = 0;

    connections.current.forEach((c) => {
      c.progress += c.speed;
      c.life -= 0.0012;

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

      linePositions[index++] = ax;
      linePositions[index++] = ay;
      linePositions[index++] = az;

      linePositions[index++] = px;
      linePositions[index++] = py;
      linePositions[index++] = pz;

      const headOffset = 0.08;
      const dxh = bx - ax;
      const dyh = by - ay;
      const dzh = bz - az;
      const lenh = Math.sqrt(dxh * dxh + dyh * dyh + dzh * dzh) || 1;

      linePositions[index++] = px;
      linePositions[index++] = py;
      linePositions[index++] = pz;

      linePositions[index++] = px + (dxh / lenh) * headOffset;
      linePositions[index++] = py + (dyh / lenh) * headOffset;
      linePositions[index++] = pz + (dzh / lenh) * headOffset;
    });

    linesRef.current.geometry.setDrawRange(0, index / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;

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
