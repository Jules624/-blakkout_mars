import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import RotatingMerch3D, { ModelCacheProvider } from '@/components/merch/RotatingMerch3D';
import TVBlackout from '@/components/effects/TVBlackout';

// Types pour les produits
type ProductCategory = 'clothing' | 'accessories' | 'prints' | 'limited';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  modelUrl: string;
  images: string[];
  available: boolean;
  isLimited?: boolean;
  limitedQuantity?: number;
};

// Données d'exemple pour les produits
const products: Product[] = [
  {
    id: 'prod-001',
    name: 'T-SHIRT NEURAL NETWORK',
    description: 'T-shirt noir avec impression circuit imprimé et logo @blakkout_mars. 100% coton biologique.',
    price: 35,
    category: 'clothing',
    modelUrl: '/assets/models/tshirt.glb',
    images: [
      '/assets/images/merch/tshirt-front.jpg',
      '/assets/images/merch/tshirt-back.jpg',
    ],
    available: true,
  },
  {
    id: 'prod-002',
    name: 'HOODIE SYSTEM FAILURE',
    description: 'Hoodie noir avec impression glitch et code binaire. Intérieur polaire, 80% coton, 20% polyester recyclé.',
    price: 65,
    category: 'clothing',
    modelUrl: '/assets/models/hoodie.glb',
    images: [
      '/assets/images/merch/hoodie-front.jpg',
      '/assets/images/merch/hoodie-back.jpg',
    ],
    available: true,
  },
  {
    id: 'prod-003',
    name: 'CASQUETTE ACCESS',
    description: 'Casquette snapback noire avec broderie logo @blakkout_mars et détails réfléchissants.',
    price: 25,
    category: 'accessories',
    modelUrl: '/assets/models/cap.glb',
    images: [
      '/assets/images/merch/cap-front.jpg',
      '/assets/images/merch/cap-side.jpg',
    ],
    available: true,
  },
  {
    id: 'prod-004',
    name: 'TOTE BAG GLITCH',
    description: 'Tote bag en coton avec impression glitch et coordonnées cryptiques. Double face, anses renforcées.',
    price: 20,
    category: 'accessories',
    modelUrl: '/assets/models/totebag.glb',
    images: [
      '/assets/images/merch/totebag-front.jpg',
      '/assets/images/merch/totebag-detail.jpg',
    ],
    available: true,
  },
  {
    id: 'prod-005',
    name: 'POSTER BLACKOUT EDITION',
    description: 'Poster A2 sérigraphié avec encre phosphorescente. Visible uniquement dans le noir.',
    price: 15,
    category: 'prints',
    modelUrl: '/assets/models/poster.glb',
    images: [
      '/assets/images/merch/poster-light.jpg',
      '/assets/images/merch/poster-dark.jpg',
    ],
    available: true,
  },
  {
    id: 'prod-006',
    name: 'VESTE TECH LIMITED',
    description: 'Veste technique avec détails réfléchissants et circuits LED intégrés. Édition limitée numérotée.',
    price: 120,
    category: 'limited',
    modelUrl: '/assets/models/jacket.glb',
    images: [
      '/assets/images/merch/jacket-front.jpg',
      '/assets/images/merch/jacket-back.jpg',
    ],
    available: true,
    isLimited: true,
    limitedQuantity: 50,
  },
];

export default function Merch() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<{productId: string, quantity: number}[]>([]);

  
  // Filtrer les produits par catégorie
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  // Ajouter au panier
  const addToCart = (productId: string) => {
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { productId, quantity: 1 }]);
    }
    
    // Notification de succès
    alert('Produit ajouté au panier');
  };
  
  // Calculer le total du panier
  const cartTotal = cartItems.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
  
  return (
    <Layout>
      <NextSeo title="Merchandising" />
      <ModelCacheProvider>
        <TVBlackout initialDelay={1000} frequency={0.05}>
          <div className="circuit-bg py-20 pt-32">
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-2 font-display text-4xl text-blakkout-primary">MERCHANDISING</h1>
              <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
              <p className="mt-4 font-mono text-blakkout-foreground">
                Découvrez notre collection de vêtements et accessoires exclusifs.
              </p>
            </motion.div>
            {/* Filtres par catégorie */}
            <motion.div 
              className="mb-8 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button 
                onClick={() => setActiveCategory('all')}
                className={`hacker-button ${activeCategory === 'all' ? 'active' : ''}`}
              >
                TOUS
              </button>
              <button 
                onClick={() => setActiveCategory('clothing')}
                className={`hacker-button ${activeCategory === 'clothing' ? 'active' : ''}`}
              >
                VÊTEMENTS
              </button>
              <button 
                onClick={() => setActiveCategory('accessories')}
                className={`hacker-button ${activeCategory === 'accessories' ? 'active' : ''}`}
              >
                ACCESSOIRES
              </button>
              <button 
                onClick={() => setActiveCategory('prints')}
                className={`hacker-button ${activeCategory === 'prints' ? 'active' : ''}`}
              >
                PRINTS
              </button>
              <button 
                onClick={() => setActiveCategory('limited')}
                className={`hacker-button ${activeCategory === 'limited' ? 'active' : ''}`}
              >
                ÉDITION LIMITÉE
              </button>
            </motion.div>
            {/* Grille de produits */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group relative overflow-hidden rounded-lg border border-blakkout-primary/20 bg-blakkout-background/80 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {/* Badge édition limitée */}
                    {product.isLimited && (
                      <div className="absolute top-2 right-2 z-10 bg-blakkout-primary px-2 py-1 text-xs font-mono text-black">
                        LIMITED
                      </div>
                    )}
                    {/* Modèle 3D */}
                    <div className="aspect-square relative">
                      <RotatingMerch3D
                        key={`${product.id}-${activeCategory}`}
                        modelUrl={product.modelUrl}
                        productName={product.name}
                        images={product.images}
                        scale={[1, 1, 1]}
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        backgroundColor="#0a0a0a"
                        showControls={false}
                        autoRotate={true}
                        className="w-full h-full"
                      />
                     </div>
                    {/* Informations produit */}
                    <div className="p-4">
                      <h3 className="mb-2 font-mono text-lg text-blakkout-primary">
                        {product.name}
                      </h3>
                      <p className="mb-3 text-sm text-blakkout-foreground/80">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xl text-blakkout-primary">
                          {product.price}€
                        </span>
                        {product.available ? (
                          <button
                            onClick={() => addToCart(product.id)}
                            className="hacker-button text-sm"
                          >
                            AJOUTER AU PANIER
                          </button>
                        ) : (
                          <span className="font-mono text-sm text-red-500">
                            RUPTURE DE STOCK
                          </span>
                        )}
                      </div>
                      {product.isLimited && product.limitedQuantity && (
                        <div className="mt-2 text-xs font-mono text-blakkout-primary/60">
                          Seulement {product.limitedQuantity} exemplaires
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {/* Panier flottant */}
            {cartItems.length > 0 && (
              <motion.div
                className="fixed bottom-4 right-4 bg-blakkout-primary text-black p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="font-mono text-sm">
                  <div className="mb-2">
                    Panier ({cartItems.reduce((total, item) => total + item.quantity, 0)} articles)
                  </div>
                  <div className="font-bold">
                    Total: {cartTotal}€
                  </div>
                  <button className="mt-2 w-full bg-black text-blakkout-primary px-3 py-1 rounded text-xs hover:bg-gray-800 transition-colors">
                    COMMANDER
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          </div>
        </TVBlackout>
      </ModelCacheProvider>
    </Layout>
  );
}
