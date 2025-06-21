import React, { ReactNode, useState, useEffect } from 'react';
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
  const [isBlackout, setIsBlackout] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Configurer l'intensité de l'effet
  const intensityConfig = {
    low: { opacity: 0.7, blur: 1 },
    medium: { opacity: 0.9, blur: 2 },
    high: { opacity: 1, blur: 4 },
  };

  const { opacity, blur } = intensityConfig[intensity];

  // Effet pour initialiser avec un délai
  useEffect(() => {
    if (disabled) return;
    
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay, disabled]);

  // Effet pour déclencher les blackouts aléatoires
  useEffect(() => {
    if (!isInitialized || disabled) return;

    // Fonction pour déclencher un blackout
    const triggerBlackout = () => {
      setIsBlackout(true);
      
      // Rétablir après la durée spécifiée
      setTimeout(() => {
        setIsBlackout(false);
      }, duration);
    };

    // Programmer le prochain blackout
    const scheduleNextBlackout = (): NodeJS.Timeout => {
      const nextDelay = randomDelay(5000, 15000) / frequency;
      return setTimeout(() => {
        triggerBlackout();
        timeoutRef.current = scheduleNextBlackout();
      }, nextDelay);
    };

    // Référence pour pouvoir nettoyer le timeout
    const timeoutRef = { current: null as NodeJS.Timeout | null };
    timeoutRef.current = scheduleNextBlackout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isInitialized, frequency, duration, disabled]);

  // Variantes pour l'animation
  const blackoutVariants = {
    visible: { 
      opacity: opacity,
      filter: `blur(${blur}px)`,
      transition: { duration: 0.1 }
    },
    hidden: { 
      opacity: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="relative overflow-hidden">
      {children}
      
      <AnimatePresence>
        {isBlackout && (
          <motion.div
            className="absolute inset-0 z-50 bg-black"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={blackoutVariants}
          />
        )}
      </AnimatePresence>
    </div>
  );
}