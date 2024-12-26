import React from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import state from "../store";
import './shirt.css'

const CustomShirt = ({texture, color}) => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF("/shirt_baked.glb");
  const logoTexture = useTexture(texture);
  const fullTexture = useTexture(texture);
  const baseTexture = useTexture(texture);

  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, color, 0.15, delta)
  );
  const stateString = JSON.stringify(snap);
  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isBaseTexture && (
          <Decal
            position={[-0.01, 0.03, 0.10]}
            rotation={[0, 0, 0]}
            scale={0.23}
            map={baseTexture}
            map-anisotropy={16}
            depthTest={false}
            depthWrite={true}
          ></Decal>
        )}
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          ></Decal>
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0.07, 0.09, 0.10]}
            rotation={[0, 0, 0]}
            scale={0.07}
            map={logoTexture}
            map-anisotropy={16}
            depthTest={false}
            depthWrite={true}
          ></Decal>
        )}
      </mesh>
    </group>
  );
};

export default CustomShirt;
