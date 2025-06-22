import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { checkEasterEgg, activateEasterEggByName } from '@/lib/utils';
import toast from 'react-hot-toast';

type EasterEggContextType = {
  easterEggs: Record<string, boolean>;
  activateEasterEgg: (code: string) => void;
  triggerEasterEgg: (code: string) => void;
  resetEasterEggs: () => void;
  testNotification: () => void;
  getUnlockedRewards: () => string[];
  isAllEasterEggsFound: () => boolean;
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
  const recentlyActivatedRef = useRef<Set<string>>(new Set());

  // Récompenses débloquées selon les easter eggs trouvés
  const rewards = {
    konami: "🎮 ACCÈS VIP: Code d'entrée pour l'événement secret du 15 Mars 2024",
    consoleAccess: "💻 LEAK: Prochaine fête au Bunker 42, Rue de la Résistance",
    glitch: "⚡ EXCLUSIF: Set DJ NEURAL à 23h47 - Fréquence 108.7 FM",
    hidden: "🔍 INTEL: Mot de passe WiFi événement: 'BLAKKOUT_2077'",
    matrix: "🐰 ULTIMATE: Coordonnées GPS du lieu secret - 48.8566° N, 2.3522° E"
  };

  // Fonction pour activer un easter egg
  const activateEasterEgg = useCallback((code: string) => {
    let easterEggFound: string | null = null;
    
    // Vérifier si c'est une activation directe (préfixe 'activate_')
    if (code.startsWith('activate_')) {
      const easterEggName = code.replace('activate_', '');
      easterEggFound = activateEasterEggByName(easterEggName, easterEggs);
    } else {
      // Sinon, vérifier avec le système de codes normal
      easterEggFound = checkEasterEgg(code, easterEggs);
    }
    
    // Vérifier si l'easter egg existe, n'est pas déjà débloqué, et n'a pas été récemment activé
    if (easterEggFound && !easterEggs[easterEggFound] && !recentlyActivatedRef.current.has(easterEggFound)) {
      // Ajouter à la liste des récemment activés pour éviter les doublons
      recentlyActivatedRef.current.add(easterEggFound);
      
      // Retirer de la liste après 1 seconde
      setTimeout(() => {
        recentlyActivatedRef.current.delete(easterEggFound!);
      }, 1000);
      const updatedEggs = {
        ...easterEggs,
        [easterEggFound]: true,
      };
      
      setEasterEggs(updatedEggs);
      
      // Notification pour l'utilisateur avec récompense
      const reward = rewards[easterEggFound as keyof typeof rewards];
      toast.success(`🔓 Easter Egg trouvé: ${easterEggFound}\n\n🎁 RÉCOMPENSE DÉBLOQUÉE:\n${reward}`, {
        icon: '🔓',
        duration: 8000,
        style: {
          background: '#0a0a0a',
          color: '#00ff41',
          border: '1px solid #00ff41',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxWidth: '400px'
        }
      });

      // Vérifier si tous les easter eggs sont trouvés
      const allFound = Object.values(updatedEggs).every(found => found);
      
      if (allFound) {
        setTimeout(() => {
          toast.success(`🏆 FÉLICITATIONS! TOUS LES EASTER EGGS TROUVÉS!\n\n🎊 RÉCOMPENSE ULTIME DÉBLOQUÉE:\n🌟 Accès exclusif à la RAVE SECRÈTE du 31 Mars\n📍 Location: Ancienne station de métro Bastille\n🕒 Heure: 00:00 - Code d'entrée: BLAKKOUT_MASTER`, {
            icon: '👑',
            duration: 15000,
            style: {
              background: 'linear-gradient(45deg, #ff0080, #00ff41)',
              color: '#000',
              border: '2px solid #fff',
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 'bold',
              maxWidth: '500px'
            }
          });
        }, 2000);
      }
      
      // Enregistrer dans le localStorage
      localStorage.setItem('blakkout_easter_eggs', JSON.stringify(updatedEggs));
    }
  }, [easterEggs, setEasterEggs]);

  // Fonction pour réinitialiser tous les easter eggs
  const resetEasterEggs = () => {
    const resetEggs = {
      hidden: false,
      glitch: false,
      consoleAccess: false,
      konami: false,
      matrix: false,
    };
    setEasterEggs(resetEggs);
    localStorage.setItem('blakkout_easter_eggs', JSON.stringify(resetEggs));
    recentlyActivatedRef.current.clear(); // Vider aussi le cache de debounce
    toast.success('🔄 Easter eggs réinitialisés!', {
      icon: '🔄',
      duration: 3000,
      style: {
        background: '#0a0a0a',
        color: '#00ff41',
        border: '1px solid #00ff41',
        fontFamily: 'monospace'
      }
    });
  };

  // Fonction de debug pour tester les notifications
  const testNotification = () => {
    toast.success('🧪 Test de notification!', {
      icon: '🧪',
      duration: 3000,
      style: {
        background: '#0a0a0a',
        color: '#00ff41',
        border: '1px solid #00ff41',
        fontFamily: 'monospace'
      }
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
    let lastKeyTime = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      
      // Réinitialiser la séquence si plus de 2 secondes se sont écoulées
      if (currentTime - lastKeyTime > 2000) {
        keySequence = '';
      }
      
      lastKeyTime = currentTime;
      
      // Construire la clé en fonction du type de touche
      let keyToAdd = '';
      if (e.key.startsWith('Arrow')) {
        keyToAdd = e.key;
      } else if (e.key === 'b' || e.key === 'B') {
        keyToAdd = 'KeyB';
      } else if (e.key === 'a' || e.key === 'A') {
        keyToAdd = 'KeyA';
      } else {
        keyToAdd = e.key;
      }
      
      // Ajouter la touche à la séquence
      keySequence += keyToAdd;
      
      // Limiter la longueur de la séquence
      if (keySequence.length > 100) {
        keySequence = keySequence.slice(-50);
      }
      
      // Vérifier si la séquence contient un code d'easter egg
      activateEasterEgg(keySequence);
      
      // Debug pour le code Konami
      if (keySequence.includes('ArrowUp')) {
        console.log('Séquence actuelle:', keySequence);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [easterEggs]);

  // Fonction pour obtenir les récompenses débloquées
  const getUnlockedRewards = (): string[] => {
    return Object.entries(easterEggs)
      .filter(([_, found]) => found)
      .map(([key, _]) => rewards[key as keyof typeof rewards]);
  };

  // Fonction pour vérifier si tous les easter eggs sont trouvés
  const isAllEasterEggsFound = (): boolean => {
    return Object.values(easterEggs).every(found => found);
  };

  // Alias pour triggerEasterEgg (même fonction qu'activateEasterEgg)
  const triggerEasterEgg = activateEasterEgg;

  const value = {
    easterEggs,
    activateEasterEgg,
    triggerEasterEgg,
    resetEasterEggs,
    getUnlockedRewards,
    isAllEasterEggsFound,
    testNotification,
  };

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  );
}
