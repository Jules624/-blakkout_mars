import React, { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import TVBlackout from '@/components/effects/TVBlackout';
import RotatingMerch3D from '@/components/merch/RotatingMerch3D';
import CrypticEventCard from '@/components/events/CrypticEventCard';
import TerminalInput from '@/components/ui/TerminalInput';

// Données factices pour la démo
const featuredEvent = {
  id: 'next-event-2023',
  title: 'BLAKKOUT 2023.4',
  date: new Date('2023-12-15T22:00:00'),
  location: 'LIEU SECRET',
  description: 'Notre prochain événement immersif mêlant techno underground et expériences interactives. Préparez-vous à une soirée hors du commun.',
  imageUrl: '',
  ticketUrl: '/billeterie',
  isFeatured: true,
};

const upcomingEvents = [
  {
    id: 'workshop-2023',
    title: 'WORKSHOP: GLITCH ART',
    date: new Date('2023-11-25T18:00:00'),
    location: 'FRICHE BELLE DE MAI',
    description: 'Atelier de création artistique autour du glitch art et des techniques de détournement numérique.',
    imageUrl: '',
    ticketUrl: '/billeterie/workshop-2023',
    isFeatured: false,
    isSecret: false,
  },
  {
    id: 'secret-event-2023',
    title: 'ÉVÉNEMENT CRYPTÉ',
    date: new Date('2023-12-31T23:59:00'),
    location: 'COORDONNÉES CRYPTÉES',
    description: 'Informations disponibles uniquement pour les initiés. Déchiffrez le code pour accéder aux détails.',
    imageUrl: '',
    ticketUrl: '/billeterie/secret-event-2023',
    isFeatured: false,
    isSecret: true,
  },
];

const merchItems = [
  {
    id: 'tshirt-glitch',
    name: 'T-SHIRT GLITCH',
    price: '35€',
    modelUrl: '',
  },
  {
    id: 'hoodie-circuit',
    name: 'HOODIE CIRCUIT',
    price: '65€',
    modelUrl: '',
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

  // Simuler un chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-blakkout-background">
        <div className="text-center">
          <h1 className="text-glitch mb-4 font-display text-4xl text-blakkout-primary">
            @BLAKKOUT_MARS
          </h1>
          <div className="terminal-typing inline-block font-mono text-xl">
            INITIALISATION...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NextSeo title="Accueil" />
      
      {/* Hero Section avec effet TV Blackout */}
      <TVBlackout>
        <section className="relative h-screen w-full overflow-hidden">
          {/* Vidéo ou image de fond */}
          <div className="absolute inset-0 bg-blakkout-background">
            <div className="absolute inset-0 bg-grid opacity-10"></div>
            {/* Ici, vous pourriez ajouter une vidéo de fond */}
          </div>
          
          {/* Contenu Hero */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="mb-6 font-display text-5xl font-bold text-blakkout-primary sm:text-6xl md:text-7xl">
                @BLAKKOUT<span className="text-blakkout-accent">_</span>MARS
              </h1>
              <p className="mb-8 max-w-2xl font-mono text-lg text-blakkout-foreground">
                Collectif marseillais organisateur d'événements immersifs mêlant culture techno et univers geek.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/evenements" className="hacker-button">
                  ÉVÉNEMENTS
                </Link>
                <Link href="/univers" className="hacker-button">
                  UNIVERS
                </Link>
                <Link href="/merch" className="hacker-button">
                  MERCH
                </Link>
                <button 
                  onClick={() => setShowTerminal(!showTerminal)}
                  className="hacker-button"
                >
                  TERMINAL
                </button>
              </div>
            </motion.div>
            
            {/* Terminal optionnel */}
            {showTerminal && (
              <motion.div 
                className="mt-8 w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <TerminalInput />
              </motion.div>
            )}
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-blakkout-foreground"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </motion.div>
        </section>
      </TVBlackout>
      
      {/* Section Événement à la une */}
      <section className="bg-blakkout-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 font-display text-3xl text-blakkout-primary">PROCHAIN ÉVÉNEMENT</h2>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CrypticEventCard 
              id={featuredEvent.id}
              title={featuredEvent.title}
              date={featuredEvent.date}
              location={featuredEvent.location}
              description={featuredEvent.description}
              imageUrl={featuredEvent.imageUrl}
              ticketUrl={featuredEvent.ticketUrl}
              isFeatured={featuredEvent.isFeatured}
            />
          </motion.div>
          
          <motion.div 
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {upcomingEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <CrypticEventCard 
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  imageUrl={event.imageUrl}
                  ticketUrl={event.ticketUrl}
                  isFeatured={event.isFeatured}
                  isSecret={event.isSecret}
                  revealDelay={event.isSecret ? 3000 : 0}
                />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/evenements" className="hacker-button">
              TOUS LES ÉVÉNEMENTS
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Section Merch */}
      <section className="circuit-bg py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 font-display text-3xl text-blakkout-primary">MERCH</h2>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {merchItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <RotatingMerch3D 
                  modelUrl={item.modelUrl}
                  productName={item.name}
                  productPrice={item.price}
                  onClick={() => window.location.href = `/merch/${item.id}`}
                />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/merch" className="hacker-button">
              VOIR TOUT LE MERCH
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Section Univers */}
      <section className="bg-blakkout-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 font-display text-3xl text-blakkout-primary">UNIVERS</h2>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="mb-4 font-display text-2xl text-blakkout-accent">DÉCOUVREZ NOTRE LORE</h3>
              <p className="mb-6 font-mono text-blakkout-foreground">
                Plongez dans l'univers cryptique de @blakkout_mars. Explorez notre histoire, nos influences et les mystères qui entourent notre collectif.
              </p>
              <div>
                <Link href="/univers" className="hacker-button">
                  EXPLORER
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              className="relative aspect-video overflow-hidden rounded-md border border-blakkout-primary"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-circuit opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-glitch mb-4 font-display text-2xl text-blakkout-primary">
                    ACCÈS RESTREINT
                  </div>
                  <p className="font-mono text-sm text-blakkout-foreground">
                    Contenu disponible uniquement pour les initiés.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-blakkout-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-display text-xl text-blakkout-primary">@BLAKKOUT_MARS</h3>
              <p className="font-mono text-sm text-blakkout-foreground/70">
                Collectif marseillais organisateur d'événements immersifs mêlant culture techno et univers geek.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 font-display text-xl text-blakkout-primary">LIENS</h3>
              <ul className="space-y-2 font-mono text-sm">
                <li>
                  <Link href="/evenements" className="cryptic-link">
                    ÉVÉNEMENTS
                  </Link>
                </li>
                <li>
                  <Link href="/univers" className="cryptic-link">
                    UNIVERS
                  </Link>
                </li>
                <li>
                  <Link href="/merch" className="cryptic-link">
                    MERCH
                  </Link>
                </li>
                <li>
                  <Link href="/galerie" className="cryptic-link">
                    GALERIE
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="cryptic-link">
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 font-display text-xl text-blakkout-primary">SUIVEZ-NOUS</h3>
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-blakkout-foreground hover:text-blakkout-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blakkout-foreground hover:text-blakkout-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blakkout-foreground hover:text-blakkout-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-blakkout-primary/30 pt-8 text-center font-mono text-xs text-blakkout-foreground/50">
            &copy; {new Date().getFullYear()} @blakkout_mars. Tous droits réservés.
          </div>
        </div>
      </footer>
    </>
  );
}