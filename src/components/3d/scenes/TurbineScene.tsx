import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/models/turbine/turbine-transformed.glb?url';

const TurbineScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  // Load the model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  return (
    <group ref={groupRef} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="turbine_01_obj">
          {/* Hull/Casing */}
          <group name="hull_turbine">
            <mesh name="hull_turbine_Plastic-Black-PBR_0" geometry={nodes['hull_turbine_Plastic-Black-PBR_0'].geometry} material={materials.PaletteMaterial001} />
          </group>

          {/* Blades */}
          <group name="blades_turbine_003">
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
