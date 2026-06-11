import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface RobotModelProps {
  modelPath: string;
}

export default function RobotModel({ modelPath }: RobotModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if (!((child as THREE.Mesh).isMesh)) return;
      const mesh = child as THREE.Mesh;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const applyMaterial = (material: THREE.Material | THREE.Material[] | null) => {
        if (!material) return;

        const materials = Array.isArray(material) ? material : [material];
        materials.forEach((mat) => {
          if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) return;

          if (mat.map) {
            mat.map.encoding = THREE.sRGBEncoding;
            mat.map.anisotropy = Math.min(4, mat.map.anisotropy || 1);
          }
          if (mat.emissiveMap) {
            mat.emissiveMap.encoding = THREE.sRGBEncoding;
          }

          mat.envMapIntensity = Math.max(mat.envMapIntensity || 0.8, 1.1);
          mat.roughness = Math.max(0.08, (mat.roughness ?? 0.55) - 0.18);
          mat.metalness = Math.min(1, (mat.metalness ?? 0.3) + 0.25);
          mat.clearcoat = Math.min(1, (mat.clearcoat ?? 0) + 0.8);
          mat.clearcoatRoughness = Math.min(0.2, (mat.clearcoatRoughness ?? 0.1));
          mat.reflectivity = Math.min(1, (mat.reflectivity ?? 0.5) + 0.2);
          mat.needsUpdate = true;
        });
      };

      applyMaterial(mesh.material);
    });
  }, [scene]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
