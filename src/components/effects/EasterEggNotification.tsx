import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEggs } from '@/context/EasterEggContext';

const EasterEggNotification = () => {
  const { easterEggs, getUnlockedRewards } = useEasterEggs();
  const [showNotification, setShowNotification] = useState(false);
  const [lastEasterEggCount, setLastEasterEggCount] = useState(0);
  
  const currentCount = Object.values(easterEggs).filter(Boolean).length;
  const unlockedRewards = getUnlockedRewards();
  
  useEffect(() => {
    // Afficher une notification si un nouvel easter egg a été trouvé
    if (currentCount > lastEasterEggCount && currentCount > 0) {
      setShowNotification(true);
      
      // Masquer la notification après 5 secondes
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    setLastEasterEggCount(currentCount);
  }, [currentCount, lastEasterEggCount]);
  
  if (currentCount === 0) return null;
  
  return (
    <>
      {/* Indicateur permanent en bas à droite */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-900/90 to-cyan-900/90 backdrop-blur-md rounded-full p-3 border border-green-400/50 shadow-lg cursor-pointer"
          onClick={() => window.location.href = '/rewards'}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏆</span>
            <div className="text-green-400 font-mono text-sm">
              <div className="font-bold">{currentCount}/5</div>
              <div className="text-xs text-green-300">Easter Eggs</div>
            </div>
          </div>
          
          {/* Pulse animation pour attirer l'attention */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Notification temporaire */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            className="fixed bottom-20 right-4 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-r from-green-900/95 to-cyan-900/95 backdrop-blur-md rounded-lg p-4 border border-green-400/50 shadow-xl">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎉</span>
                <div className="flex-1">
                  <h3 className="text-green-400 font-bold font-mono text-sm mb-1">
                    NOUVEAU EASTER EGG TROUVÉ!
                  </h3>
                  <p className="text-green-300 text-xs mb-2">
                    Vous avez débloqué {currentCount} easter egg{currentCount > 1 ? 's' : ''} sur 5
                  </p>
                  <button
                    onClick={() => window.location.href = '/rewards'}
                    className="text-cyan-400 text-xs underline hover:text-cyan-300 transition-colors"
                  >
                    Voir mes récompenses →
                  </button>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Barre de progression en haut de l'écran */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentCount / 5 }}
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 z-50 origin-left"
        style={{ width: '100%' }}
      />
    </>
  );
};

export default EasterEggNotification;