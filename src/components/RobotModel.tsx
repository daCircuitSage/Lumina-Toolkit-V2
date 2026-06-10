import React, { useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface RobotModelProps {
  modelPath: string;
}

export default function RobotModel({ modelPath }: RobotModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
