"use client";

import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import SparklingBottle3D from "./SparklingBottle3D";

/* Full-viewport Three.js stage for the procedural sparkling bottle.

   Pixelation on zoom was the framebuffer: dpr capped at 1.75 undersamples on
   retina / browser zoom, and a coarse lathe showed facets when the camera
   closed in. dpr up to 2, denser mesh, slightly closer minDistance. */

export default function BottleViewer() {
  return (
    <div className="hsv-bottle-stage">
      <Canvas
        camera={{ position: [0, 0.15, 6.4], fov: 28, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <color attach="background" args={["#f7f8fa"]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 3]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <spotLight position={[0, 8, 2]} angle={0.35} penumbra={0.6} intensity={0.55} />

        <Suspense fallback={null}>
          <Environment preset="studio" />
          <SparklingBottle3D />
          <ContactShadows position={[0, -2.35, 0]} opacity={0.3} scale={9} blur={2.6} far={5} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={11}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.65}
          target={[0, 0.05, 0]}
        />
      </Canvas>
    </div>
  );
}
