import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import Layout from '@/components/layout/Layout';
import MarkdownReveal from '@/components/content/MarkdownReveal';

import { useEasterEggs } from '@/context/EasterEggContext';

// Contenu markdown pour le lore
const loreMd = `
# L'ORIGINE DE @BLAKKOUT_MARS

En 2077, une panne d'électricité massive a plongé Marseille dans l'obscurité pendant 72 heures. 
Cette période, connue sous le nom de "Blackout de Mars", a marqué le début d'une nouvelle ère.

## LA NAISSANCE DU COLLECTIF

Dans l'obscurité totale, un groupe de hackers, d'artistes et de visionnaires s'est réuni.
Ils ont découvert que la panne n'était pas accidentelle, mais le résultat d'une expérience technologique secrète.

## LA MISSION

Depuis ce jour, @BLAKKOUT_MARS œuvre dans l'ombre pour :
- Révéler les vérités cachées
- Créer des expériences immersives uniques
- Rassembler une communauté de rebelles numériques
- Préparer l'humanité aux défis technologiques futurs

## L'HÉRITAGE

Chaque événement, chaque création, chaque ligne de code porte en elle l'esprit de cette nuit fondatrice.
Nous sommes les gardiens de la lumière dans l'obscurité numérique.
`;

// Énigmes interactives
const enigmes = [
  {
    id: 'neural-cipher',
    title: 'CHIFFRE NEURAL',
    difficulty: 'FACILE',
    content: 'Décodez ce message : 01000010 01001100 01000001 01001011 01001011 01001111 01010101 01010100',
    hint: 'Convertissez le binaire en ASCII',
    solution: 'BLAKKOUT',
    isLocked: false,
  },
  {
    id: 'system-puzzle',
    title: 'PUZZLE SYSTÈME',
    difficulty: 'MOYEN',
    content: 'Trouvez le mot de passe : La somme des positions alphabétiques de M-A-R-S multipliée par 2077',
    hint: 'M=13, A=1, R=18, S=19. Calculez (13+1+18+19) × 2077',
    solution: '106027',
    isLocked: true,
  },
  {
    id: 'terminal-access',
    title: 'ACCÈS TERMINAL',
    difficulty: 'DIFFICILE',
    content: 'Le code est caché dans le nom des trois premiers événements. Prenez la première lettre de chaque mot, inversez l\'ordre et remplacez les voyelles par leur position dans l\'alphabet.',
    hint: 'Les trois premiers événements étaient: NEURAL NETWORK, SYSTEM FAILURE, TERMINAL ACCESS',
    solution: 'TSN',
    isLocked: true,
  },
];

export default function Univers() {
  const [activeTab, setActiveTab] = useState<'lore' | 'enigmes'>('lore');
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
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
              L'UNIVERS
            </h1>
            <p className="text-xl text-gray-300">
              Plongez dans l'histoire et les mystères de @BLAKKOUT_MARS
            </p>
          </motion.div>

          {/* Navigation des onglets */}
          <div className="mb-8 flex justify-center">
            <div className="flex rounded-lg bg-gray-800 p-1">
              <button
                onClick={() => setActiveTab('lore')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'lore'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                LORE
              </button>
              <button
                onClick={() => setActiveTab('enigmes')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'enigmes'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                ÉNIGMES
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'lore' && (
              <motion.div
                key="lore"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-4xl"
              >
                <div className="rounded-lg bg-gray-900/50 p-8 backdrop-blur-sm">
                  <MarkdownReveal content={loreMd} />
                </div>
              </motion.div>
            )}

            {activeTab === 'enigmes' && (
              <motion.div
                key="enigmes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-4xl"
              >
                <div className="space-y-6">
                  {enigmes.map((enigme, index) => (
                    <motion.div
                      key={enigme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-lg p-6 backdrop-blur-sm ${
                        enigme.isLocked && !isEnigmeSolved(enigmes[index - 1]?.id)
                          ? 'bg-gray-800/30 border border-gray-700'
                          : 'bg-gray-900/50 border border-gray-600'
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">
                          {enigme.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              enigme.difficulty === 'FACILE'
                                ? 'bg-green-600 text-white'
                                : enigme.difficulty === 'MOYEN'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {enigme.difficulty}
                          </span>
                          {isEnigmeSolved(enigme.id) && (
                            <span className="text-green-400">✓ RÉSOLU</span>
                          )}
                        </div>
                      </div>

                      {enigme.isLocked && !isEnigmeSolved(enigmes[index - 1]?.id) ? (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">🔒</div>
                          <p className="text-gray-400">
                            Résolvez l'énigme précédente pour débloquer
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-4 text-gray-300">{enigme.content}</p>
                          
                          {!isEnigmeSolved(enigme.id) && (
                            <div className="space-y-4">
                              <details className="text-sm">
                                <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                                  💡 Indice
                                </summary>
                                <p className="mt-2 text-gray-400">{enigme.hint}</p>
                              </details>
                              
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder="Votre réponse..."
                                  className="flex-1 rounded bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      const input = e.target as HTMLInputElement;
                                      if (input.value.toUpperCase() === enigme.solution) {
                                        solveEnigme(enigme.id);
                                        input.value = '';
                                      } else {
                                        input.classList.add('ring-2', 'ring-red-500');
                                        setTimeout(() => {
                                          input.classList.remove('ring-2', 'ring-red-500');
                                        }, 1000);
                                      }
                                    }
                                  }}
                                />
                                <button
                                  onClick={(e) => {
                                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                    if (input.value.toUpperCase() === enigme.solution) {
                                      solveEnigme(enigme.id);
                                      input.value = '';
                                    } else {
                                      input.classList.add('ring-2', 'ring-red-500');
                                      setTimeout(() => {
                                        input.classList.remove('ring-2', 'ring-red-500');
                                      }, 1000);
                                    }
                                  }}
                                  className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  VALIDER
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {solvedEnigmes.length === enigmes.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 p-6 text-center"
                  >
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      🎉 FÉLICITATIONS !
                    </h3>
                    <p className="text-green-100">
                      Vous avez résolu toutes les énigmes ! Un easter egg a été débloqué.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}