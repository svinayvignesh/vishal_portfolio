import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/transformed_models/ford/ford_f150_raptor-transformed.glb?url';

interface AutomotiveSceneProps {
  progress: number;
}

const AutomotiveScene: React.FC<AutomotiveSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const carRef = useRef<THREE.Group>(null);
  // Load the model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  useFrame((state) => {
    if (groupRef.current) {
      // Slight camera/group movement for dynamism
      // X-axis: 0 (centered)
      // Y-axis: oscillation for floating effect
      // Z-axis: 0 (default depth)
      groupRef.current.rotation.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.1) * 0.03;
    }

    // Car drives in from left based on progress
    if (carRef.current) {
      // Start further left (-20) and drive to center (-2)
      carRef.current.position.x = -20 + progress * 18;

      // Add some suspension bounce while moving
      if (progress < 0.95) {
        carRef.current.position.y = -1.8 + Math.sin(state.clock.elapsedTime * 15) * 0.02;
      }
    }
  });

  const isMoving = progress < 0.95;

  return (
    // Scale reduced to 0.4 for manageable size (was 2)
    <group ref={groupRef} position={[0, -0.5, -5]} scale={[0.4, 0.4, 0.4]}>
      {/* The car */}
      <group ref={carRef} position={[-20, -1.8, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1, 1, 1]}>
        <Model nodes={nodes} materials={materials} />

        {/* Headlight beams attached to car */}
        <spotLight
          position={[0.8, 1, 3]} // Adjusted for new model scale/orientation
          angle={0.5}
          penumbra={0.5}
          intensity={isMoving ? 5 : 2}
          color="#ffffaa"
          target-position={[0.8, 0, 10]}
        />
        <spotLight
          position={[-0.8, 1, 3]}
          angle={0.5}
          penumbra={0.5}
          intensity={isMoving ? 5 : 2}
          color="#ffffaa"
          target-position={[-0.8, 0, 10]}
        />
      </group>

      {/* Road Environment (Keep existing but adjust for new scale) */}
      <group position={[0, -2, 0]}>
        {/* Road */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[40, 0.1, 8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.8} />
        </mesh>

        {/* Road markings */}
        {[-15, -10, -5, 0, 5, 10, 15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[2, 0.02, 0.3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
};


// Extracted Model component to keep main component clean
// This assumes the structure from Ford_f150_raptor.jsx
function Model({ nodes, materials }: { nodes: any, materials: any }) {
  return (
    <group dispose={null}>
      <mesh geometry={nodes.Object_8.geometry} material={materials.PaletteMaterial001} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_12.geometry} material={materials['glass.006']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_14.geometry} material={materials.PaletteMaterial002} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_16.geometry} material={materials['goma.002']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_18.geometry} material={materials['crome.011']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_20.geometry} material={materials['carpet.003']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_22.geometry} material={materials['keyhole.001']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_24.geometry} material={materials['symbols.001']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_26.geometry} material={materials['stitch.001']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_28.geometry} material={materials.PaletteMaterial003} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_32.geometry} material={materials.leathers} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_36.geometry} material={materials['rivet.001']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_44.geometry} material={materials['discbrake.004']} position={[-0.901, 0.476, -1.827]} rotation={[-1.9, 0.001, 0]} />
      <mesh geometry={nodes.Object_81.geometry} material={materials['vehiclelights.010']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_101.geometry} material={materials['undercarriage.004']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_151.geometry} material={materials['vehicle_generic_carbon.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_157.geometry} material={materials['symbol3.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_166.geometry} material={materials['grill.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_169.geometry} material={materials['pedals.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_182.geometry} material={materials['665.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_286.geometry} material={materials['vehicle_generic_detail2.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_305.geometry} material={materials['MAATE_WhelenDominator.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_364.geometry} material={materials['11BLACK.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_393.geometry} material={materials['vehiclelights128.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_396.geometry} material={materials['lasluces.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_406.geometry} material={materials['genesis.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_412.geometry} material={materials['console.003']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_452.geometry} material={materials['for_badge.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_478.geometry} material={materials['deng.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_39.geometry} material={materials['vehicle_generic_tyrewallblack.001']} position={[-0.919, 0.476, 1.924]} rotation={[Math.PI / 2, 0, 0.005]} />
      <mesh geometry={nodes.Object_42.geometry} material={materials['vehicle_generic_tyrewallblack.002']} position={[-0.901, 0.476, -1.827]} rotation={[-1.871, -0.136, 0.416]} />
      <mesh geometry={nodes.Object_409.geometry} material={materials['Coban_tex.003']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
    </group>
  );
}

useGLTF.preload(modelUrl);

export default AutomotiveScene;
