'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ==========================================================================
   Der zentrale Effekt: das Fahrzeug besteht aus Partikeln.

   Die Positionen werden aus dem echten Foto gesampelt – jeder helle Pixel
   wird zu einem Punkt im Raum, die Helligkeit bestimmt zusätzlich die
   Z-Tiefe. Dadurch ist die Wolke ein echtes 3D-Relief des Wagens und nicht
   nur eine flache Textur.

   Ablauf:
     uProgress 0 → 1   Partikel fliegen aus dem Nichts in die Fahrzeugform
     uReveal   0 → 1   das scharfe Foto blendet passgenau darüber ein
     uScatter  0 → 1   beim Scrollen reißt es die Wolke wieder auseinander
   ========================================================================== */

const pointsVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uReveal;     // wie weit das scharfe Foto schon übernommen hat
  uniform float uScatter;
  uniform float uTime;
  uniform vec3  uMouse;      // xy = Position, z = Stärke
  uniform float uSizeWorld;
  uniform float uProjScale;  // 0.5 * Viewport-Höhe(px) * projectionMatrix[1][1]

  attribute vec3  aScatter;
  attribute vec3  aColor;
  attribute float aSeed;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Anflug: aus der Streuwolke in die Fahrzeugform
    float p = uProgress;
    float eased = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(aScatter, position, eased);

    // sehr langsame Eigenbewegung, damit die Wolke nie ganz stillsteht
    float ph = aSeed * 6.2831853;
    pos.x += sin(uTime * 0.45 + ph) * 0.0055;
    pos.y += cos(uTime * 0.38 + ph * 1.7) * 0.0045;
    pos.z += sin(uTime * 0.62 + ph * 2.3) * 0.010;

    // Cursor drückt die Partikel zur Seite und nach vorn
    vec2 toMouse = pos.xy - uMouse.xy;
    float d = length(toMouse) + 0.0001;
    float force = smoothstep(1.05, 0.0, d) * uMouse.z;
    pos.xy += (toMouse / d) * force * 0.30;
    pos.z  += force * 0.42;

    // Scroll: die Wolke zerfällt wieder und zieht an der Kamera vorbei
    pos += aScatter * uScatter * 1.35;
    pos.z += uScatter * 2.6;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSizeWorld * uProjScale) / max(-mv.z, 0.001);

    vColor = aColor;

    // Während des Aufbaus tragen die Partikel das Bild. Sobald das Foto
    // übernimmt, treten sie zurück – beim Zerfall kommen sie wieder.
    float photoHide = uReveal * (1.0 - uScatter);
    vAlpha = (0.22 + 0.78 * eased) * mix(1.0, 0.10, photoHide);
  }
`;

const pointsFragment = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d2 = dot(c, c);
    if (d2 > 0.25) discard;
    float a = smoothstep(0.25, 0.02, d2);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

const planeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* Der schwarze Studiohintergrund des Fotos wird über die Helligkeit
   ausmaskiert – dadurch schwebt der Wagen wirklich in der Szene und
   sitzt nicht in einem sichtbaren Rechteck. Zusätzlich läuft die
   Deckkraft zu den Bildrändern aus, damit der aufgehellte Studioboden
   keine sichtbare Kante hinterlässt. */
const planeFragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 t = texture2D(uTex, vUv);
    float lum = dot(t.rgb, vec3(0.299, 0.587, 0.114));
    float a = smoothstep(0.055, 0.205, lum);

    vec2 e = min(vUv, 1.0 - vUv);
    a *= smoothstep(0.0, 0.14, e.x) * smoothstep(0.0, 0.10, e.y);

    gl_FragColor = vec4(t.rgb, a * uOpacity);
    if (gl_FragColor.a < 0.004) discard;
  }
`;

type Sampled = {
  positions: Float32Array;
  scatter: Float32Array;
  colors: Float32Array;
  seeds: Float32Array;
  count: number;
  planeW: number;
  planeH: number;
  spacing: number;
  texture: THREE.Texture;
};

function sampleImage(img: HTMLImageElement, step: number): Sampled {
  const w = img.naturalWidth;
  const h = img.naturalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;

  const planeH = 3.15;
  const planeW = planeH * (w / h);
  const spacing = (planeW * step) / w;

  const pos: number[] = [];
  const sct: number[] = [];
  const col: number[] = [];
  const sd: number[] = [];

  for (let y = 0; y < h; y += step) {
    // Randabfall: verhindert, dass der aufgehellte Studioboden als
    // sichtbares Rechteck stehen bleibt.
    const ey = Math.min(1, Math.min(y, h - 1 - y) / (h * 0.1));

    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      const ex = Math.min(1, Math.min(x, w - 1 - x) / (w * 0.14));
      // Studio-Schwarz und Randzone überspringen
      if (lum * ex * ey < 0.075) continue;

      const px = (x / w - 0.5) * planeW;
      const py = -(y / h - 0.5) * planeH;
      // Helligkeit als Relief: Lichter kommen nach vorne
      const pz = (lum - 0.42) * 0.5 + (Math.random() - 0.5) * 0.05;

      pos.push(px, py, pz);

      // Startwolke: weit gestreut, leicht nach vorne gezogen
      const a = Math.random() * Math.PI * 2;
      const rad = 2.4 + Math.random() * 3.6;
      sct.push(
        Math.cos(a) * rad * 1.5,
        Math.sin(a) * rad * 0.9,
        (Math.random() - 0.35) * 4.5,
      );

      // Farbe leicht angehoben, damit die Wolke nicht absäuft
      col.push(Math.min(1, r * 1.12 + 0.03), Math.min(1, g * 1.12 + 0.03), Math.min(1, b * 1.14 + 0.04));
      sd.push(Math.random());
    }
  }

  const texture = new THREE.Texture(img);
  // Rohes Sampling: die Bilddaten sind bereits sRGB und werden direkt ausgegeben.
  texture.colorSpace = THREE.NoColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return {
    positions: new Float32Array(pos),
    scatter: new Float32Array(sct),
    colors: new Float32Array(col),
    seeds: new Float32Array(sd),
    count: sd.length,
    planeW,
    planeH,
    spacing,
    texture,
  };
}

/* -------------------------------------------------------------------------- */

export default function ParticleVehicle({
  src,
  step,
  scrollRef,
  onReady,
}: {
  src: string;
  step: number;
  scrollRef: React.RefObject<number>;
  onReady?: () => void;
}) {
  const [data, setData] = useState<Sampled | null>(null);
  const group = useRef<THREE.Group>(null);
  const pointsMat = useRef<THREE.ShaderMaterial>(null);
  const planeMat = useRef<THREE.ShaderMaterial>(null);
  const started = useRef<number | null>(null);
  const mouse = useRef(new THREE.Vector3(0, 0, 0));
  const { viewport, size } = useThree();

  /* Bild laden und einmalig sampeln */
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.src = src;
    img
      .decode()
      .then(() => {
        if (cancelled) return;
        setData(sampleImage(img, step));
        onReady?.();
      })
      .catch(() => {
        /* Bild nicht ladbar – der statische Fallback der Hero-Sektion greift */
      });
    return () => {
      cancelled = true;
    };
  }, [src, step, onReady]);

  const geometry = useMemo(() => {
    if (!data) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute('aScatter', new THREE.BufferAttribute(data.scatter, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(data.colors, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    return g;
  }, [data]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  /* Damit der Wagen auf jedem Format vollständig im Bild bleibt */
  const fit = data ? Math.min(1, (viewport.width * 0.92) / data.planeW) : 1;

  useFrame((state, delta) => {
    if (!data || !pointsMat.current || !planeMat.current) return;

    const t = state.clock.elapsedTime;
    if (started.current === null) started.current = t;
    const since = t - started.current;

    // Erst baut sich die Wolke zum Fahrzeug zusammen, dann übernimmt das Foto.
    const progress = THREE.MathUtils.clamp(since / 2.6, 0, 1);
    const reveal = THREE.MathUtils.clamp((since - 2.4) / 1.5, 0, 1);
    const scatter = THREE.MathUtils.clamp(scrollRef.current ?? 0, 0, 1);

    const pu = pointsMat.current.uniforms;
    pu.uTime.value = t;
    pu.uProgress.value = progress;
    pu.uReveal.value = reveal;
    pu.uScatter.value = scatter;
    pu.uProjScale.value =
      0.5 * size.height * state.camera.projectionMatrix.elements[5] * state.viewport.dpr;

    // Cursor weich nachziehen
    const target = state.pointer;
    mouse.current.x = THREE.MathUtils.damp(
      mouse.current.x,
      (target.x * viewport.width) / 2,
      4,
      delta,
    );
    mouse.current.y = THREE.MathUtils.damp(
      mouse.current.y,
      (target.y * viewport.height) / 2,
      4,
      delta,
    );
    mouse.current.z = THREE.MathUtils.damp(
      mouse.current.z,
      state.pointer.x === 0 && state.pointer.y === 0 ? 0 : 1,
      3,
      delta,
    );
    pu.uMouse.value.copy(mouse.current);

    planeMat.current.uniforms.uOpacity.value = reveal * (1 - scatter);

    // leichte Rotation um die Y-Achse, gesteuert vom Cursor → echte Tiefe
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        target.x * 0.14,
        3,
        delta,
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        -target.y * 0.08,
        3,
        delta,
      );
      group.current.position.z = THREE.MathUtils.damp(
        group.current.position.z,
        scatter * 1.4,
        4,
        delta,
      );
    }
  });

  if (!data || !geometry) return null;

  return (
    <group ref={group} scale={fit}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={pointsMat}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uProgress: { value: 0 },
            uReveal: { value: 0 },
            uScatter: { value: 0 },
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector3() },
            uSizeWorld: { value: data.spacing * 1.7 },
            uProjScale: { value: 600 },
          }}
        />
      </points>

      <mesh position={[0, 0, 0.02]} frustumCulled={false}>
        <planeGeometry args={[data.planeW, data.planeH, 1, 1]} />
        <shaderMaterial
          ref={planeMat}
          vertexShader={planeVertex}
          fragmentShader={planeFragment}
          transparent
          depthWrite={false}
          uniforms={{
            uTex: { value: data.texture },
            uOpacity: { value: 0 },
          }}
        />
      </mesh>
    </group>
  );
}
