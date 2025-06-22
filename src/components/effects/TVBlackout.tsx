import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
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

type FlickerState = 'normal' | 'flickering' | 'off';

type IntensityConfig = {
  maxFlickers: number;
  offDuration: [number, number];
};

export default function TVBlackout({
  children,
  initialDelay = 2000,
  frequency = 5,
  duration = 200,
  intensity = 'medium',
  disabled = false,
}: TVBlackoutProps) {
  const [flickerState, setFlickerState] = useState<FlickerState>('normal');
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentOpacity, setCurrentOpacity] = useState(1);

  // Refs for timer management
  const mainTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flickerTimeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Intensity configuration
  const intensityConfig: Record<string, IntensityConfig> = {
    low: { maxFlickers: 3, offDuration: [100, 300] },
    medium: { maxFlickers: 5, offDuration: [150, 500] },
    high: { maxFlickers: 8, offDuration: [200, 800] },
  };

  const { maxFlickers } = intensityConfig[intensity];

  // Clear all flicker timeouts
  const clearFlickerTimeouts = useCallback(() => {
    flickerTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    flickerTimeoutsRef.current.clear();
  }, []);

  // Add timeout to tracking set
  const addTimeout = useCallback((timeout: NodeJS.Timeout) => {
    flickerTimeoutsRef.current.add(timeout);
    return timeout;
  }, []);

  // Remove timeout from tracking set
  const removeTimeout = useCallback((timeout: NodeJS.Timeout) => {
    flickerTimeoutsRef.current.delete(timeout);
    clearTimeout(timeout);
  }, []);

  // Trigger neon flicker effect
  const triggerNeonFlicker = useCallback(() => {
    if (disabled) return;
    
    setFlickerState('flickering');
    
    // Random number of flickers
    const flickerCount = Math.floor(Math.random() * maxFlickers) + 2;
    let currentFlicker = 0;
    
    const performFlicker = () => {
      if (currentFlicker >= flickerCount) {
        // End of flickering, return to normal
        setFlickerState('normal');
        setCurrentOpacity(1);
        return;
      }
      
      // Irregular flicker pattern with variable opacities
      const flickerPattern = [
        { opacity: 0, duration: Math.random() * 50 + 30 }, // Quick blackout
        { opacity: Math.random() * 0.3 + 0.1, duration: Math.random() * 40 + 20 }, // Dim glow
        { opacity: 0, duration: Math.random() * 80 + 40 }, // Blackout
        { opacity: Math.random() * 0.6 + 0.4, duration: Math.random() * 60 + 30 }, // Partial recovery
      ];
      
      let patternIndex = 0;
      
      const executePattern = () => {
        if (patternIndex >= flickerPattern.length) {
          currentFlicker++;
          const nextFlickerTimeout = addTimeout(
            setTimeout(performFlicker, Math.random() * 100 + 50)
          );
          return;
        }
        
        const step = flickerPattern[patternIndex];
        setCurrentOpacity(step.opacity);
        
        const patternTimeout = addTimeout(
          setTimeout(() => {
            patternIndex++;
            executePattern();
          }, step.duration)
        );
      };
      
      executePattern();
    };
    
    performFlicker();
  }, [disabled, maxFlickers, addTimeout]);

  // Schedule next flicker
  const scheduleNextFlicker = useCallback((): NodeJS.Timeout => {
    const nextDelay = randomDelay(24000, 75000) / frequency;
    return setTimeout(() => {
      triggerNeonFlicker();
      mainTimeoutRef.current = scheduleNextFlicker();
    }, nextDelay);
  }, [frequency, triggerNeonFlicker]);

  // Initialize with delay
  useEffect(() => {
    if (disabled) return;
    
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay, disabled]);

  // Trigger irregular flickers
  useEffect(() => {
    if (!isInitialized || disabled) return;

    mainTimeoutRef.current = scheduleNextFlicker();

    return () => {
      if (mainTimeoutRef.current) {
        clearTimeout(mainTimeoutRef.current);
        mainTimeoutRef.current = null;
      }
      clearFlickerTimeouts();
    };
  }, [isInitialized, disabled, scheduleNextFlicker, clearFlickerTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mainTimeoutRef.current) {
        clearTimeout(mainTimeoutRef.current);
      }
      clearFlickerTimeouts();
    };
  }, [clearFlickerTimeouts]);

  if (disabled) {
    return <div className="relative overflow-hidden">{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden tv-blackout ${flickerState !== 'normal' ? 'flickering' : ''}`}>
      <motion.div
        animate={{ opacity: currentOpacity }}
        transition={{ duration: 0.05, ease: "linear" }}
        className="relative"
      >
        {children}
      </motion.div>
      
      {/* Overlay to simulate failing neon effect */}
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
      
      {/* Electric flicker effect */}
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