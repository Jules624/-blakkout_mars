import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TVBlackoutProps = {
  initialDelay?: number;
  frequency?: number;
  duration?: number;
};

export default function TVBlackout({
  initialDelay = 0,
  frequency = 0.1,
  duration = 0.15,
}: TVBlackoutProps) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    // Délai initial avant de commencer les effets
    const initialTimer = setTimeout(() => {
      setActive(true);
    }, initialDelay);

    return () => {
      clearTimeout(initialTimer);
      setActive(false);
    };
  }, [initialDelay]);

  useEffect(() => {
    if (!active) return;

    // Fonction pour déclencher aléatoirement l'effet de blackout
    const triggerRandomBlackout = () => {
      // Probabilité de déclencher un blackout à chaque intervalle
      if (Math.random() < frequency) {
        setVisible(true);
        
        // Durée du blackout
        setTimeout(() => {
          setVisible(false);
        }, duration * 1000);
      }
    };

    // Intervalle pour vérifier si on déclenche un blackout
    const interval = setInterval(triggerRandomBlackout, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [active, frequency, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="pointer-events-none fixed inset-0 z-[9999] bg-black"
          style={{
            mixBlendMode: 'multiply',
          }}
        >
          {/* Effet de lignes de scan TV */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.1) 2px,
                rgba(255, 255, 255, 0.1) 4px
              )`,
            }}
          />
          
          {/* Effet de bruit statique */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}