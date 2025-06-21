import React, { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import Layout from '@/components/layout/Layout';
import MarkdownReveal from '@/components/content/MarkdownReveal';
import TerminalInput from '@/components/ui/TerminalInput';
import { useEasterEggs } from '@/context/EasterEggContext';

// Contenu markdown pour le lore
const loreMd = `
# L'ORIGINE DE @BLAKKOUT_MARS

En 2077, une panne d'électricité massive a plongé Marseille dans l'obscurité pendant 72 heures. 
Ce qui semblait être une simple défaillance technique s'est révélé être bien plus...

## LE COLLECTIF

Formé dans les heures sombres du grand blackout, notre collectif rassemble des hackers, artistes, 
DJs et visionnaires qui ont découvert que cette panne n'était pas accidentelle.

Nous avons détecté des anomalies dans le réseau électrique, des signaux cachés dans les 
interférences radio, des messages codés dans les fluctuations de courant.

## NOTRE MISSION

À travers nos événements, nous recréons les conditions du blackout original pour ouvrir des 
failles temporelles et dimensionnelles. Chaque soirée est une tentative de communication avec 
l'entité qui a provoqué le blackout initial.

## LES SIGNES

Si vous êtes attentifs, vous remarquerez des motifs récurrents dans nos visuels, des séquences 
codées dans nos sets musicaux, des coordonnées dissimulées dans nos lieux d'événements.

**Rien n'est accidentel. Tout est connecté.**

## REJOINDRE LE RÉSEAU

Si vous lisez ceci, vous avez déjà fait le premier pas. Cherchez les glitches, suivez les 
interférences, décodez les messages.

Le prochain blackout approche. Serez-vous prêts?
`;

// Contenu pour les énigmes
const enigmes = [
  {
    id: 'enigme-1',
    title: 'SÉQUENCE BINAIRE',
    description: 'Déchiffrez la séquence pour révéler les coordonnées du prochain événement.',
    content: '01001101 01000001 01010010 01010011 00100000 00110010 00110000 00110111 00110111',
    hint: 'Convertissez le binaire en ASCII.',
    solution: 'MARS 2077',
    isLocked: false,
  },
  {
    id: 'enigme-2',
    title: 'FRÉQUENCE CACHÉE',
    description: 'Identifiez la fréquence radio qui révèle un message caché.',
    content: 'Balayez le spectre entre 87.5 et 108.0 MHz. Cherchez l\'anomalie à F = (9*3)-(4+2)+(1/5)',
    hint: 'Résolvez l\'équation mathématique pour trouver la fréquence.',
    solution: '91.2 MHz',
    isLocked: false,
  },
  {
    id: 'enigme-3',
    title: 'CODE D\'ACCÈS',
    description: 'Trouvez le code d\'accès pour débloquer la zone VIP du prochain événement.',
    content: 'Le code est caché dans le nom des trois premiers événements. Prenez la première lettre de chaque mot, inversez l\'ordre et remplacez les voyelles par leur position dans l\'alphabet.',
    hint: 'Les trois premiers événements étaient: NEURAL NETWORK, SYSTEM FAILURE, TERMINAL ACCESS',
    solution: 'TSN',
    isLocked: true,
  },
];

// Commandes pour le terminal
const universeCommands = [
  {
    command: 'lore',
    description: 'Affiche l\'histoire du collectif',
    action: () => (
      <div className="space-y-2 font-mono text-sm text-blakkout-foreground">
        <p>Chargement du lore...</p>
        <p className="text-blakkout-primary">L'ORIGINE DE @BLAKKOUT_MARS</p>
        <p>En 2077, une panne d'électricité massive a plongé Marseille dans l'obscurité pendant 72 heures.</p>
        <p>Ce qui semblait être une simple défaillance technique s'est révélé être bien plus...</p>
        <p className="mt-2 text-blakkout-accent">[Tapez 'lore --full' pour voir l'histoire complète]</p>
      </div>
    ),
  },
  {
    command: 'decode',
    description: 'Décode un message chiffré',
    action: (args: string[]) => {
      if (args.length === 0) return 'Erreur: Spécifiez un message à décoder';
      const message = args.join(' ');
      // Simulation de décodage
      return `Décodage: ${message.split('').reverse().join('')}`;
    },
  },
  {
    command: 'scan',
    description: 'Recherche des anomalies dans le réseau',
    action: () => {
      return (
        <div className="space-y-2 font-mono text-sm">
          <p>Scan en cours...</p>
          <p className="text-blakkout-error">Anomalie détectée: 47.098345, 37.284756</p>
          <p className="text-blakkout-primary">Signal crypté intercepté. Utilisez 'decode [message]' pour déchiffrer.</p>
        </div>
      );
    },
  },
  {
    command: 'solve',
    description: 'Tente de résoudre une énigme',
    action: (args: string[]) => {
      if (args.length < 2) return 'Erreur: Utilisez le format "solve [numéro énigme] [solution]"';
      
      const enigmeNum = parseInt(args[0]);
      const solution = args.slice(1).join(' ');
      
      if (isNaN(enigmeNum) || enigmeNum < 1 || enigmeNum > enigmes.length) {
        return `Erreur: Énigme ${enigmeNum} introuvable. Utilisez un nombre entre 1 et ${enigmes.length}.`;
      }
      
      const enigme = enigmes[enigmeNum - 1];
      
      if (solution.toLowerCase() === enigme.solution.toLowerCase()) {
        return `Correct! Vous avez résolu l'énigme "${enigme.title}".`;
      } else {
        return 'Solution incorrecte. Essayez encore.';
      }
    },
  },
];

export default function Univers() {
  const [activeTab, setActiveTab] = useState<'lore' | 'enigmes' | 'terminal'>('lore');
  const [showTerminal, setShowTerminal] = useState(false);
  const [solvedEnigmes, setSolvedEnigmes] = useState<string[]>([]);
  const { activateEasterEgg } = useEasterEggs();
  
  // Vérifier si une énigme est résolue
  const isEnigmeSolved = (id: string) => solvedEnigmes.includes(id);
  
  // Résoudre une énigme
  const solveEnigme = (id: string) => {
    if (!isEnigmeSolved(id)) {
      setSolvedEnigmes([...solvedEnigmes, id]);
      
      // Activer un easter egg si toutes les énigmes sont résolues
      if (solvedEnigmes.length + 1 === enigmes.length) {
        activateEasterEgg('allEnigmasSolved');
      }
    }
  };
  
  return (
    <Layout>
      <NextSeo title="Univers" />
      
      <div className="circuit-bg py-20 pt-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 font-display text-4xl text-blakkout-primary">UNIVERS</h1>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
            <p className="mt-4 font-mono text-blakkout-foreground">
              Explorez le lore du collectif, résolvez des énigmes et découvrez des secrets cachés.
            </p>
          </motion.div>
          
          {/* Navigation par onglets */}
          <motion.div 
            className="mb-8 flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={() => setActiveTab('lore')}
              className={`hacker-button ${activeTab === 'lore' ? 'active' : ''}`}
            >
              LORE
            </button>
            <button 
              onClick={() => setActiveTab('enigmes')}
              className={`hacker-button ${activeTab === 'enigmes' ? 'active' : ''}`}
            >
              ÉNIGMES
            </button>
            <button 
              onClick={() => {
                setActiveTab('terminal');
                setShowTerminal(true);
              }}
              className={`hacker-button ${activeTab === 'terminal' ? 'active' : ''}`}
            >
              TERMINAL
            </button>
          </motion.div>
          
          {/* Contenu des onglets */}
          <AnimatePresence mode="wait">
            {activeTab === 'lore' && (
              <motion.div
                key="lore"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <div className="mb-6 rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                      <h2 className="mb-6 font-display text-2xl text-blakkout-accent">L'HISTOIRE</h2>
                      
                      <div className="markdown-cryptic">
                        <MarkdownReveal 
                          content={loreMd} 
                          revealOnScroll={true}
                          revealSpeed="medium"
                          crypticLevel="medium"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-6 rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                      <h2 className="mb-6 font-display text-2xl text-blakkout-accent">CHRONOLOGIE</h2>
                      
                      <div className="relative space-y-8 pl-6">
                        {/* Ligne verticale */}
                        <div className="absolute left-0 top-0 h-full w-px bg-blakkout-primary"></div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blakkout-primary"></div>
                          <h3 className="font-display text-lg text-blakkout-primary">2077</h3>
                          <p className="font-mono text-sm text-blakkout-foreground">Le Grand Blackout de Marseille</p>
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blakkout-primary"></div>
                          <h3 className="font-display text-lg text-blakkout-primary">2078</h3>
                          <p className="font-mono text-sm text-blakkout-foreground">Formation du collectif @blakkout_mars</p>
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blakkout-primary"></div>
                          <h3 className="font-display text-lg text-blakkout-primary">2079</h3>
                          <p className="font-mono text-sm text-blakkout-foreground">Premier contact avec l'Entité</p>
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blakkout-primary"></div>
                          <h3 className="font-display text-lg text-blakkout-primary">2080</h3>
                          <p className="font-mono text-sm text-blakkout-foreground">Découverte des failles temporelles</p>
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blakkout-primary"></div>
                          <h3 className="font-display text-lg text-blakkout-primary">2081</h3>
                          <p className="font-mono text-sm text-blakkout-foreground">Début des transmissions vers le passé</p>
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-blakkout-primary"></div>
                          <h3 className="font-display text-lg text-blakkout-primary">MAINTENANT</h3>
                          <p className="font-mono text-sm text-blakkout-foreground">Vous lisez ce message</p>
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                      <h2 className="mb-6 font-display text-2xl text-blakkout-accent">ARTEFACTS</h2>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          className="group relative overflow-hidden rounded-md border border-blakkout-primary/30"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="aspect-square bg-blakkout-muted">
                            {/* Placeholder pour image */}
                            <div className="flex h-full items-center justify-center bg-blakkout-muted">
                              <span className="font-mono text-sm text-blakkout-primary">ARTEFACT #01</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-blakkout-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="font-mono text-xs text-blakkout-primary">Circuit imprimé récupéré après le blackout</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="group relative overflow-hidden rounded-md border border-blakkout-primary/30"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="aspect-square bg-blakkout-muted">
                            {/* Placeholder pour image */}
                            <div className="flex h-full items-center justify-center bg-blakkout-muted">
                              <span className="font-mono text-sm text-blakkout-primary">ARTEFACT #02</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-blakkout-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="font-mono text-xs text-blakkout-primary">Enregistrement audio des interférences</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="group relative overflow-hidden rounded-md border border-blakkout-primary/30"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="aspect-square bg-blakkout-muted">
                            {/* Placeholder pour image */}
                            <div className="flex h-full items-center justify-center bg-blakkout-muted">
                              <span className="font-mono text-sm text-blakkout-primary">ARTEFACT #03</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-blakkout-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="font-mono text-xs text-blakkout-primary">Photographie des anomalies lumineuses</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="group relative overflow-hidden rounded-md border border-blakkout-primary/30"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="aspect-square bg-blakkout-muted">
                            {/* Placeholder pour image */}
                            <div className="flex h-full items-center justify-center bg-blakkout-muted">
                              <span className="font-mono text-sm text-blakkout-primary">ARTEFACT #04</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-blakkout-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="font-mono text-xs text-blakkout-primary">Fragment de code source inconnu</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'enigmes' && (
              <motion.div
                key="enigmes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enigmes.map((enigme, index) => (
                    <motion.div
                      key={enigme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <div className={`rounded-md border p-6 backdrop-blur-sm ${isEnigmeSolved(enigme.id) ? 'border-blakkout-accent bg-blakkout-accent/10' : 'border-blakkout-primary bg-blakkout-background/50'}`}>
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-display text-xl text-blakkout-primary">{enigme.title}</h3>
                          {isEnigmeSolved(enigme.id) && (
                            <span className="rounded-full bg-blakkout-accent px-2 py-1 font-mono text-xs text-blakkout-background">
                              RÉSOLU
                            </span>
                          )}
                          {enigme.isLocked && !isEnigmeSolved(enigme.id) && (
                            <span className="rounded-full bg-blakkout-error px-2 py-1 font-mono text-xs text-blakkout-background">
                              VERROUILLÉ
                            </span>
                          )}
                        </div>
                        
                        <p className="mb-4 font-mono text-sm text-blakkout-foreground">
                          {enigme.description}
                        </p>
                        
                        {(!enigme.isLocked || isEnigmeSolved(enigme.id)) && (
                          <div className="mb-4 rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-3 font-mono text-sm">
                            <pre className="whitespace-pre-wrap text-blakkout-primary">{enigme.content}</pre>
                          </div>
                        )}
                        
                        {isEnigmeSolved(enigme.id) ? (
                          <div className="rounded-md border border-blakkout-accent/30 bg-blakkout-accent/5 p-3">
                            <p className="font-mono text-sm text-blakkout-accent">Solution: {enigme.solution}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {!enigme.isLocked && (
                              <div className="flex items-center space-x-2">
                                <button 
                                  className="text-blakkout-primary underline hover:text-blakkout-accent"
                                  onClick={() => alert(`Indice: ${enigme.hint}`)}
                                >
                                  <span className="font-mono text-sm">Afficher un indice</span>
                                </button>
                              </div>
                            )}
                            
                            {!enigme.isLocked && (
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="text" 
                                  placeholder="Votre solution..." 
                                  className="w-full rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-sm text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const input = e.currentTarget;
                                      if (input.value.toLowerCase() === enigme.solution.toLowerCase()) {
                                        solveEnigme(enigme.id);
                                        alert('Correct! Énigme résolue.');
                                      } else {
                                        alert('Solution incorrecte. Essayez encore.');
                                      }
                                    }
                                  }}
                                />
                                <button className="hacker-button text-sm">VALIDER</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 text-center backdrop-blur-sm">
                  <p className="font-mono text-sm text-blakkout-foreground">
                    Résoudre toutes les énigmes débloquera un contenu secret. Utilisez le terminal pour obtenir des indices supplémentaires.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab('terminal');
                      setShowTerminal(true);
                    }}
                    className="mt-4 hacker-button"
                  >
                    OUVRIR LE TERMINAL
                  </button>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'terminal' && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-2xl text-blakkout-accent">TERMINAL D'ACCÈS</h2>
                    <button 
                      onClick={() => setShowTerminal(!showTerminal)}
                      className="hacker-button text-sm"
                    >
                      {showTerminal ? 'FERMER' : 'OUVRIR'}
                    </button>
                  </div>
                  
                  {showTerminal ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TerminalInput 
                        availableCommands={universeCommands}
                        initialMessage="Terminal d'accès à l'univers @blakkout_mars. Tapez 'help' pour voir les commandes disponibles."
                      />
                    </motion.div>
                  ) : (
                    <p className="font-mono text-sm text-blakkout-foreground/70">
                      Utilisez le terminal pour explorer l'univers du collectif, résoudre des énigmes et découvrir des secrets cachés.
                    </p>
                  )}
                </div>
                
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-6 font-display text-2xl text-blakkout-accent">TRANSMISSIONS</h2>
                    
                    <div className="space-y-4">
                      <motion.div 
                        className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-xs text-blakkout-foreground/70">TRANSMISSION #1</span>
                          <span className="font-mono text-xs text-blakkout-foreground/70">2077-06-15</span>
                        </div>
                        <p className="font-mono text-sm text-blakkout-primary">Le signal s'intensifie. Les coordonnées convergent vers Marseille. La faille s'ouvrira bientôt.</p>
                      </motion.div>
                      
                      <motion.div 
                        className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-xs text-blakkout-foreground/70">TRANSMISSION #2</span>
                          <span className="font-mono text-xs text-blakkout-foreground/70">2078-02-28</span>
                        </div>
                        <p className="font-mono text-sm text-blakkout-primary">Nous avons établi le contact. L'entité répond à nos fréquences. La musique est la clé.</p>
                      </motion.div>
                      
                      <motion.div 
                        className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-xs text-blakkout-foreground/70">TRANSMISSION #3</span>
                          <span className="font-mono text-xs text-blakkout-foreground/70">2079-11-03</span>
                        </div>
                        <p className="font-mono text-sm text-blakkout-primary">Les événements créent des résonances temporelles. Chaque blackout nous rapproche de la vérité.</p>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-6 font-display text-2xl text-blakkout-accent">CARTE DES ANOMALIES</h2>
                    
                    <div className="aspect-video rounded-md bg-blakkout-muted">
                      {/* Placeholder pour carte */}
                      <div className="flex h-full items-center justify-center">
                        <span className="font-mono text-sm text-blakkout-primary">CARTE DES ANOMALIES DE MARSEILLE</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-blakkout-primary"></div>
                        <span className="font-mono text-xs text-blakkout-foreground">Points d'anomalies électromagnétiques</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-blakkout-accent"></div>
                        <span className="font-mono text-xs text-blakkout-foreground">Lieux d'événements passés</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-blakkout-error"></div>
                        <span className="font-mono text-xs text-blakkout-foreground">Zones de distorsion temporelle</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}