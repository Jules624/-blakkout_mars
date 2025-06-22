import React from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useEasterEggs } from '@/context/EasterEggContext';

const Rewards = () => {
  const { easterEggs, getUnlockedRewards, isAllEasterEggsFound } = useEasterEggs();
  const unlockedRewards = getUnlockedRewards();
  const allEasterEggsFound = isAllEasterEggsFound();

  const easterEggNames = {
    konami: 'KONAMI CODE',
    consoleAccess: 'ACCÈS CONSOLE',
    glitch: 'GLITCH MATRIX',
    hidden: 'VÉRITÉ CACHÉE',
    matrix: 'LAPIN BLANC'
  };

  const easterEggDescriptions = {
    konami: 'Séquence de touches légendaire des années 80',
    consoleAccess: 'Commande terminal pour accès privilégié',
    glitch: 'Manipulation de la réalité numérique',
    hidden: 'Découverte des secrets enfouis',
    matrix: 'Suivre le chemin de Neo'
  };

  return (
    <Layout>
      <NextSeo
        title="Récompenses | BLAKKOUT"
        description="Découvrez vos récompenses exclusives débloquées via les easter eggs"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-black text-green-400 font-mono p-8 pt-24"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-glitch">
              🏆 RÉCOMPENSES
            </h1>
            <p className="text-xl text-green-300">
              EASTER EGGS DÉBLOQUÉS: {Object.values(easterEggs).filter(Boolean).length}/5
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full bg-gray-800 rounded-full h-4 mb-8"
          >
            <div 
              className="bg-gradient-to-r from-green-400 to-cyan-400 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${(Object.values(easterEggs).filter(Boolean).length / 5) * 100}%` }}
            />
          </motion.div>

          {/* Easter Eggs Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.entries(easterEggs).map(([key, found], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  found 
                    ? 'border-green-400 bg-green-900/20 shadow-lg shadow-green-400/20' 
                    : 'border-gray-600 bg-gray-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-bold ${found ? 'text-green-400' : 'text-gray-500'}`}>
                    {easterEggNames[key as keyof typeof easterEggNames]}
                  </h3>
                  <span className="text-2xl">
                    {found ? '🔓' : '🔒'}
                  </span>
                </div>
                <p className={`text-sm ${found ? 'text-green-300' : 'text-gray-600'}`}>
                  {easterEggDescriptions[key as keyof typeof easterEggDescriptions]}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Unlocked Rewards */}
          {unlockedRewards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">
                🎁 RÉCOMPENSES DÉBLOQUÉES
              </h2>
              <div className="space-y-4">
                {unlockedRewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
                    className="p-4 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-lg border border-green-400/50 shadow-lg"
                  >
                    <p className="text-green-300 font-medium">{reward}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ultimate Reward */}
          {allEasterEggsFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-center p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border-2 border-gradient-to-r from-purple-400 to-pink-400 shadow-2xl"
            >
              <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                👑 RÉCOMPENSE ULTIME
              </h2>
              <div className="text-xl text-white space-y-2">
                <p>🌟 <strong>ACCÈS EXCLUSIF À LA RAVE SECRÈTE</strong></p>
                <p>📅 <strong>Date:</strong> 31 Mars 2024</p>
                <p>📍 <strong>Lieu:</strong> Ancienne station de métro Bastille</p>
                <p>🕒 <strong>Heure:</strong> 00:00</p>
                <p>🔑 <strong>Code d'entrée:</strong> BLAKKOUT_MASTER</p>
              </div>
            </motion.div>
          )}

          {/* No Rewards Yet */}
          {unlockedRewards.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-center p-8 bg-gray-900/30 rounded-lg border border-gray-600"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-400">
                🔍 AUCUNE RÉCOMPENSE DÉBLOQUÉE
              </h2>
              <p className="text-gray-500 mb-4">
                Explorez le site et trouvez les easter eggs pour débloquer des récompenses exclusives !
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>💡 <strong>Indices:</strong></p>
                <p>• Résolvez les énigmes dans la section UNIVERS</p>
                <p>• Essayez des combinaisons de touches spéciales</p>
                <p>• Cherchez des commandes cachées dans la console</p>
                <p>• Explorez chaque page attentivement</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Rewards;