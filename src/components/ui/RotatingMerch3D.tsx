import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Text, Environment } from '@react-three/drei';
import { Group, Mesh } from 'three';
import { motion } from 'framer-motion';

type ModelProps = {
  modelUrl: string;
  autoRotate?: boolean;
  productName: string;
  productPrice: string;
};

function Model({ modelUrl, autoRotate = false, productName, productPrice }: ModelProps) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  
  // Gestion sécurisée du chargement du modèle
  let scene = null;
  
  try {
    if (modelUrl && !modelError) { // Vérifier si modelUrl n'est pas vide
      const gltf = useGLTF(modelUrl, true, true, (loader) => {
        loader.manager.onLoad = () => setModelLoaded(true);
        loader.manager.onError = () => setModelError(true);
      });
      scene = gltf.scene;
    } else {
      // Si modelUrl est vide, on considère que c'est une erreur de chargement
      if (!modelError) setModelError(true);
    }
  } catch (error) {
    console.warn('Erreur de chargement du modèle 3D:', error);
    if (!modelError) setModelError(true);
  }
  
  // Rotation automatique
  useFrame((state, delta) => {
    if (group.current && autoRotate) {
      group.current.rotation.y += delta * 0.5;
    }
  });
  
  // Effet de survol
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);
  
  return (
    <group ref={group}>
      {scene && modelLoaded && !modelError ? (
        <primitive 
          object={scene} 
          scale={1.5}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      ) : (
        // Cube de remplacement si le modèle ne charge pas
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#00ff00" wireframe />
        </mesh>
      )}
      
      {/* Texte flottant avec le nom du produit */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        {productName}
      </Text>
      
      {/* Texte flottant avec le prix */}
      <Text
        position={[0, 1.7, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {productPrice}
      </Text>
    </group>
  );
}

export default function RotatingMerch3D({ modelUrl, autoRotate = false, productName, productPrice }: ModelProps) {
  return (
    <motion.div
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Model 
          modelUrl={modelUrl} 
          autoRotate={autoRotate} 
          productName={productName}
          productPrice={productPrice}
        />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          rotateSpeed={0.5}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
        />
        <Environment preset="city" />
        
        {/* Grille au sol */}
        <gridHelper args={[10, 20, '#00ff00', '#101010']} position={[0, -1, 0]} />
      </Canvas>
    </motion.div>
  );
}

// Note: Les modèles 3D doivent être placés dans public/assets/models/
// Formats supportés: .glb, .gltf
// Préchargement désactivé jusqu'à ce que les modèles soient disponibles