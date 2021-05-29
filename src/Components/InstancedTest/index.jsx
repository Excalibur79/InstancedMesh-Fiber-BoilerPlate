import React, {
  useState,
  useContext,
  useRef,
  Suspense,
  useEffect,
} from 'react';
//import building from '../../Assets/Skyscraper1';
import * as THREE from 'three';
import { withKnobs, number } from '@storybook/addon-knobs';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
// import roadTexture from '../../Assets/Textures/road_texture.jpg';
import buildingTexture from '../../Assets/buildingTexture2.png';
import {
  OrbitControls,
  MeshWobbleMaterial,
  meshStandardMaterial,
  useGLTF,
  meshBounds,
  Sky,
  Stars,
} from '@react-three/drei';
const InstanceTest = () => {
  return (
    <>
      <Canvas
        shadows={true}
        colorManagement
        camera={{ position: [0, 50, 100], fov: 60 }}
      >
        <OrbitControls enablePan enableRotate enableZoom />
        <axesHelper position={[0, 0.11, 0]} args={[2]} />

        <Light />
        <Suspense fallback={null}>
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            color="red"
          >
            <planeBufferGeometry attach="geometry" args={[200, 200]} />
            <meshStandardMaterial attach="material" color="green" />
            {/* {<shadowMaterial attach="material" opacity={0.3} />} */}
          </mesh>

          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
          <InstanceBuilding number={40000} />
        </Suspense>
      </Canvas>
    </>
  );
};
export default InstanceTest;

const InstanceBuilding = ({ number }) => {
  const tempObject = new THREE.Object3D();
  const [colorMap] = useLoader(TextureLoader, [buildingTexture]);

  const gltfModel = useGLTF('/Skyscraper1.gltf');
  console.log(gltfModel.scene.children[0]);
  const meshRef = useRef();
  let id = 0;
  useEffect(() => {
    for (let x = 0; x < 200; x++) {
      for (let z = 0; z < 200; z++) {
        tempObject.position.set(5 - x + 50, 0.5, 5 - z + 50);
        tempObject.scale.set(0.5, 1, 0.5);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(id, tempObject.matrix);
        meshRef.current.instanceMatrix.needsUpdate = true;
        id += 1;
      }
    }
  }, []);

  //   useEffect(() => {
  //     meshRef.current.setMatrixAt(0, new THREE.Matrix4());
  //   }, []);
  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, number]}
      castShadow
      receiveShadow
    >
      <boxBufferGeometry attach="geometry" />
      <meshPhongMaterial attach="material" map={colorMap} />
    </instancedMesh>
  );
};
{
  /* <boxBufferGeometry attach="geometry" />
      <meshPhongMaterial attach="material" color="lightblue" /> */
}

const Light = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="yellow" />
      <directionalLight position={[0, 10, 0]} intensity={1.5} />
      <spotLight position={[1000, 0, 0]} intensity={1} />
      <spotLight position={[0, 10, 40]} intensity={1} color="yellow" />
    </>
  );
};
