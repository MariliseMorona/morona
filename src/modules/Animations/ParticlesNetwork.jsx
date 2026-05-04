import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 80;
const MAX_DISTANCE = 30;
const MAX_CONNECTIONS_PER_NODE = 4;

export default function ParticlesNetwork() {
  const pointsRef = useRef();
  const linesRef = useRef();

  const { mouse } = useThree();

  const connections = useRef([]);
  const connectionMap = useRef(new Map());

  const connectionCount = useRef(
    new Array(PARTICLE_COUNT).fill(0)
  );

  const activeNodes = useRef(new Set());
  const trunkNodes = useRef(new Set());

  // 🧠 NOVO
  const pulses = useRef([]);
  const lastMouse = useRef(new THREE.Vector3());

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

  useMemo(() => {
    for (let i = 0; i < 5; i++) {
      const node = Math.floor(Math.random() * PARTICLE_COUNT);
      activeNodes.current.add(node);
      trunkNodes.current.add(node);
    }
  }, []);

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

    const mouseVec = new THREE.Vector3(
      mouse.x * 50,
      mouse.y * 50,
      0
    );

    // ======================
    // 🧲 CRIA PULSO AO MOVER MOUSE
    // ======================
    const deltaMouse = mouseVec.distanceTo(lastMouse.current);

    if (deltaMouse > 5) {
      pulses.current.push({
        position: mouseVec.clone(),
        life: 1,
      });

      lastMouse.current.copy(mouseVec);
    }

    // ======================
    // MOVE PARTICLES + CAMPO
    // ======================
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let px = pos[i * 3];
      let py = pos[i * 3 + 1];

      const dxMouse = mouseVec.x - px;
      const dyMouse = mouseVec.y - py;

      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      const influenceRadius = 120; // 🔥 DOBRO
      const forceStrength = 0.04;  // 🔥 MAIS FORTE

      if (distMouse < influenceRadius) {
        const force = (1 - distMouse / influenceRadius) * forceStrength;

        velocities[i * 3] += dxMouse * force * 0.001;
        velocities[i * 3 + 1] += dyMouse * force * 0.001;
      }

      pos[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.002;
      pos[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time + i) * 0.002;
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      for (let j = 0; j < 3; j++) {
        if (Math.abs(pos[i * 3 + j]) > 40) {
          velocities[i * 3 + j] *= -1;
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // ======================
    // GROWTH
    // ======================
    const spawnRate = 2;

    for (let k = 0; k < spawnRate; k++) {
      const activeArray = Array.from(activeNodes.current);
      if (!activeArray.length) break;

      const i = activeArray[Math.floor(Math.random() * activeArray.length)];

      if (connectionCount.current[i] >= MAX_CONNECTIONS_PER_NODE)
        continue;

      for (let attempt = 0; attempt < 10; attempt++) {
        const j = Math.floor(Math.random() * PARTICLE_COUNT);
        if (i === j) continue;

        if (connectionCount.current[j] >= MAX_CONNECTIONS_PER_NODE)
          continue;

        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (connectionMap.current.has(key)) continue;

        const ax = pos[i * 3];
        const ay = pos[i * 3 + 1];

        const bx = pos[j * 3];
        const by = pos[j * 3 + 1];

        const directionalBias = bx - ax;
        if (directionalBias < 2) continue;

        const mouseDist = Math.hypot(bx - mouseVec.x, by - mouseVec.y);
        const towardMouse = mouseVec.x - ax;

        const dx = ax - bx;
        const dy = ay - by;
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (
          dist < MAX_DISTANCE &&
          directionalBias > 2 &&
          towardMouse > -5 &&
          mouseDist < 50
        ) {
          const isTrunk = trunkNodes.current.has(i);

          connections.current.push({
            i,
            j,
            progress: 0,
            life: 1,
            speed: isTrunk ? 0.008 : 0.004,
            strength: isTrunk ? 2.5 : 0.7,
            energy: 0, // 🧠
            key,
          });

          connectionMap.current.set(key, true);

          connectionCount.current[i]++;
          connectionCount.current[j]++;

          activeNodes.current.add(j);

          if (isTrunk && Math.random() > 0.1) {
            trunkNodes.current.add(j);
          }

          break;
        }
      }
    }

    // ======================
    // ⚡ PULSOS ATIVAM CONEXÕES
    // ======================
    pulses.current.forEach((p) => {
      connections.current.forEach((c) => {
        const ax = pos[c.i * 3];
        const ay = pos[c.i * 3 + 1];

        const dx = ax - p.position.x;
        const dy = ay - p.position.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          c.energy = Math.max(c.energy, 0.4);
        }
      });

      p.life -= 0.02;
    });

    pulses.current = pulses.current.filter((p) => p.life > 0);

    // ======================
    // DRAW
    // ======================
    let index = 0;

    connections.current.forEach((c) => {
      c.progress += c.speed * (1 + c.energy * 0.8);
      c.life -= 0.003;
      c.energy *= 0.92;

      if (c.progress > 1) c.progress = 1;

      const ax = pos[c.i * 3];
      const ay = pos[c.i * 3 + 1];
      const az = pos[c.i * 3 + 2];

      const bx = pos[c.j * 3];
      const by = pos[c.j * 3 + 1];
      const bz = pos[c.j * 3 + 2];

      const t = 1 - Math.pow(1 - c.progress, 2);

      const px = ax + (bx - ax) * t;
      const py = ay + (by - ay) * t;
      const pz = az + (bz - az) * t;

      const glowSize = (0.3 + c.energy * 0.6) * c.strength;

      // linha
      linePositions[index++] = ax;
      linePositions[index++] = ay;
      linePositions[index++] = az;

      linePositions[index++] = px;
      linePositions[index++] = py;
      linePositions[index++] = pz;

      // glow ponta
      linePositions[index++] = px;
      linePositions[index++] = py;
      linePositions[index++] = pz;

      linePositions[index++] = px + (Math.random() - 0.5) * glowSize;
      linePositions[index++] = py + (Math.random() - 0.5) * glowSize;
      linePositions[index++] = pz + (Math.random() - 0.5) * glowSize;
    });

    linesRef.current.geometry.setDrawRange(0, index / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    // CLEANUP
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
          color="#00aaff"
          size={0.8}
          transparent
          depthWrite={false}
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
          color="#00aaff"
          transparent
          opacity={0.25}
        />
      </lineSegments>
    </>
  );
}