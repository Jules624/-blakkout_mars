import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkEasterEgg } from '@/lib/utils';
import toast from 'react-hot-toast';

type EasterEggContextType = {
  easterEggs: Record<string, boolean>;
  activateEasterEgg: (code: string) => void;
  triggerEasterEgg: (code: string) => void;
  resetEasterEggs: () => void;
};

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined);

export function useEasterEggs() {
  const context = useContext(EasterEggContext);
  if (context === undefined) {
    throw new Error('useEasterEggs must be used within an EasterEggProvider');
  }
  return context;
}

type EasterEggProviderProps = {
  children: ReactNode;
};

export function EasterEggProvider({ children }: EasterEggProviderProps) {
  // État pour suivre les easter eggs trouvés
  const [easterEggs, setEasterEggs] = useState<Record<string, boolean>>({
    konami: false,
    consoleAccess: false,
    glitch: false,
    hidden: false,
    matrix: false,
  });

  // Fonction pour activer un easter egg
  const activateEasterEgg = (code: string) => {
    const easterEggFound = checkEasterEgg(code, easterEggs);
    
    if (easterEggFound) {
      setEasterEggs(prev => ({
        ...prev,
        [easterEggFound]: true,
      }));
      
      // Notification pour l'utilisateur
      toast.success(`Easter Egg trouvé : ${easterEggFound}`, {
        icon: '🔓',
        duration: 5000,
      });
      
      // Enregistrer dans le localStorage
      localStorage.setItem('blakkout_easter_eggs', JSON.stringify({
        ...easterEggs,
        [easterEggFound]: true,
      }));
    }
  };

  // Fonction pour réinitialiser tous les easter eggs
  const resetEasterEggs = () => {
    setEasterEggs({
      konami: false,
      consoleAccess: false,
      glitch: false,
      hidden: false,
      matrix: false,
    });
    localStorage.removeItem('blakkout_easter_eggs');
    toast.success('Easter Eggs réinitialisés', {
      icon: '🔄',
      duration: 3000,
    });
  };

  // Charger les easter eggs depuis le localStorage au montage
  useEffect(() => {
    const savedEasterEggs = localStorage.getItem('blakkout_easter_eggs');
    if (savedEasterEggs) {
      try {
        const parsed = JSON.parse(savedEasterEggs);
        setEasterEggs(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Erreur lors du chargement des easter eggs:', error);
      }
    }
  }, []);

  // Écouter les séquences de touches pour les easter eggs
  useEffect(() => {
    let keySequence = '';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ajouter la touche à la séquence
      keySequence += e.key;
      
      // Limiter la longueur de la séquence pour éviter une consommation excessive de mémoire
      if (keySequence.length > 50) {
        keySequence = keySequence.slice(-50);
      }
      
      // Vérifier si la séquence contient un code d'easter egg
      activateEasterEgg(keySequence);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [easterEggs]);

  // Alias pour triggerEasterEgg (même fonction qu'activateEasterEgg)
  const triggerEasterEgg = activateEasterEgg;

  const value = {
    easterEggs,
    activateEasterEgg,
    triggerEasterEgg,
    resetEasterEggs,
  };

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  );
}
