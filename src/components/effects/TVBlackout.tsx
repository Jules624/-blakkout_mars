import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { randomDelay } from '@/lib/utils';

type TVBlackoutProps = {
  children: ReactNode;
  initialDelay?: number;
  frequency?: number;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  disabled?: boolean;
};

export default function TVBlackout({
  children,
  initialDelay = 2000,
  frequency = 5,
  duration = 200,
  intensity = 'medium',
  disabled = false,
}: TVBlackoutProps) {
  const [flickerState, setFlickerState] = useState<'normal' | 'flickering' | 'off'>('normal');
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentOpacity, setCurrentOpacity] = useState(1);

  // Configurer l'intensité de l'effet
  const intensityConfig = {
    low: { maxFlickers: 3, offDuration: [100, 300] },
    medium: { maxFlickers: 5, offDuration: [150, 500] },
    high: { maxFlickers: 8, offDuration: [200, 800] },
  };

  const { maxFlickers, offDuration } = intensityConfig[intensity];

  // Effet pour initialiser avec un délai
  useEffect(() => {
    if (disabled) return;
    
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay, disabled]);

  // Effet pour déclencher les clignotements irréguliers
  useEffect(() => {
    if (!isInitialized || disabled) return;

    // Fonction pour créer un clignotement irrégulier comme un néon défaillant
    const triggerNeonFlicker = () => {
      setFlickerState('flickering');
      
      // Nombre aléatoire de clignotements
      const flickerCount = Math.floor(Math.random() * maxFlickers) + 2;
      let currentFlicker = 0;
      
      const performFlicker = () => {
        if (currentFlicker >= flickerCount) {
          // Fin du clignotement, retour à la normale
          setFlickerState('normal');
          setCurrentOpacity(1);
          return;
        }
        
        // Clignotement irrégulier avec opacités variables
        const flickerPattern = [
          { opacity: 0, duration: Math.random() * 50 + 30 }, // Extinction rapide
          { opacity: Math.random() * 0.3 + 0.1, duration: Math.random() * 40 + 20 }, // Faible lueur
          { opacity: 0, duration: Math.random() * 80 + 40 }, // Extinction
          { opacity: Math.random() * 0.6 + 0.4, duration: Math.random() * 60 + 30 }, // Rallumage partiel
        ];
        
        let patternIndex = 0;
        
        const executePattern = () => {
          if (patternIndex >= flickerPattern.length) {
            currentFlicker++;
            setTimeout(performFlicker, Math.random() * 100 + 50);
            return;
          }
          
          const step = flickerPattern[patternIndex];
          setCurrentOpacity(step.opacity);
          
          setTimeout(() => {
            patternIndex++;
            executePattern();
          }, step.duration);
        };
        
        executePattern();
      };
      
      performFlicker();
    };

    // Programmer le prochain clignotement
    const scheduleNextFlicker = (): NodeJS.Timeout => {
      const nextDelay = randomDelay(24000, 75000) / frequency;
      return setTimeout(() => {
        triggerNeonFlicker();
        timeoutRef.current = scheduleNextFlicker();
      }, nextDelay);
    };

    // Référence pour pouvoir nettoyer le timeout
    const timeoutRef = { current: null as NodeJS.Timeout | null };
    timeoutRef.current = scheduleNextFlicker();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isInitialized, frequency, maxFlickers, disabled]);

  return (
    <div className={`relative overflow-hidden tv-blackout ${flickerState !== 'normal' ? 'flickering' : ''}`}>
      <motion.div
        animate={{ opacity: currentOpacity }}
        transition={{ duration: 0.05, ease: "linear" }}
        className="relative"
      >
        {children}
      </motion.div>
      
      {/* Overlay pour simuler l'effet néon défaillant */}
      <AnimatePresence>
        {flickerState === 'flickering' && currentOpacity < 0.8 && (
          <motion.div
            className="absolute inset-0 z-10 bg-black pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - currentOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.02, ease: "linear" }}
          />
        )}
      </AnimatePresence>
      
      {/* Effet de scintillement électrique */}
      {flickerState === 'flickering' && (
        <motion.div
          className="absolute inset-0 z-5 pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(0,255,0,${currentOpacity * 0.1}) 0%, transparent 70%)`,
            filter: 'blur(1px)'
          }}
          animate={{
            opacity: [0.3, 0.7, 0.2, 0.9, 0.1],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
    </div>
  );
}