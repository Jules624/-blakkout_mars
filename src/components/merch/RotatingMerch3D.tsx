import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group } from 'three';

// Composant pour le modèle 3D avec gestion d'erreur
function Model({ url, scale = [1, 1, 1], position = [0, 0, 0], rotation = [0, 0, 0], onError }: { 
  url: string; 
  scale?: [number, number, number]; 
  position?: [number, number, number];
  rotation?: [number, number, number];
  onError?: () => void;
}) {
  const modelRef = useRef<Group>(null);
  
  try {
    const gltf = useLoader(GLTFLoader, url, undefined, (error) => {
      console.error('Erreur de chargement du modèle 3D:', error);
      onError?.();
    });

    // Animation de rotation automatique
    useFrame((state) => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.005;
      }
    });

    return (
      <group ref={modelRef} position={position} rotation={rotation} scale={scale}>
        <primitive object={gltf.scene} />
      </group>
    );
  } catch (error) {
    console.error('Erreur lors du rendu du modèle 3D:', error);
    onError?.();
    return null;
  }
}

// Fallback pour le chargement
function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-glitch text-xl">CHARGEMENT...</div>
    </div>
  );
}

// Composant d'erreur avec fallback image
function ErrorFallback({ productName, images }: { productName?: string; images?: string[] }) {
  const fallbackImage = images && images.length > 0 ? images[0] : '/assets/images/placeholder-product.jpg';
  
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-blakkout-background to-blakkout-background/50 rounded-md overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="mb-4 aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-md border border-blakkout-primary/30">
            <img 
              src={fallbackImage} 
              alt={productName || 'Produit'}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iODAiIGZpbGw9IiMwMGZmMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTYiPkBCTEFLS09VVDwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSIxMjAiIGZpbGw9IiMwMGZmMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiPk1FUkNIPC90ZXh0Pgo8L3N2Zz4=';
              }}
            />
          </div>
          <div className="text-blakkout-primary text-xs font-mono opacity-70">APERÇU 2D • MODÈLE 3D INDISPONIBLE</div>
        </div>
      </div>
    </div>
  );
}

type RotatingMerch3DProps = {
  modelUrl: string;
  productName: string;
  productPrice?: string;
  name?: string;
  price?: string;
  images?: string[];
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  backgroundColor?: string;
  showControls?: boolean;
  autoRotate?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function RotatingMerch3D({
  modelUrl,
  productName,
  productPrice,
  name,
  price,
  images,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  backgroundColor = 'transparent',
  showControls = true,
  autoRotate = false,
  className = '',
  onClick,
}: RotatingMerch3DProps) {
  // Utiliser productName et productPrice en priorité, sinon name et price
  const displayName = productName || name || 'Produit';
  const displayPrice = productPrice || price || '';
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Simuler un chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Gérer les erreurs de chargement
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Si modelUrl est vide, afficher directement le fallback d'erreur
  if (!modelUrl) {
    return (
      <motion.div 
        className={`rotating-3d-container ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
      >
        <ErrorFallback productName={displayName} images={images} />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`rotating-3d-container ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      {isLoading ? (
        <LoadingFallback />
      ) : hasError ? (
        <ErrorFallback productName={displayName} images={images} />
      ) : (
        <>
          <Canvas style={{ background: backgroundColor }}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Suspense fallback={null}>
              <Model url={modelUrl} scale={scale} position={position} rotation={rotation} onError={handleError} />
              <Environment preset="city" />
              {showControls && <OrbitControls enableZoom={false} />}
            </Suspense>
          </Canvas>
          
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blakkout-background/80 to-transparent p-4 text-center">
            <h3 className="font-display text-lg text-blakkout-primary">{displayName}</h3>
            {displayPrice && <p className="font-mono text-blakkout-accent">{displayPrice}</p>}
          </div>
        </>
      )}
    </motion.div>
  );
}