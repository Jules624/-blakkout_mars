import React, { useState, useRef, Suspense, useEffect, createContext, useContext } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Group, LoadingManager } from 'three';

// Context pour le cache des modèles
const ModelCacheContext = createContext<{
  preloadedModels: Map<string, any>;
  preloadModel: (url: string) => Promise<any>;
  isPreloading: boolean;
}>({ 
  preloadedModels: new Map(), 
  preloadModel: async () => null,
  isPreloading: false 
});

// Hook pour utiliser le cache des modèles
function useModelCache() {
  return useContext(ModelCacheContext);
}

// Provider pour le cache des modèles
export function ModelCacheProvider({ children }: { children: React.ReactNode }) {
  const [preloadedModels] = useState(() => new Map());
  const [isPreloading, setIsPreloading] = useState(false);
  const loaderRef = useRef<GLTFLoader | null>(null);

  // Initialiser le loader une seule fois
  useEffect(() => {
    if (!loaderRef.current) {
      const manager = new LoadingManager();
      loaderRef.current = new GLTFLoader(manager);
    }
  }, []);

  const preloadModel = async (url: string): Promise<any> => {
    if (preloadedModels.has(url)) {
      return preloadedModels.get(url);
    }

    if (!loaderRef.current) {
      throw new Error('Loader not initialized');
    }

    try {
      console.log('Préchargement du modèle:', url);
      const gltf = await new Promise((resolve, reject) => {
        loaderRef.current!.load(
          url,
          (gltf) => resolve(gltf),
          (progress) => {
            console.log('Progression du préchargement:', url, (progress.loaded / progress.total * 100) + '%');
          },
          (error) => reject(error)
        );
      });
      
      preloadedModels.set(url, gltf);
      console.log('Modèle préchargé avec succès:', url);
      return gltf;
    } catch (error) {
      console.error('Erreur lors du préchargement:', url, error);
      throw error;
    }
  };

  // Fonction pour précharger plusieurs modèles
  const preloadModels = async (urls: string[]) => {
    setIsPreloading(true);
    try {
      await Promise.allSettled(urls.map(url => preloadModel(url)));
      console.log('Préchargement terminé pour', urls.length, 'modèles');
    } catch (error) {
      console.error('Erreur lors du préchargement des modèles:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  // Précharger automatiquement les modèles au montage
  useEffect(() => {
    const modelUrls = [
      '/assets/models/tshirt.glb',
      '/assets/models/hoodie.glb',
      '/assets/models/cap.glb',
      '/assets/models/totebag.glb',
      '/assets/models/poster.glb',
      '/assets/models/jacket.glb'
    ];
    
    preloadModels(modelUrls);
  }, []);

  return (
    <ModelCacheContext.Provider value={{ preloadedModels, preloadModel, isPreloading }}>
      {children}
    </ModelCacheContext.Provider>
  );
}

// Composant pour le modèle 3D avec gestion d'erreur améliorée et cache
function Model({ url, scale = [1, 1, 1], position = [0, 0, 0], rotation = [0, 0, 0], onError }: { 
  url: string; 
  scale?: [number, number, number]; 
  position?: [number, number, number];
  rotation?: [number, number, number];
  onError?: () => void;
}) {
  const modelRef = useRef<Group>(null);
  const { preloadedModels } = useModelCache();
  const [gltf, setGltf] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le modèle depuis le cache ou via useLoader en fallback
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        
        // Vérifier d'abord le cache
        if (preloadedModels.has(url)) {
          console.log('Modèle trouvé dans le cache:', url);
          const cachedModel = preloadedModels.get(url);
          setGltf(cachedModel);
          setIsLoading(false);
          return;
        }
        
        // Si pas dans le cache, charger normalement
        console.log('Modèle non trouvé dans le cache, chargement direct:', url);
        const loader = new GLTFLoader();
        const loadedGltf = await new Promise((resolve, reject) => {
          loader.load(
            url,
            (gltf) => resolve(gltf),
            undefined,
            (error) => reject(error)
          );
        });
        
        setGltf(loadedGltf);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du modèle 3D:', url, error);
        setIsLoading(false);
        onError?.();
      }
    };

    loadModel();
  }, [url, preloadedModels, onError]);

  // Animation de rotation automatique
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!gltf || !gltf.scene) {
    console.error('Modèle GLTF invalide:', url);
    onError?.();
    return null;
  }

  return (
    <group ref={modelRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}

// Fallback pour le chargement - compatible avec React Three Fiber
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ff00" wireframe />
    </mesh>
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
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  const { preloadedModels, isPreloading } = useModelCache();

  // Gérer les erreurs de chargement avec retry
  const handleError = () => {
    if (retryCount < maxRetries) {
      console.log(`Tentative de rechargement ${retryCount + 1}/${maxRetries} pour:`, modelUrl);
      setRetryCount(prev => prev + 1);
      // Forcer un re-render après un délai
      setTimeout(() => {
        setHasError(false);
      }, 1000);
    } else {
      console.error('Échec définitif du chargement après', maxRetries, 'tentatives:', modelUrl);
      setHasError(true);
    }
  };

  // Reset retry count when modelUrl changes
  useEffect(() => {
    setRetryCount(0);
    setHasError(false);
  }, [modelUrl]);

  // Si modelUrl est vide, afficher directement le fallback d'erreur
  if (!modelUrl) {
    return (
      <motion.div 
        className={`rotating-3d-container ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={onClick}
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
    >
      {hasError ? (
        <ErrorFallback productName={displayName} images={images} />
      ) : (
        <>
          <Canvas 
            style={{ 
              background: backgroundColor,
              width: '100%',
              height: '100%',
              display: 'block'
            }}
            camera={{ position: [0, 0, 5], fov: 50 }}
            onCreated={({ gl }) => {
              // Configuration WebGL pour une meilleure stabilité
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              gl.setClearColor(0x000000, 0);
            }}
            onError={(error) => {
              console.error('Erreur Canvas WebGL:', error);
              handleError();
            }}
          >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Suspense fallback={<LoadingFallback />}>
              <Model url={modelUrl} scale={scale} position={position} rotation={rotation} onError={handleError} />
              <Environment preset="city" />
              {showControls && <OrbitControls enableZoom={false} enablePan={false} />}
            </Suspense>
          </Canvas>
          
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blakkout-background/80 to-transparent p-4 text-center">
            <h3 className="font-display text-2xl md:text-3xl text-blakkout-primary">{displayName}</h3>
            {displayPrice && <p className="font-mono text-lg md:text-xl text-blakkout-accent">{displayPrice}</p>}
            
            {/* Indicateur de statut du modèle */}
            <div className="mt-2 flex items-center justify-center gap-2 text-xs font-mono opacity-60">
              {preloadedModels.has(modelUrl) ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-400">MODÈLE 3D PRÊT</span>
                </>
              ) : isPreloading ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-spin"></div>
                  <span className="text-yellow-400">PRÉCHARGEMENT...</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-blue-400">CHARGEMENT 3D</span>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}