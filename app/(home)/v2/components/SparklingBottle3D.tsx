"use client";

import { useMemo } from "react";
import * as THREE from "three";

/* Procedural Himspring Sparkling bottle.

   Upper half: one transfer bead under the cap, then a straight conical taper
   (colinear anchors). Lower half: soft curve out of the wide heel into that
   same cone line — one Catmull-Rom so the mid join keeps continuous slope. */

const CAP_NAVY = "#15233a";
/* Dense lathe — close orbit zooms show faceting if this is too low. */
const SEGMENTS = 192;

const R = 0.56;
const H = 4.2;
const NECK_R = 0.152;
const BEAD_R = 0.165;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Catmull-Rom through (radius, height). Upper anchors sit on one line so the
    neck reads as a straight cone; lower anchors bend softly so the mid join
    stays G1 — no flat-to-slope crease. */
function sampleSideCurve(
  anchors: ReadonlyArray<readonly [number, number]>,
  steps: number,
): THREE.Vector2[] {
  const curve = new THREE.CatmullRomCurve3(
    anchors.map(([radius, y]) => new THREE.Vector3(radius, y, 0)),
    false,
    "catmullrom",
    0.25,
  );
  return curve.getPoints(steps).map((p) => new THREE.Vector2(p.x, p.y));
}

function outerProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];

  /* ---- heel / base (widest) ---- */
  pts.push(new THREE.Vector2(0, 0));
  pts.push(new THREE.Vector2(R * 0.9, 0));
  pts.push(new THREE.Vector2(R * 0.97, 0.04));
  pts.push(new THREE.Vector2(R, 0.1));

  const widestY = H * 0.1;
  pts.push(new THREE.Vector2(R, widestY));

  /* Cone line: constant slope from mid-body into the neck (reference upper half).
     Anchors on this line keep the silhouette straight up top. Soft anchors below
     ease out of the wide heel so the mid-body join never goes flat→steep. */
  const coneStartY = H * 0.48;
  const coneStartR = R * 0.9;
  const coneTopY = H * 0.915;
  const coneAt = (y: number) =>
    lerp(coneStartR, NECK_R, (y - coneStartY) / (coneTopY - coneStartY));

  const side = sampleSideCurve(
    [
      /* soft lower body — near-vertical out of the heel */
      [R, widestY],
      [R * 0.985, H * 0.22],
      [R * 0.955, H * 0.34],
      /* enter the cone line with matching direction */
      [coneStartR, coneStartY],
      /* colinear samples = straight truncated cone */
      [coneAt(H * 0.6), H * 0.6],
      [coneAt(H * 0.72), H * 0.72],
      [coneAt(H * 0.82), H * 0.82],
      [NECK_R, coneTopY],
    ],
    56,
  );

  for (let i = 1; i < side.length; i++) {
    const p = side[i];
    if (p) pts.push(p);
  }

  /* ---- finish: one transfer bead under the rim (reference has a single ring) ---- */
  const beadY = H * 0.95;
  pts.push(new THREE.Vector2(NECK_R, coneTopY + 0.01));

  pts.push(new THREE.Vector2(NECK_R, beadY - 0.01));
  pts.push(new THREE.Vector2(BEAD_R, beadY));
  pts.push(new THREE.Vector2(NECK_R * 1.02, beadY + 0.01));

  pts.push(new THREE.Vector2(NECK_R * 1.04, H * 0.98));
  pts.push(new THREE.Vector2(NECK_R * 1.03, H));
  pts.push(new THREE.Vector2(NECK_R * 0.9, H));

  return pts;
}

function HeelKnurl() {
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 0,
        roughness: 0.1,
        transmission: 1,
        thickness: 0.4,
        ior: 1.5,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const count = 72;
  const y = 0.05;
  const radius = R * 0.995;

  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh
            key={i}
            material={material}
            position={[Math.cos(a) * radius, y, Math.sin(a) * radius]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.009, 0.065, 0.012]} />
          </mesh>
        );
      })}
    </group>
  );
}

function KnurlBand({
  y,
  radius,
  height,
  material,
}: {
  y: number;
  radius: number;
  height: number;
  material: THREE.MeshStandardMaterial;
}) {
  const ridges = 64;
  return (
    <group position={[0, y, 0]}>
      <mesh material={material} castShadow>
        <cylinderGeometry args={[radius * 0.988, radius * 0.988, height, SEGMENTS]} />
      </mesh>
      {Array.from({ length: ridges }, (_, i) => {
        const a = (i / ridges) * Math.PI * 2;
        return (
          <mesh
            key={i}
            material={material}
            position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.006, height * 0.92, 0.01]} />
          </mesh>
        );
      })}
    </group>
  );
}

function Cap({ rimY }: { rimY: number }) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CAP_NAVY,
        roughness: 0.45,
        metalness: 0.32,
      }),
    [],
  );

  /* Reference cap: knurl at the top edge, two thread grooves, flat wider heel
     sitting flush on the glass — compact stack, not a tall tower. */
  const r = BEAD_R * 1.14;
  const top = rimY + 0.26;

  return (
    <group>
      <mesh position={[0, top - 0.01, 0]} material={material} castShadow>
        <cylinderGeometry args={[r * 0.93, r, 0.02, SEGMENTS]} />
      </mesh>

      {/* Knurl — top band only */}
      <KnurlBand y={top - 0.055} radius={r} height={0.07} material={material} />

      {/* Two horizontal thread indentations */}
      <mesh position={[0, top - 0.105, 0]} material={material}>
        <cylinderGeometry args={[r * 0.91, r * 0.93, 0.018, SEGMENTS]} />
      </mesh>
      <mesh position={[0, top - 0.125, 0]} material={material}>
        <cylinderGeometry args={[r * 0.97, r * 0.97, 0.016, SEGMENTS]} />
      </mesh>
      <mesh position={[0, top - 0.15, 0]} material={material}>
        <cylinderGeometry args={[r * 0.91, r * 0.93, 0.018, SEGMENTS]} />
      </mesh>
      <mesh position={[0, top - 0.175, 0]} material={material}>
        <cylinderGeometry args={[r * 0.97, r * 0.98, 0.022, SEGMENTS]} />
      </mesh>

      {/* Flat wider heel — sits flush on the finish */}
      <mesh position={[0, top - 0.215, 0]} material={material}>
        <cylinderGeometry args={[r * 0.94, r * 0.94, 0.01, SEGMENTS]} />
      </mesh>
      <mesh position={[0, top - 0.24, 0]} material={material}>
        <cylinderGeometry args={[r * 1.04, r * 1.06, 0.036, SEGMENTS]} />
      </mesh>
    </group>
  );
}

function GlassBody() {
  const geometry = useMemo(() => {
    const geo = new THREE.LatheGeometry(outerProfile(), SEGMENTS);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0}
        roughness={0.04}
        transmission={1}
        thickness={0.55}
        ior={1.5}
        transparent
        opacity={1}
        envMapIntensity={1.5}
        clearcoat={1}
        clearcoatRoughness={0.03}
        attenuationColor="#eef3f8"
        attenuationDistance={2.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function SparklingBottle3D() {
  const totalH = H + 0.26;
  return (
    <group position={[0, -totalH / 2 + 0.05, 0]}>
      <GlassBody />
      <HeelKnurl />
      <Cap rimY={H} />
    </group>
  );
}
