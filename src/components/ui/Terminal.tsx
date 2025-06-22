import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEggs } from '@/context/EasterEggContext';
import { cn } from '@/lib/utils';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

export const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'BLAKKOUT Terminal v2.0.77 - Accès sécurisé activé',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Tapez "help" pour voir les commandes disponibles',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { activateEasterEgg, easterEggs } = useEasterEggs();

  // Commandes disponibles
  const commands = {
    help: () => [
      'Commandes disponibles:',
      '  help - Affiche cette aide',
      '  clear - Efface le terminal',
      '  status - Affiche le statut du système',
      '  scan - Recherche des anomalies',
      '  access - Tente un accès privilégié',
      '  matrix - Initialise la matrice',
      '  glitch - Détecte les anomalies',
      '  find_the_truth - Recherche la vérité',
      '  konami - Code secret des années 80',
      '  exit - Ferme le terminal',
      '',
      'Astuce: Certaines commandes peuvent débloquer des secrets...'
    ],
    clear: () => {
      setLines([]);
      return [];
    },
    status: () => [
      'SYSTÈME: OPÉRATIONNEL',
      'SÉCURITÉ: NIVEAU 3',
      'ACCÈS: LIMITÉ',
      `EASTER EGGS: ${Object.values(easterEggs).filter(Boolean).length}/5`,
      'DERNIÈRE CONNEXION: ' + new Date().toLocaleString()
    ],
    scan: () => [
      'Scan en cours...',
      '████████████████████████████████ 100%',
      'ANOMALIES DÉTECTÉES:',
      '- Signature cryptographique non standard',
      '- Protocole de communication inconnu',
      '- Accès root potentiel disponible'
    ],
    access: () => {
      // Activer l'easter egg consoleAccess
      activateEasterEgg('activate_consoleAccess');
      return [
        'Tentative d\'accès privilégié...',
        'Vérification des credentials...',
        '✓ ACCÈS ACCORDÉ',
        'Bienvenue, Agent.'
      ];
    },
    matrix: () => {
      // Activer l'easter egg matrix
      activateEasterEgg('activate_matrix');
      return [
        'Initialisation de la matrice...',
        '01001000 01100101 01101100 01101100 01101111',
        'Connexion établie avec le réseau.',
        'Suivez le lapin blanc...'
      ];
    },
    glitch: () => {
      // Activer l'easter egg glitch
      activateEasterEgg('activate_glitch');
      return [
        'Détection d\'anomalie système...',
        'ERROR: Reality.exe has stopped working',
        '⚡ GLITCH DÉTECTÉ ⚡',
        'Réalité compromise. Redémarrage en cours...'
      ];
    },
    'find_the_truth': () => {
      // Activer l'easter egg hidden
      activateEasterEgg('activate_hidden');
      return [
        'Recherche de la vérité...',
        'Accès aux fichiers classifiés...',
        '🔍 VÉRITÉ RÉVÉLÉE 🔍',
        'La réalité n\'est qu\'une illusion.'
      ];
    },
    konami: () => {
      // Activer l'easter egg konami
      activateEasterEgg('activate_konami');
      return [
        '🎮 CODE KONAMI DÉTECTÉ 🎮',
        'Accès VIP accordé.',
        'Bienvenue dans le club secret.'
      ];
    },
    exit: () => {
      onClose();
      return ['Terminal fermé.'];
    }
  };

  // Ajouter une ligne au terminal
  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  // Exécuter une commande
  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    // Ajouter la commande à l'historique
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Afficher la commande tapée
    addLine('input', `> ${command}`);
    
    if (trimmedCommand === '') return;
    
    // Exécuter la commande
    if (commands[trimmedCommand as keyof typeof commands]) {
      const result = commands[trimmedCommand as keyof typeof commands]();
      if (Array.isArray(result)) {
        result.forEach(line => addLine('output', line));
      }
    } else {
      addLine('error', `Commande inconnue: ${trimmedCommand}`);
      addLine('output', 'Tapez "help" pour voir les commandes disponibles');
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  // Gérer les touches spéciales
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Auto-scroll vers le bas
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus sur l'input quand le terminal s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-4xl h-96 mx-4 bg-black border border-green-500 rounded-lg overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-green-500/10 border-b border-green-500 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-green-400 font-mono text-sm">BLAKKOUT Terminal</h3>
            <button
              onClick={onClose}
              className="text-green-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="h-80 overflow-y-auto p-4 font-mono text-sm bg-black"
          >
            {lines.map((line) => (
              <div
                key={line.id}
                className={cn(
                  'mb-1',
                  line.type === 'input' && 'text-white',
                  line.type === 'output' && 'text-green-400',
                  line.type === 'error' && 'text-red-400',
                  line.type === 'success' && 'text-cyan-400'
                )}
              >
                {line.content}
              </div>
            ))}
            
            {/* Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-green-400 mr-2"></span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white outline-none font-mono"
                placeholder="Tapez une commande..."
                autoComplete="off"
              />
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Terminal;