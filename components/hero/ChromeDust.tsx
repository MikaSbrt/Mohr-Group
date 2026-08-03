'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ruhiges Chromstaub-Volumen hinter dem Fahrzeug.
 * Reine Tiefenwirkung – bewegt sich sehr langsam und mit deutlichem
 * Parallax gegenüber der Fahrzeugwolke.
 */
export default function ChromeDust({
  count = 1800,
  scrollRef,
}: {
  count?: number;
  scrollRef: React.RefObject<number>;
}) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = -1 - Math.random() * 11;
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, [count]);

  useFrame((state, delta) => {
    if (!mat.current || !ref.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uProjScale.value =
      0.5 * size.height * state.camera.projectionMatrix.elements[5] * state.viewport.dpr;

    const scatter = THREE.MathUtils.clamp(scrollRef.current ?? 0, 0, 1);
    ref.current.rotation.z = THREE.MathUtils.damp(
      ref.current.rotation.z,
      state.pointer.x * 0.05,
      2,
      delta,
    );
    // beim Scrollen zieht das Feld an der Kamera vorbei
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, scatter * 9, 4, delta);
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uProjScale: { value: 600 } }}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform float uProjScale;
          attribute float aSeed;
          varying float vA;
          void main() {
            vec3 p = position;
            float ph = aSeed * 6.2831853;
            p.x += sin(uTime * 0.12 + ph) * 0.45;
            p.y += cos(uTime * 0.09 + ph * 1.4) * 0.32;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (0.02 * uProjScale) / max(-mv.z, 0.001);
            // hintere Partikel deutlich schwächer
            vA = 0.10 + 0.28 * smoothstep(-12.0, -1.0, mv.z) * (0.4 + 0.6 * aSeed);
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vA;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d2 = dot(c, c);
            if (d2 > 0.25) discard;
            float a = smoothstep(0.25, 0.0, d2);
            gl_FragColor = vec4(0.727, 0.729, 0.753, a * vA);
          }
        `}
      />
    </points>
  );
}
