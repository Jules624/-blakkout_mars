import React, { createContext, useContext, useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { motion } from 'framer-motion';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Context for model cache management
interface ModelCacheContextType {
  cache: Map<string, any>;
  preloadModel: (url: string) => Promise<any>;
  clearCache: () => void;
}

const ModelCacheContext = createContext<ModelCacheContextType | null>(null);

const useModelCache = () => {
  const context = useContext(ModelCacheContext);
  if (!context) {
    throw new Error('useModelCache must be used within a ModelCacheProvider');
  }
  return context;
};

// Provider for model cache
interface ModelCacheProviderProps {
  children: React.ReactNode;
}

const ModelCacheProvider: React.FC<ModelCacheProviderProps> = ({ children }) => {
  const cacheRef = useRef(new Map<string, any>());
  const loadingManagerRef = useRef(new THREE.LoadingManager());

  // Clear cache and dispose of resources
  const clearCache = () => {
    cacheRef.current.forEach((gltf) => {
      if (gltf && gltf.scene) {
        gltf.scene.traverse((child: any) => {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: any) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    });
    cacheRef.current.clear();
  };

  // Preload a single model with timeout and error handling
  const preloadModel = async (url: string): Promise<any> => {
    if (cacheRef.current.has(url)) {
      return cacheRef.current.get(url);
    }

    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader(loadingManagerRef.current);
      const timeoutId = setTimeout(() => {
        reject(new Error(`Model loading timeout: ${url}`));
      }, 30000); // 30 second timeout

      // Vérifier que l'URL est valide avant de charger
      if (!url || !url.trim() || !url.endsWith('.glb') && !url.endsWith('.gltf')) {
        clearTimeout(timeoutId);
        reject(new Error(`Invalid model URL: ${url}`));
        return;
      }

      loader.load(
        url,
        (gltf) => {
          clearTimeout(timeoutId);
          cacheRef.current.set(url, gltf);
          resolve(gltf);
        },
        undefined,
        (error: unknown) => {
          clearTimeout(timeoutId);
          // Vérifier si l'erreur est liée à un parsing JSON
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('JSON.parse')) {
            console.error(`JSON parsing error while loading model: ${url}. This might be a server response issue.`, error);
          } else {
            console.error(`Failed to preload model: ${url}`, error);
          }
          reject(error);
        }
      );
    });
  };

  // Preload multiple models with progress tracking
  const preloadModels = async (urls: string[]) => {
    console.log('Starting model preloading...');
    let successCount = 0;
    let failCount = 0;

    const promises = urls.map(async (url, index) => {
      try {
        await preloadModel(url);
        successCount++;
        const progress = Math.round(((index + 1) / urls.length) * 100);
        console.log(`Preloading progress: ${progress}%`);
      } catch (error) {
        failCount++;
        console.error(`Failed to preload: ${url}`, error);
      }
    });

    await Promise.allSettled(promises);
    console.log(`Preloading completed: ${successCount} successful, ${failCount} failed`);
  };

  // Lazy loading strategy - delay preloading to avoid blocking initial render
  useEffect(() => {
    const modelUrls = [
      '/assets/models/tshirt.glb',
      '/assets/models/hoodie.glb',
      '/assets/models/cap.glb',
      '/assets/models/jacket.glb',
      '/assets/models/poster.glb',
      '/assets/models/totebag.glb'
    ];

    const timeoutId = setTimeout(() => {
      preloadModels(modelUrls);
    }, 1000); // Delay by 1 second

    return () => {
      clearTimeout(timeoutId);
      clearCache();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCache();
    };
  }, []);

  const value = {
    cache: cacheRef.current,
    preloadModel,
    clearCache
  };

  return (
    <ModelCacheContext.Provider value={value}>
      {children}
    </ModelCacheContext.Provider>
  );
};

// Model component with improved resource management
interface ModelProps {
  url: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: boolean;
}

const Model: React.FC<ModelProps> = ({ url, onLoad, onError, scale = [1, 1, 1], position = [0, 0, 0], rotation = [0, 0, 0], autoRotate = false }) => {
  const [gltf, setGltf] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const groupRef = useRef<THREE.Group>(null);
  const { cache, preloadModel } = useModelCache();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let timeoutId: NodeJS.Timeout;

    const loadModel = async () => {
      try {
        setIsLoading(true);
        
        // Set loading timeout
        timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            const timeoutError = new Error('Model loading timeout');
            onError?.(timeoutError);
          }
        }, 15000); // 15 second timeout

        const loadedGltf = await preloadModel(url);
        
        if (isMountedRef.current) {
          clearTimeout(timeoutId);
          setGltf(loadedGltf);
          setIsLoading(false);
          onLoad?.();
        }
      } catch (error) {
        if (isMountedRef.current) {
          clearTimeout(timeoutId);
          setIsLoading(false);
          onError?.(error as Error);
        }
      }
    };

    loadModel();

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, [url, preloadModel, onLoad, onError]);

  // Cleanup GLTF resources on unmount (only if not in cache)
  useEffect(() => {
    return () => {
      if (gltf && !cache.has(url)) {
        gltf.scene.traverse((child: any) => {
          if (child.geometry && !child.geometry.isBufferGeometry) {
            child.geometry.dispose();
          }
          if (child.material && typeof child.material.dispose === 'function') {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: any) => {
                if (typeof material.dispose === 'function') {
                  material.dispose();
                }
              });
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [gltf, url, cache]);

  const fallbackMeshRef = useRef<THREE.Mesh>(null);

  // Smooth rotation animation using delta time
  useFrame((state, delta) => {
    if (isLoading || !gltf) {
      if (fallbackMeshRef.current) {
        fallbackMeshRef.current.rotation.y += delta * 0.5;
      }
    } else {
      if (groupRef.current && autoRotate) {
        groupRef.current.rotation.y += delta * 0.5; // Consistent speed regardless of framerate
      }
    }
  });

  if (isLoading || !gltf) {
    return (
      <mesh ref={fallbackMeshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#666" wireframe />
      </mesh>
    );
  }

  return (
    <group ref={groupRef} scale={scale} position={position} rotation={rotation}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
};

// Loading fallback with subtle animation
const LoadingFallback: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#888" wireframe />
    </mesh>
  );
};

// Error fallback component
const ErrorFallback: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff4444" />
    </mesh>
  );
};

// Main component props
export interface RotatingMerch3DProps {
  modelUrl: string;
  productName: string;
  price: string;
  className?: string;
  images?: string[];
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  backgroundColor?: string;
  showControls?: boolean;
  autoRotate?: boolean;
}

// Inner component that uses the cache context
const RotatingMerch3DInner: React.FC<RotatingMerch3DProps> = ({
  modelUrl,
  productName,
  price,
  className = '',
  images,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  backgroundColor = '#0a0a0a',
  showControls = true,
  autoRotate = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { cache } = useModelCache();

  // Handle model loading errors with exponential backoff
  const handleError = (error: Error) => {
    console.error('Model loading error:', error);
    setHasError(true);
    setIsLoaded(false);

    // Retry with exponential backoff (max 3 retries)
    if (retryCount < 3) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      retryTimeoutRef.current = setTimeout(() => {
        console.log(`Retrying model load (attempt ${retryCount + 1})...`);
        setHasError(false);
        setRetryCount(prev => prev + 1);
      }, delay);
    }
  };

  const handleLoad = () => {
    setHasError(false);
    setRetryCount(0);
    setIsLoaded(true);
  };

  // Cleanup retry timeout on modelUrl change or unmount
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setRetryCount(0);
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [modelUrl]);

  // Get model status for UI indicators
  const getModelStatus = () => {
    if (isLoaded) return 'LOADED';
    if (cache.has(modelUrl)) return 'PRELOADED';
    if (hasError) return 'LOADING FAILED';
    return 'LOADING';
  };

  return (
    <div className={`relative w-full h-96 ${className}`}>
        {/* WebGL Canvas with optimized settings for stability and performance */}
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          style={{ backgroundColor }}
        >
          {/* Lighting setup for optimal 3D model visibility */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />
          
          {/* Enhanced OrbitControls with auto-rotation and smooth damping */}
          {showControls && (
            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              enableDamping
              dampingFactor={0.05}
              enableZoom={true}
              enablePan={false}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          )}
          
          <Suspense fallback={<LoadingFallback />}>
            {hasError ? (
              <ErrorFallback />
            ) : (
              <Model
                url={modelUrl}
                onLoad={handleLoad}
                onError={handleError}
                scale={scale}
                position={position}
                rotation={rotation}
                autoRotate={autoRotate}
              />
            )}
            

          </Suspense>
        </Canvas>
        
        {/* UI Overlay with model status indicators */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          {getModelStatus()}
        </div>
        
        {hasError && retryCount >= 3 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
            <div className="text-center">
              <div className="text-lg font-bold mb-2">2D PREVIEW • 3D MODEL UNAVAILABLE</div>
              <div className="text-sm opacity-75">Unable to load 3D model</div>
            </div>
          </div>
        )}
      </div>
  );
};

// Main RotatingMerch3D component with provider wrapper
const RotatingMerch3D: React.FC<RotatingMerch3DProps> = (props) => {
  return (
    <ModelCacheProvider>
      <RotatingMerch3DInner {...props} />
    </ModelCacheProvider>
  );
};

export default RotatingMerch3D;
export { ModelCacheProvider, useModelCache };