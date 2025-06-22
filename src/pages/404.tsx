import React, { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { generateCrypticText } from '@/lib/utils';
import { useEasterEggs } from '@/context/EasterEggContext';

export default function Custom404() {
  const router = useRouter();
  const { activateEasterEgg } = useEasterEggs();
  const [errorCode, setErrorCode] = useState('404');
  const [errorMessage, setErrorMessage] = useState('PAGE NON TROUVÉE');
  const [crypticText, setCrypticText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [foundEasterEgg, setFoundEasterEgg] = useState(false);

  // Effet pour générer du texte cryptique
  useEffect(() => {
    const interval = setInterval(() => {
      setCrypticText(generateCrypticText(50));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Effet pour simuler un glitch aléatoire
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Effet pour vérifier si l'URL contient un easter egg
  useEffect(() => {
    const path = router.asPath;
    
    // Vérifier si l'URL contient un easter egg
    if (path.includes('matrix') || path.includes('rabbit')) {
      setErrorCode('1337');
      setErrorMessage('EASTER EGG TROUVÉ');
      setFoundEasterEgg(true);
      activateEasterEgg('activate_hidden');
    } else if (path.includes('glitch') || path.includes('hack')) {
      setErrorCode('H4CK');
      setErrorMessage('SYSTÈME COMPROMIS');
      setFoundEasterEgg(true);
      activateEasterEgg('activate_glitch');
    }
  }, [router.asPath, activateEasterEgg]);

  // Variantes pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <NextSeo title="404 - Page non trouvée" />
      
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-blakkout-background p-4 text-center">
        {/* Fond avec effet de grille */}
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        
        {/* Texte cryptique en arrière-plan */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="font-mono text-xs text-blakkout-primary/10">
            {crypticText}
          </div>
        </div>
        
        <motion.div
          className="relative z-10 max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            className={`mb-6 ${isGlitching ? 'text-glitch' : ''}`}
            variants={itemVariants}
          >
            <h1 className="font-display text-8xl font-bold text-blakkout-primary">
              {errorCode}
            </h1>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h2 className="mb-6 font-display text-3xl text-blakkout-accent">
              {errorMessage}
            </h2>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <p className="mb-8 font-mono text-blakkout-foreground">
              {foundEasterEgg 
                ? 'Félicitations, vous avez trouvé un easter egg caché!' 
                : 'La page que vous recherchez semble avoir été déplacée, supprimée ou n\'a jamais existé.'}
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="console mb-8 p-4 text-left">
              <div className="font-mono text-sm text-blakkout-primary">
                <p>$ locate page</p>
                <p>ERROR: Page not found in filesystem</p>
                <p>$ recover data</p>
                <p>Attempting data recovery...</p>
                <p>Recovery failed. Corrupted or missing data.</p>
                <p>$ suggest action</p>
                <p>Recommended action: Return to home directory</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link href="/" className="hacker-button">
              RETOUR À L'ACCUEIL
            </Link>
          </motion.div>
          
          {foundEasterEgg && (
            <motion.div 
              className="mt-8 rounded-md border border-blakkout-accent bg-blakkout-background/50 p-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 1 }}
            >
              <p className="font-mono text-sm text-blakkout-accent">
                Easter egg débloqué! Continuez à explorer pour trouver d'autres secrets...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}