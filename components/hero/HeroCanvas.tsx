'use client';

import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import ParticleVehicle from './ParticleVehicle';
import ChromeDust from './ChromeDust';
import { useDeviceTier } from '@/lib/motion';

/**
 * WebGL-Bühne des Heros. Wird ausschließlich clientseitig und nur dann
 * eingehängt, wenn WebGL verfügbar ist und keine Bewegungsreduktion
 * angefordert wurde (siehe Hero.tsx).
 */
export default function HeroCanvas({
  src,
  scrollRef,
  onReady,
}: {
  src: string;
  scrollRef: React.RefObject<number>;
  onReady?: () => void;
}) {
  const tier = useDeviceTier();
  const failed = useRef(false);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={tier === 'high' ? [1, 1.75] : [1, 1.35]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      onError={() => {
        failed.current = true;
      }}
    >
      <ChromeDust count={tier === 'high' ? 2000 : 700} scrollRef={scrollRef} />
      <ParticleVehicle
        src={src}
        step={tier === 'high' ? 3 : 6}
        scrollRef={scrollRef}
        onReady={onReady}
      />
    </Canvas>
  );
}
