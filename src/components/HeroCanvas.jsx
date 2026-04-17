import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import {
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  FogExp2,
  MathUtils,
  Vector3
} from "three";
import { useEffect, useMemo, useRef } from "react";

const CHAPTER_X = [0, 8, 16, 24, 32];
const MAX_INDEX = CHAPTER_X.length - 1;

const CAMERA_PATH = new CatmullRomCurve3([
  new Vector3(-1.8, 0.42, 7.0),
  new Vector3(2.4, 0.88, 6.25),
  new Vector3(7.6, 0.54, 5.72),
  new Vector3(11.8, -0.08, 5.18),
  new Vector3(16.2, 0.12, 4.88),
  new Vector3(20.5, 0.92, 5.12),
  new Vector3(25.1, 0.62, 5.42),
  new Vector3(29.2, 0.28, 5.06),
  new Vector3(33.8, 0.16, 4.86)
], false, "centripetal", 0.45);

const TARGET_PATH = new CatmullRomCurve3([
  new Vector3(0.2, 0.14, 0),
  new Vector3(3.1, 0.2, 0),
  new Vector3(8.2, 0.16, 0),
  new Vector3(12.2, 0.02, 0),
  new Vector3(16.3, 0.04, 0),
  new Vector3(20.8, 0.18, 0),
  new Vector3(24.5, 0.24, 0),
  new Vector3(28.4, 0.12, 0),
  new Vector3(32.2, 0.06, 0)
], false, "centripetal", 0.45);

const CHAPTER_META = [
  { beamScale: 1.06, beamTilt: 0.03, energy: 0.95, ringOpacity: 0.08, structure: 0.34 },
  { beamScale: 0.88, beamTilt: -0.06, energy: 0.72, ringOpacity: 0.04, structure: 0.22 },
  { beamScale: 0.68, beamTilt: -0.02, energy: 0.56, ringOpacity: 0.1, structure: 0.2 },
  { beamScale: 0.82, beamTilt: 0.08, energy: 0.62, ringOpacity: 0.06, structure: 0.18 },
  { beamScale: 0.58, beamTilt: 0.12, energy: 0.5, ringOpacity: 0.03, structure: 0.12 }
];

function chapterSample(progress) {
  const clamped = Math.max(0, Math.min(MAX_INDEX, progress));
  const startIndex = Math.floor(clamped);
  const endIndex = Math.min(MAX_INDEX, startIndex + 1);
  const alpha = clamped - startIndex;
  const start = CHAPTER_META[startIndex];
  const end = CHAPTER_META[endIndex];

  return {
    beamScale: MathUtils.lerp(start.beamScale, end.beamScale, alpha),
    beamTilt: MathUtils.lerp(start.beamTilt, end.beamTilt, alpha),
    energy: MathUtils.lerp(start.energy, end.energy, alpha),
    ringOpacity: MathUtils.lerp(start.ringOpacity, end.ringOpacity, alpha),
    structure: MathUtils.lerp(start.structure, end.structure, alpha)
  };
}

function BeamSystem({ pointer, reducedMotion, progressRef, beamWorldRef, beamStateRef }) {
  const rootRef = useRef();
  const coreRef = useRef();
  const auraRef = useRef();

  useFrame((state, delta) => {
    if (!rootRef.current || !coreRef.current || !auraRef.current) return;

    const t = state.clock.getElapsedTime();
    const progress = progressRef.current;
    const chapter = chapterSample(progress);
    const pointerX = reducedMotion ? 0 : pointer.current.x * 0.22;
    const pointerY = reducedMotion ? 0 : pointer.current.y * 0.14;
    const x = MathUtils.lerp(CHAPTER_X[0], CHAPTER_X[MAX_INDEX], progress / MAX_INDEX);

    rootRef.current.position.x = MathUtils.damp(rootRef.current.position.x, x, 3.8, delta);
    rootRef.current.rotation.y = MathUtils.damp(rootRef.current.rotation.y, pointerX * 0.6, 4, delta);
    rootRef.current.rotation.x = MathUtils.damp(rootRef.current.rotation.x, -pointerY * 0.44, 4, delta);
    rootRef.current.rotation.z = MathUtils.damp(
      rootRef.current.rotation.z,
      chapter.beamTilt + pointerX * -0.12,
      4.2,
      delta
    );

    const pulse = reducedMotion ? 0 : Math.sin(t * 2.2) * 0.05;
    const nextScale = chapter.beamScale + pulse;
    coreRef.current.scale.y = MathUtils.damp(coreRef.current.scale.y, nextScale, 5, delta);
    auraRef.current.scale.y = MathUtils.damp(auraRef.current.scale.y, nextScale * 1.08, 5, delta);
    auraRef.current.material.opacity = MathUtils.damp(
      auraRef.current.material.opacity,
      0.08 + chapter.energy * 0.08,
      4,
      delta
    );

    if (beamWorldRef) {
      coreRef.current.getWorldPosition(beamWorldRef.current);
      beamWorldRef.current.x += Math.cos(rootRef.current.rotation.z) * 3.6;
      beamWorldRef.current.y += Math.sin(rootRef.current.rotation.z) * 3.6 + 0.18;
    }
    if (beamStateRef) {
      beamStateRef.current.angle = rootRef.current.rotation.z;
      beamStateRef.current.intensity = chapter.energy;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.16, 0]}>
      <mesh ref={auraRef} position={[0.25, 0.1, -0.12]} rotation={[0, 0, 0.08]}>
        <planeGeometry args={[8.8, 1.86]} />
        <meshBasicMaterial
          color="#efe5d0"
          transparent
          opacity={0.14}
          toneMapped={false}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={coreRef} position={[0.25, 0.08, 0]} rotation={[0, 0, 0.08]}>
        <planeGeometry args={[8.1, 0.42]} />
        <meshBasicMaterial
          color="#f7f4eb"
          transparent
          opacity={0.44}
          toneMapped={false}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0.18, 0.08, -0.04]} rotation={[0, 0, 0.08]}>
        <planeGeometry args={[8.4, 0.96]} />
        <meshBasicMaterial
          color="#d8c7a2"
          transparent
          opacity={0.1}
          toneMapped={false}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ChapterStructures({ progressRef }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const progress = progressRef.current;
    const chapter = chapterSample(progress);
    groupRef.current.children.forEach((child, index) => {
      const distance = Math.abs(progress - index);
      const emphasis = Math.max(0, 1 - distance * 0.8);
      child.scale.z = MathUtils.damp(child.scale.z, 0.8 + emphasis * 0.6, 4.2, delta);
      child.position.y = MathUtils.damp(child.position.y, emphasis * 0.22, 4.2, delta);
      child.material.opacity = MathUtils.damp(child.material.opacity, chapter.structure * 0.5 + emphasis * 0.28, 4.2, delta);
      if (child.children.length > 0) {
         child.children[0].material.opacity = MathUtils.damp(child.children[0].material.opacity, chapter.structure * 0.85 + emphasis * 0.42, 4.2, delta);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {CHAPTER_X.map((x, index) => (
        <mesh key={x} position={[x, 0, -0.8 + (index % 2 === 0 ? -0.18 : 0.08)]}>
          <boxGeometry args={[2.6, 3.4, 0.12]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#1e222b" : "#171a21"}
            transparent
            opacity={0.24}
            roughness={0.92}
            metalness={0.04}
          />
          <mesh position={[0, -1.6, 0.08]}>
            <planeGeometry args={[2.4, 0.04]} />
            <meshBasicMaterial color="#d8c7a2" transparent opacity={0.34} blending={AdditiveBlending} />
          </mesh>
        </mesh>
      ))}
      {CHAPTER_X.map((x, index) => (
        <mesh key={`line-${x}`} position={[x + 1.15, 0.08, -0.45]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[4.2, 0.02]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? "#3b4046" : "#2b2e33"}
            transparent
            opacity={0.24}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function StagePlane({ progressRef }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    const x = MathUtils.lerp(CHAPTER_X[0], CHAPTER_X[MAX_INDEX], progressRef.current / MAX_INDEX);
    ref.current.position.x = MathUtils.damp(ref.current.position.x, x + 8, 3.8, delta);
  });

  return (
    <mesh ref={ref} position={[8, -2.55, -1.8]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[48, 12]} />
      <meshStandardMaterial color="#070809" roughness={1} metalness={0} transparent opacity={0.72} />
    </mesh>
  );
}

function ParticleField({ pointer, reducedMotion, progressRef }) {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const buffer = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i += 1) {
      const i3 = i * 3;
      buffer[i3] = (Math.random() - 0.5) * 40;
      buffer[i3 + 1] = (Math.random() - 0.5) * 10;
      buffer[i3 + 2] = (Math.random() - 0.5) * 8;
    }
    return buffer;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const progress = progressRef.current;
    pointsRef.current.rotation.y = MathUtils.damp(
      pointsRef.current.rotation.y,
      reducedMotion ? 0.06 : pointer.current.x * 0.16 + progress * 0.06,
      3.2,
      delta
    );
    pointsRef.current.position.y = Math.sin(t * 0.28) * 0.06;
  });

  return (
    <points ref={pointsRef} position={[16, 0, -2.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dfd7c2" size={0.03} sizeAttenuation transparent opacity={0.6} blending={AdditiveBlending} />
    </points>
  );
}

function AtmosphereRings({ progressRef }) {
  const ringGroup = useRef();

  useFrame((state, delta) => {
    if (!ringGroup.current) return;
    const t = state.clock.getElapsedTime();
    const x = MathUtils.lerp(CHAPTER_X[0], CHAPTER_X[MAX_INDEX], progressRef.current / MAX_INDEX);
    const chapter = chapterSample(progressRef.current);
    ringGroup.current.position.x = MathUtils.damp(ringGroup.current.position.x, x * 0.85 + 2.4, 3.8, delta);
    ringGroup.current.rotation.z += delta * 0.12;
    ringGroup.current.position.y = Math.sin(t * 0.6) * 0.1;
    ringGroup.current.children.forEach((child, index) => {
      const base = index === 0 ? chapter.ringOpacity : chapter.ringOpacity * 0.72;
      child.material.opacity = MathUtils.damp(child.material.opacity, base, 4.2, delta);
    });
  });

  return (
    <group ref={ringGroup} position={[1.4, 0, -1.05]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.18, 96]} />
        <meshBasicMaterial color="#e5ce9e" transparent opacity={0.16} toneMapped={false} blending={AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.06]}>
        <ringGeometry args={[3.0, 3.05, 96]} />
        <meshBasicMaterial color="#b3a286" transparent opacity={0.12} toneMapped={false} blending={AdditiveBlending} />
      </mesh>
    </group>
  );
}

function FramingLines() {
  return (
    <group position={[16, 0, -2.8]}>
      <mesh position={[0, 2.6, 0]}>
        <planeGeometry args={[40, 0.01]} />
        <meshBasicMaterial color="#15171a" />
      </mesh>
      <mesh position={[0, -2.6, 0]}>
        <planeGeometry args={[40, 0.01]} />
        <meshBasicMaterial color="#101113" />
      </mesh>
    </group>
  );
}

function CSSBridge({ progressRef, beamWorldRef, beamStateRef }) {
  const { camera, size } = useThree();
  const projected = useRef(new Vector3());
  const smoothed = useRef({ x: 0.78, y: 0.22 });

  useFrame(() => {
    projected.current.copy(beamWorldRef.current).project(camera);

    const rawX = (projected.current.x * 0.5 + 0.5);
    const rawY = (-projected.current.y * 0.5 + 0.5);
    const behind = projected.current.z > 1;
    const targetX = behind ? smoothed.current.x : MathUtils.clamp(rawX, -0.1, 1.1);
    const targetY = behind ? smoothed.current.y : MathUtils.clamp(rawY, -0.1, 1.1);

    smoothed.current.x += (targetX - smoothed.current.x) * 0.14;
    smoothed.current.y += (targetY - smoothed.current.y) * 0.14;

    const root = document.documentElement.style;
    root.setProperty("--beam-x", smoothed.current.x.toFixed(4));
    root.setProperty("--beam-y", smoothed.current.y.toFixed(4));
    root.setProperty("--beam-angle", (beamStateRef.current.angle * (180 / Math.PI)).toFixed(3));
    root.setProperty("--beam-intensity", beamStateRef.current.intensity.toFixed(3));
    root.setProperty("--scene-progress", (progressRef.current / MAX_INDEX).toFixed(4));
    root.setProperty("--viewport-aspect", (size.width / Math.max(size.height, 1)).toFixed(3));
  });

  return null;
}

function Scene({ pointer, reducedMotion, progressRef }) {
  const { scene, camera } = useThree();
  const beamWorldRef = useRef(new Vector3(0, 0.2, 0));
  const beamStateRef = useRef({ angle: 0, intensity: 0.8 });

  useEffect(() => {
    scene.background = new Color("#000000");
    scene.fog = new FogExp2("#000000", 0.03);
  }, [scene]);

  useFrame((_, delta) => {
    const normalized = progressRef.current / MAX_INDEX;
    const pathPoint = CAMERA_PATH.getPointAt(normalized);
    const targetPoint = TARGET_PATH.getPointAt(normalized);

    const pointerWeight = reducedMotion ? 0 : Math.max(0.18, 0.52 - normalized * 0.18);
    const cameraOffsetX = pointer.current.x * pointerWeight;
    const cameraOffsetY = pointer.current.y * (pointerWeight * 0.42);
    const cameraOffsetZ = -pointer.current.x * 0.06;

    camera.position.x = MathUtils.damp(camera.position.x, pathPoint.x + cameraOffsetX, 3.6, delta);
    camera.position.y = MathUtils.damp(camera.position.y, pathPoint.y + cameraOffsetY, 3.6, delta);
    camera.position.z = MathUtils.damp(camera.position.z, pathPoint.z + cameraOffsetZ, 3.6, delta);
    camera.lookAt(
      targetPoint.x + pointer.current.x * pointerWeight * 0.2,
      targetPoint.y + pointer.current.y * pointerWeight * 0.16,
      targetPoint.z
    );
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.25, 6.8]} fov={34} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 5, 4]} intensity={0.28} color="#f0e4c9" />
      <pointLight position={[2.8, 1.5, 1.6]} intensity={0.52} color="#e8dcc4" />
      <pointLight position={[16, -1.4, -1.2]} intensity={0.12} color="#8d8573" />
      <StagePlane progressRef={progressRef} />
      <BeamSystem
        pointer={pointer}
        reducedMotion={reducedMotion}
        progressRef={progressRef}
        beamWorldRef={beamWorldRef}
        beamStateRef={beamStateRef}
      />
      <ChapterStructures progressRef={progressRef} />
      <AtmosphereRings progressRef={progressRef} />
      <ParticleField pointer={pointer} reducedMotion={reducedMotion} progressRef={progressRef} />
      <FramingLines />
      <CSSBridge
        progressRef={progressRef}
        beamWorldRef={beamWorldRef}
        beamStateRef={beamStateRef}
      />
    </>
  );
}

export function HeroCanvas({ pointer, reducedMotion, progressRef }) {
  return (
    <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: false }}>
      <Scene pointer={pointer} reducedMotion={reducedMotion} progressRef={progressRef} />
    </Canvas>
  );
}
