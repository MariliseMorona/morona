import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const LEAF_COUNT = 25;

export default function FallingLeaf() {
  const groupRef = useRef();

  // largura orgânica assimétrica
  const getLeafWidth = (t, side) => {
    const base = Math.sin(t * Math.PI);

    const sideMultiplier =
      side === "left"
        ? 1.08 + Math.sin(t * 5) * 0.04
        : 0.92 + Math.cos(t * 4) * 0.05;

    const serration =
      Math.sin(t * Math.PI * 17) * 0.06 +
      Math.sin(t * Math.PI * 31) * 0.025;

    const organicNoise =
      Math.sin(t * 2.3) * 0.08 +
      Math.cos(t * 6.1) * 0.03;

    return (
      base * 1.15 * sideMultiplier +
      serration +
      organicNoise
    );
  };

  // geometria da folha
  const geometries = useMemo(() => {
    // contorno
    const contourPoints = [];
    const segments = 60;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;

      const width = getLeafWidth(t, "left");

      const offsetX =
        Math.sin(t * 2.8) * 0.12;

      const y =
        t * 3 -
        1.5 +
        Math.sin(t * 4) * 0.05;

      contourPoints.push(
        new THREE.Vector3(
          -width + offsetX,
          y,
          0
        )
      );
    }

    for (let i = segments; i >= 0; i--) {
      const t = i / segments;

      const width = getLeafWidth(t, "right");

      const offsetX =
        Math.sin(t * 2.8) * 0.12;

      const y =
        t * 3 -
        1.5 +
        Math.sin(t * 4) * 0.05;

      contourPoints.push(
        new THREE.Vector3(
          width + offsetX,
          y,
          0
        )
      );
    }

    const contourGeometry =
      new THREE.BufferGeometry().setFromPoints(
        contourPoints
      );

    // nervura central
    const centerCurve =
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.5, 0),

        new THREE.Vector3(
          -0.03,
          -0.8,
          0
        ),

        new THREE.Vector3(
          0.06,
          0.2,
          0
        ),

        new THREE.Vector3(
          -0.02,
          1.3,
          0
        ),
      ]);

    const centerGeometry =
      new THREE.BufferGeometry().setFromPoints(
        centerCurve.getPoints(50)
      );

    // pedúnculo
    const peduncleCurve =
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, -1.5, 0),

        new THREE.Vector3(
          0.12,
          -1.95,
          0
        ),

        new THREE.Vector3(
          -0.18,
          -2.4,
          0
        )
      );

    const peduncleGeometry =
      new THREE.BufferGeometry().setFromPoints(
        peduncleCurve.getPoints(30)
      );

    // nervuras laterais
    const sideVeins = [];

    for (let i = 0; i < 7; i++) {
      const y = -1.1 + i * 0.38;

      const t = (y + 1.5) / 3;

      const leftWidth =
        getLeafWidth(t, "left") - 0.15;

      const rightWidth =
        getLeafWidth(t, "right") - 0.15;

      const randomCurve =
        Math.sin(i * 1.7) * 0.08;

      const leftCurve =
        new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, y, 0),

          new THREE.Vector3(
            -leftWidth * 0.45,
            y + 0.08 + randomCurve,
            0
          ),

          new THREE.Vector3(
            -leftWidth,
            y + 0.24,
            0
          )
        );

      const rightCurve =
        new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, y, 0),

          new THREE.Vector3(
            rightWidth * 0.45,
            y + 0.12 - randomCurve,
            0
          ),

          new THREE.Vector3(
            rightWidth,
            y + 0.2,
            0
          )
        );

      sideVeins.push(
        new THREE.BufferGeometry().setFromPoints(
          leftCurve.getPoints(20)
        )
      );

      sideVeins.push(
        new THREE.BufferGeometry().setFromPoints(
          rightCurve.getPoints(20)
        )
      );
    }

    return {
      contourGeometry,
      centerGeometry,
      peduncleGeometry,
      sideVeins,
    };
  }, []);

  // folhas
  const leaves = useMemo(() => {
    return Array.from({ length: LEAF_COUNT }).map(
      () => ({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 25,
          Math.random() * 20,
          (Math.random() - 0.5) * 12
        ),

        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),

        speed: 0.01 + Math.random() * 0.025,

        drift: 0.3 + Math.random() * 1.4,

        scale: 0.12 + Math.random() * 0.18,

        offset: Math.random() * 100,
      })
    );
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (!groupRef.current) return;

    groupRef.current.children.forEach(
      (leafGroup, index) => {
        const data = leaves[index];

        data.position.y -= data.speed;

        // vento
        data.position.x +=
          Math.sin(
            t * 0.7 + data.offset
          ) *
          0.015 *
          data.drift;

        data.position.z +=
          Math.cos(
            t * 0.5 + data.offset
          ) *
          0.006 *
          data.drift;

        leafGroup.position.x =
          data.position.x +
          Math.sin(
            t * 1.6 + data.offset
          ) *
            0.6;

        leafGroup.position.y =
          data.position.y;

        leafGroup.position.z =
          data.position.z;

        // rotação natural
        leafGroup.rotation.z =
          Math.sin(
            t * 2.2 + data.offset
          ) * 1.2;

        leafGroup.rotation.x =
          Math.cos(
            t * 1.5 + data.offset
          ) * 0.45;

        leafGroup.rotation.y =
          Math.sin(
            t * 1.1 + data.offset
          ) * 0.55;

        // reset
        if (data.position.y < -12) {
          data.position.y =
            12 + Math.random() * 10;

          data.position.x =
            (Math.random() - 0.5) * 25;

          data.position.z =
            (Math.random() - 0.5) * 12;
        }
      }
    );
  });

  return (
    <group ref={groupRef}>
      {leaves.map((leaf, index) => (
        <group
          key={index}
          position={leaf.position}
          rotation={leaf.rotation}
          scale={leaf.scale}
        >
          {/* contorno */}
          <line
            geometry={
              geometries.contourGeometry
            }
          >
            <lineBasicMaterial
              color="#7fbf4d"
            />
          </line>

          {/* nervura central */}
          <line
            geometry={
              geometries.centerGeometry
            }
          >
            <lineBasicMaterial
              color="#7fbf4d"
            />
          </line>

          {/* nervuras laterais */}
          {geometries.sideVeins.map(
            (geometry, veinIndex) => (
              <line
                key={veinIndex}
                geometry={geometry}
              >
                <lineBasicMaterial
                  color="#b8d89a"
                  transparent
                  opacity={0.65}
                />
              </line>
            )
          )}

          {/* pedúnculo */}
          <line
            geometry={
              geometries.peduncleGeometry
            }
          >
            <lineBasicMaterial
              color="#7a4a21"
            />
          </line>
        </group>
      ))}
    </group>
  );
}