import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEasterEggs } from '@/context/EasterEggContext';

type Command = {
  command: string;
  description: string;
  action: (args: string[]) => string | JSX.Element | Promise<string | JSX.Element>;
  isHidden?: boolean;
};

type TerminalInputProps = {
  prompt?: string;
  initialMessage?: string;
  availableCommands?: Command[];
  onCommandExecute?: (command: string, output: string | JSX.Element) => void;
  className?: string;
  maxHistory?: number;
};

export default function TerminalInput({
  prompt = 'user@blakkout:~$',
  initialMessage = 'Tapez "help" pour voir les commandes disponibles.',
  availableCommands = [],
  onCommandExecute,
  className = '',
  maxHistory = 50,
}: TerminalInputProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ command: string; output: string | JSX.Element }>>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { triggerEasterEgg } = useEasterEggs();

  // Commandes par défaut
  const defaultCommands: Command[] = [
    {
      command: 'help',
      description: 'Affiche la liste des commandes disponibles',
      action: () => {
        const allCommands = [...defaultCommands, ...availableCommands].filter(cmd => !cmd.isHidden);
        return (
          <div className="space-y-1">
            <div className="text-blakkout-accent">Commandes disponibles:</div>
            {allCommands.map((cmd, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-blakkout-primary">{cmd.command}</span>
                <span className="text-blakkout-text/70">{cmd.description}</span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      command: 'clear',
      description: 'Efface l\'historique du terminal',
      action: () => {
        setHistory([]);
        return 'Terminal effacé.';
      },
    },
    {
      command: 'whoami',
      description: 'Affiche des informations sur l\'utilisateur',
      action: () => 'Visiteur anonyme du réseau BLAKKOUT',
    },
    {
      command: 'date',
      description: 'Affiche la date et l\'heure actuelles',
      action: () => new Date().toLocaleString('fr-FR'),
    },
    {
      command: 'echo',
      description: 'Répète le texte fourni',
      action: (args) => args.join(' ') || 'Usage: echo <texte>',
    },
  ];

  const allCommands = [...defaultCommands, ...availableCommands];

  // Auto-scroll vers le bas
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus automatique sur l'input
  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  // Gestion des touches
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      autoComplete();
    }
  };

  // Auto-complétion
  const autoComplete = () => {
    if (!input.trim()) return;

    const matches = allCommands.filter(cmd => 
      cmd.command.toLowerCase().startsWith(input.toLowerCase())
    );

    if (matches.length === 1) {
      setInput(matches[0].command + ' ');
    } else if (matches.length > 1) {
      const commonPrefix = findCommonPrefix(matches.map(cmd => cmd.command));
      if (commonPrefix.length > input.length) {
        setInput(commonPrefix);
      }
    }
  };

  // Trouver le préfixe commun
  const findCommonPrefix = (strings: string[]): string => {
    if (strings.length === 0) return '';
    
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (strings[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === '') return '';
      }
    }
    return prefix;
  };

  // Exécution des commandes
  const executeCommand = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    const trimmedInput = input.trim();
    const [commandName, ...args] = trimmedInput.split(' ');
    
    // Ajouter à l'historique des commandes
    setCommandHistory(prev => {
      const newHistory = [trimmedInput, ...prev.filter(cmd => cmd !== trimmedInput)];
      return newHistory.slice(0, maxHistory);
    });
    setHistoryIndex(-1);

    // Trouver et exécuter la commande
    const command = allCommands.find(cmd => cmd.command.toLowerCase() === commandName.toLowerCase());
    
    let output: string | JSX.Element;
    if (command) {
      try {
        output = await command.action(args);
      } catch (error) {
        output = `Erreur lors de l'exécution de la commande: ${error}`;
      }
    } else {
      output = (
        <div>
          <div className="text-blakkout-secondary">Commande non reconnue: {commandName}</div>
          <div className="text-blakkout-text/70 text-sm mt-1">
            Tapez "help" pour voir les commandes disponibles.
          </div>
        </div>
      );
    }

    // Ajouter à l'historique d'affichage
    setHistory(prev => {
      const newHistory = [...prev, { command: trimmedInput, output }];
      return newHistory.slice(-maxHistory);
    });

    // Callback externe
    if (onCommandExecute) {
      onCommandExecute(trimmedInput, output);
    }

    setInput('');
    setIsProcessing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-blakkout-background border border-blakkout-accent/30 rounded font-mono text-sm ${className}`}
    >
      {/* En-tête du terminal */}
      <div className="flex items-center justify-between bg-blakkout-accent/10 px-4 py-2 border-b border-blakkout-accent/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blakkout-secondary"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-blakkout-primary"></div>
        </div>
        <div className="text-blakkout-accent text-xs">BLAKKOUT TERMINAL v2.1</div>
      </div>

      {/* Contenu du terminal */}
      <div 
        ref={terminalRef}
        className="p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-track-blakkout-background scrollbar-thumb-blakkout-accent/30"
      >
        {/* Message initial */}
        {history.length === 0 && initialMessage && (
          <div className="text-blakkout-accent mb-4">{initialMessage}</div>
        )}

        {/* Historique */}
        {history.map((entry, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-center space-x-2 text-blakkout-primary">
              <span className="text-blakkout-accent">{prompt}</span>
              <span>{entry.command}</span>
            </div>
            <div className="mt-1 pl-4 text-blakkout-text">
              {typeof entry.output === 'string' ? (
                <div className="whitespace-pre-wrap">{entry.output}</div>
              ) : (
                entry.output
              )}
            </div>
          </div>
        ))}

        {/* Ligne de commande actuelle */}
        <div className="flex items-center space-x-2">
          <span className="text-blakkout-accent">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-blakkout-primary outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {isProcessing && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-blakkout-accent"
            >
              ▋
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}