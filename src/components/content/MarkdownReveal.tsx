import React, { useState, useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import { motion, useInView } from 'framer-motion';
import { generateCrypticText } from '@/lib/utils';

type MarkdownRevealProps = {
  content: string;
  revealOnScroll?: boolean;
  revealSpeed?: 'slow' | 'medium' | 'fast';
  crypticLevel?: 'low' | 'medium' | 'high';
  className?: string;
};

export default function MarkdownReveal({
  content,
  revealOnScroll = true,
  revealSpeed = 'medium',
  crypticLevel = 'medium',
  className = '',
}: MarkdownRevealProps) {
  const [renderedContent, setRenderedContent] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(!revealOnScroll);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // Configurer le parser markdown
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  // Configurer la vitesse de révélation
  const speedConfig = {
    slow: 80,
    medium: 5,
    fast: 20,
  };

  // Configurer le niveau cryptique
  const crypticConfig = {
    low: 0.2,
    medium: 0.5,
    high: 0.8,
  };

  // Effet pour déclencher la révélation au scroll
  useEffect(() => {
    if (revealOnScroll && isInView && !isRevealed && !isRevealing) {
      revealContent();
    }
  }, [isInView, revealOnScroll, isRevealed, isRevealing]);

  // Fonction pour révéler progressivement le contenu
  const revealContent = () => {
    setIsRevealing(true);
    
    // Rendre le markdown
    const htmlContent = md.render(content);
    
    // Créer un élément temporaire pour extraire le texte
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;
    const textContent = tempElement.textContent || '';
    
    // Initialiser avec du texte cryptique
    let crypticContent = '';
    for (let i = 0; i < textContent.length; i++) {
      crypticContent += textContent[i] === ' ' ? ' ' : '█';
    }
    setRenderedContent(crypticContent);
    
    // Révéler progressivement
    let currentIndex = 0;
    const crypticIntensity = crypticConfig[crypticLevel];
    const interval = setInterval(() => {
      if (currentIndex >= textContent.length) {
        clearInterval(interval);
        setRenderedContent(htmlContent);
        setIsRevealing(false);
        setIsRevealed(true);
        return;
      }
      
      // Mettre à jour le contenu avec un mélange de texte réel et cryptique
      let newContent = '';
      for (let i = 0; i < textContent.length; i++) {
        if (i <= currentIndex || Math.random() > crypticIntensity) {
          // Caractère révélé
          newContent += textContent[i];
        } else if (textContent[i] === ' ') {
          // Préserver les espaces
          newContent += ' ';
        } else {
          // Caractère cryptique
          newContent += generateCrypticText(1);
        }
      }
      
      // Mettre à jour le contenu rendu
      setRenderedContent(newContent);
      currentIndex += 15; // Révéler plusieurs caractères à la fois
    }, speedConfig[revealSpeed]);
    
    return () => clearInterval(interval);
  };

  // Effet pour rendre le contenu initial
  useEffect(() => {
    if (!revealOnScroll) {
      setRenderedContent(md.render(content));
    }
  }, [content, revealOnScroll]);

  return (
    <motion.div
      ref={containerRef}
      className={`markdown-cryptic ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!isRevealed && !isRevealing && revealOnScroll ? (
        <div className="cursor-pointer p-4" onClick={revealContent}>
          <p className="text-blakkout-primary">[ Cliquez pour déchiffrer le contenu ]</p>
        </div>
      ) : (
        <div 
          dangerouslySetInnerHTML={{ __html: renderedContent }} 
          className={`transition-all duration-300 ${isRevealing ? 'text-glitch' : ''}`}
        />
      )}
    </motion.div>
  );
}