import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const RotatingSphere = () => {
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={mesh} scale={2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" wireframe />
    </mesh>
  );
};

const ThreeDBackground = () => {
  return (
    <Canvas>
      <ambientLight />
      <RotatingSphere />
    </Canvas>
  );
};

export default ThreeDBackground;
