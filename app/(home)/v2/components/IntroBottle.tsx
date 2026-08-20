"use client";

import { ContactShadows, Environment } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { scaleFor } from "../lib/family";
import SparklingBottle3D from "./SparklingBottle3D";

/* Scroll-driven Intro stage — film climb, then clone-and-fan into the size ladder.

   `--spin` / `--fan` are set on the pin by Intro's useScrub and inherited here.
   Camera is pulled back so a full-height bottle fits in the pin (the heel-pivoted
   mesh is ~4.5 units tall — too tall for fov 28 at z≈6.5). */

const CAM = new THREE.Vector3(0.2, -0.05, 9.4);
const LOOK = new THREE.Vector3(0.15, -0.15, 0);
const HERO_X = 0.45;
/* Heel positions — BottleAtHeel puts the heel at the group origin. */
const Y_START = -5.2;
const FLOOR_Y = -2.05;
/* Small enough that heel→cap stays inside the frustum with headroom under the nav. */
const HERO_SCALE = 0.82;
const HEEL_TO_CENTER = (4.2 + 0.26) / 2 - 0.05;

const MLS = [750, 500, 330] as const;
const STAGGER = [0, 0.12, 0.24] as const;
/* Left-third ladder, largest → smallest, shared floor. */
const TARGETS_X = [-1.85, -0.95, -0.2] as const;

function readVar(host: HTMLElement | null, name: string): number {
  if (!host) return 0;
  const n = Number.parseFloat(getComputedStyle(host).getPropertyValue(name).trim());
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function segmentRise(rise: number, d: number) {
  const v = (rise - d) * 2.4;
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function BottleAtHeel() {
  return (
    <group position={[0, HEEL_TO_CENTER, 0]}>
      <SparklingBottle3D />
    </group>
  );
}

function FrameCamera() {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.copy(CAM);
    camera.lookAt(LOOK);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function ScrubLadder({ host }: { host: RefObject<HTMLDivElement | null> }) {
  const bottles = useRef<Array<THREE.Group | null>>([null, null, null]);
  const shadow = useRef<THREE.Group>(null);

  useFrame(() => {
    const el = host.current;
    const spin = readVar(el, "--spin");
    const rise = readVar(el, "--fan");
    const spinE = smooth(spin);

    const heroY = Y_START + (FLOOR_Y - Y_START) * spinE;
    const heroYaw = spinE * Math.PI * 2;
    const fanning = rise > 0.001;

    for (let i = 0; i < 3; i++) {
      const g = bottles.current[i];
      if (!g) continue;

      const v = smooth(segmentRise(rise, STAGGER[i]));
      const tx = TARGETS_X[i];
      const targetScale = HERO_SCALE * scaleFor(MLS[i]);

      if (!fanning) {
        g.position.set(HERO_X, heroY, 0);
        g.rotation.set(0, heroYaw, 0);
        g.scale.setScalar(HERO_SCALE);
        g.visible = i === 0;
        continue;
      }

      g.position.set(HERO_X + (tx - HERO_X) * v, FLOOR_Y, 0);
      g.rotation.set(0, heroYaw, 0);
      g.scale.setScalar(HERO_SCALE + (targetScale - HERO_SCALE) * v);
      g.visible = i === 0 || v > 0.02;
    }

    const sh = shadow.current;
    if (sh) {
      const midX = fanning ? HERO_X + (TARGETS_X[1] - HERO_X) * smooth(rise) : HERO_X;
      sh.position.x = midX;
      sh.position.y = FLOOR_Y - 0.02;
      sh.scale.setScalar(0.55 + spinE * 0.35 + rise * 0.4);
    }
  });

  return (
    <>
      {MLS.map((ml, i) => (
        <group
          key={ml}
          ref={(node) => {
            bottles.current[i] = node;
          }}
          position={[HERO_X, Y_START, 0]}
          scale={HERO_SCALE}
          visible={i === 0}
        >
          <BottleAtHeel />
        </group>
      ))}
      <group ref={shadow} position={[HERO_X, FLOOR_Y - 0.02, 0]}>
        <ContactShadows position={[0, 0, 0]} opacity={0.2} scale={12} blur={2.8} far={5} />
      </group>
    </>
  );
}

export default function IntroBottle() {
  const host = useRef<HTMLDivElement>(null);

  return (
    <div className="hsv-intro__bottle" ref={host} aria-hidden="true">
      <Canvas
        camera={{ position: [CAM.x, CAM.y, CAM.z], fov: 28, near: 0.1, far: 80 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ pointerEvents: "none" }}
      >
        <color attach="background" args={["#f7f8fa"]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 3]} intensity={1.15} />
        <directionalLight position={[-3.2, 2.4, -2.5]} intensity={0.35} />
        <FrameCamera />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ScrubLadder host={host} />
        </Suspense>
      </Canvas>
    </div>
  );
}
