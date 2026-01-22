import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/transformed_models/turbine/turbine-transformed.glb?url';

interface TurbineSceneProps {
  progress: number;
}

const TurbineScene: React.FC<TurbineSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bladesRef = useRef<THREE.Group>(null);
  // Load the model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      // X-axis: 0 (centered)
      // Y-axis: oscillation for floating effect
      // Z-axis: 0 (default depth)
      groupRef.current.rotation.y = -0.2 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }

    if (bladesRef.current) {
      // Spin blades based on scroll progress + base speed
      bladesRef.current.rotation.x -= (0.1 + progress * 0.5);
    }
  });

  return (
    // Scale reduced to 0.3 for manageable size (was 0.5)
    <group ref={groupRef} position={[0, -1.0, -3]} scale={[0.3, 0.3, 0.3]} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="turbine_01_obj">
          {/* Hull/Casing */}
          <group name="hull_turbine" position={[2.048, 0, 0]}>
            <mesh name="hull_turbine_Plastic-Black-PBR_0" geometry={nodes['hull_turbine_Plastic-Black-PBR_0'].geometry} material={materials.PaletteMaterial001} />
          </group>

          {/* Blades - We wrap this in a ref to animate rotation */}
          <group ref={bladesRef} name="blades_turbine_003">
            <mesh name="blades_turbine_003_Nickel-Light-PBR_0" geometry={nodes['blades_turbine_003_Nickel-Light-PBR_0'].geometry} material={materials.PaletteMaterial001} />
          </group>
        </group>
        <mesh name="hull_turbine_004_Stainlesssteel-Black-PBR_0" geometry={nodes['hull_turbine_004_Stainlesssteel-Black-PBR_0'].geometry} material={materials.PaletteMaterial001} />
      </group>
    </group>
  );
};

useGLTF.preload(modelUrl);

export default TurbineScene;
