import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEasterEggs } from '@/context/EasterEggContext';
import RotatingMerch3D from '@/components/merch/RotatingMerch3D';
import SEO_CONFIG from '@/lib/seo-config';
import TVBlackout from '@/components/effects/TVBlackout';
import CrypticEventCard from '@/components/events/CrypticEventCard';


// Composant pour afficher la date côté client uniquement
function DateDisplay() {
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('fr-FR'));
  }, []);
  
  return <span>{currentDate}</span>;
}

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
    modelUrl: '/assets/models/tshirt.glb',
  },
  {
    id: 'hoodie-circuit',
    name: 'HOODIE CIRCUIT',
    price: '65€',
    modelUrl: '/assets/models/hoodie.glb',
  },
];

// Simulation des commandes de démarrage serveur
const serverStartupCommands = [
  { text: '[INFO] Initializing BLAKKOUT_MARS server...', color: 'text-blue-400', delay: 0 },
  { text: '[SYSTEM] Loading kernel modules...', color: 'text-green-400', delay: 300 },
  { text: '[NETWORK] Configuring network interfaces...', color: 'text-cyan-400', delay: 600 },
  { text: '[DATABASE] Connecting to MongoDB cluster...', color: 'text-yellow-400', delay: 900 },
  { text: '[API] Starting Express.js server on port 3000...', color: 'text-purple-400', delay: 1200 },
  { text: '[SECURITY] Loading SSL certificates...', color: 'text-red-400', delay: 1500 },
  { text: '[CACHE] Initializing Redis cache...', color: 'text-orange-400', delay: 1800 },
  { text: '[MIDDLEWARE] Loading authentication middleware...', color: 'text-pink-400', delay: 2100 },
  { text: '[ROUTES] Registering API endpoints...', color: 'text-indigo-400', delay: 2400 },
  { text: '[STATIC] Serving static assets...', color: 'text-teal-400', delay: 2700 },
  { text: '[WEBSOCKET] WebSocket server ready...', color: 'text-lime-400', delay: 3000 },
  { text: '[SUCCESS] Server started successfully!', color: 'text-green-500', delay: 3300 },
  { text: '[READY] BLAKKOUT_MARS is now online', color: 'text-blakkout-primary', delay: 3600 }
];

// Messages de démarrage PC ultra-rapides
const bootMessages = [
  { text: 'BLAKKOUT BIOS v2.1.0', color: 'text-white', delay: 0 },
  { text: 'CPU: Intel Core i9-13900K @ 3.0GHz', color: 'text-gray-300', delay: 50 },
  { text: 'Memory Test: 32768MB OK', color: 'text-green-400', delay: 100 },
  { text: 'Detecting Primary Master... OK', color: 'text-cyan-400', delay: 150 },
  { text: 'Detecting Primary Slave... OK', color: 'text-cyan-400', delay: 200 },
  { text: 'USB Device(s): 4 Port, 6 Device(s)', color: 'text-yellow-400', delay: 250 },
  { text: 'Loading Operating System...', color: 'text-white', delay: 300 },
  { text: 'BLAKKOUT_MARS OS v3.14', color: 'text-blakkout-primary', delay: 400 },
  { text: 'Starting kernel...', color: 'text-green-400', delay: 450 },
  { text: 'Mounting filesystems...', color: 'text-blue-400', delay: 500 },
  { text: 'Loading drivers...', color: 'text-purple-400', delay: 550 },
  { text: 'Network interface up', color: 'text-cyan-400', delay: 600 },
  { text: 'Starting services...', color: 'text-yellow-400', delay: 650 },
  { text: 'System ready', color: 'text-green-500', delay: 700 }
];

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [displayedMessages, setDisplayedMessages] = useState<typeof bootMessages>([]);

  useEffect(() => {
    if (currentIndex < bootMessages.length) {
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => [...prev, bootMessages[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, bootMessages[currentIndex].delay);
      
      return () => clearTimeout(timer);
    } else {
      // Démarrage terminé
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 300);
      
      return () => clearTimeout(finalTimer);
    }
  }, [currentIndex, onComplete]);

  return (
    <div className="flex h-screen w-screen bg-black font-mono text-sm">
      <div className="w-full p-4">
        {/* Header BIOS */}
        <div className="mb-4 border-b border-gray-700 pb-2">
          <div className="flex justify-between text-white">
            <span>BLAKKOUT MARS BIOS Setup Utility</span>
            <DateDisplay />
          </div>
        </div>
        
        {/* Messages de boot */}
        <div className="space-y-0">
          {displayedMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.05 }}
              className={message.color}
            >
              {message.text}
            </motion.div>
          ))}
          
          {/* Curseur clignotant */}
          {currentIndex < bootMessages.length && (
            <div className="inline-block">
              <span className="animate-pulse text-white">_</span>
            </div>
          )}
        </div>
        
        {/* Barre de progression en bas */}
        <div className="fixed bottom-8 left-4 right-4">
          <div className="mb-2 text-center text-xs text-gray-400">
            Démarrage système... {Math.round((currentIndex / bootMessages.length) * 100)}%
          </div>
          <div className="h-1 w-full bg-gray-800">
            <motion.div
              className="h-1 bg-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${(currentIndex / bootMessages.length) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
        
        {/* Logo en fin de boot */}
        {currentIndex >= bootMessages.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-black z-10"
          >
            <div className="flex justify-center items-center">
              <img 
                src="/assets/images/logo.png" 
                alt="BLAKKOUT_MARS" 
                className="w-auto mx-auto" 
                style={{ height: '384px' }}
              />
            </div>
            <p className="mt-4 text-gray-400">Système opérationnel</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Nouveau composant pour l'animation TV shutdown
const TVShutdownAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'gray' | 'shutdown' | 'message' | 'complete'>('gray');

  useEffect(() => {
    // Phase 1: Écran gris pendant 0.5 seconde
    const grayTimer = setTimeout(() => {
      setPhase('shutdown');
    }, 500);

    return () => clearTimeout(grayTimer);
  }, []);

  useEffect(() => {
    if (phase === 'shutdown') {
      // Phase 2: Animation TV shutdown pendant 1 seconde
      const shutdownTimer = setTimeout(() => {
        setPhase('message');
      }, 1000);

      return () => clearTimeout(shutdownTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'message') {
      // Phase 3: Message pendant 2 secondes puis terminer
      const messageTimer = setTimeout(() => {
        setPhase('complete');
        onComplete();
      }, 2000);

      return () => clearTimeout(messageTimer);
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Phase 1: Écran gris */}
      {phase === 'gray' && (
        <motion.div
          className="h-full w-full bg-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Phase 2: Animation TV shutdown */}
      {phase === 'shutdown' && (
        <motion.div
          className="relative h-full w-full bg-gray-400 overflow-hidden"
        >
          {/* Animation de fermeture TV - noir depuis la périphérie */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{
              clipPath: 'inset(100% 100% 100% 100%)'
            }}
            animate={{
              clipPath: 'inset(0% 0% 0% 0%)'
            }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94] // easeOutQuad
            }}
          />
          
          {/* Effet de ligne horizontale comme sur les vieilles TV */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-0.5 bg-white"
            initial={{ scaleX: 1, opacity: 1 }}
            animate={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>
      )}

      {/* Phase 3: Message "@blakkout_mars arrive" */}
      {phase === 'message' && (
        <motion.div
          className="flex h-full w-full items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h1
              className="text-glitch font-display text-4xl text-blakkout-primary sm:text-5xl md:text-6xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img 
                   src="/assets/images/logo.png" 
                   alt="BLAKKOUT_MARS" 
                   className="w-auto mx-auto" 
                   style={{ height: '576px' }}
                 />
            </motion.h1>
            <motion.p
              className="mt-4 font-mono text-lg text-blakkout-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              arrive...
            </motion.p>
            
            {/* Points de chargement animés */}
            <motion.div
              className="mt-6 flex justify-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-blakkout-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isShuttingDown, setIsShuttingDown] = useState(false);


  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setIsShuttingDown(true);
  }, []);

  const handleShutdownComplete = useCallback(() => {
    setIsShuttingDown(false);
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

  // Écran de chargement avec simulation de démarrage serveur
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Animation TV shutdown
  if (isShuttingDown) {
    return <TVShutdownAnimation onComplete={handleShutdownComplete} />;
  }

  return (
    <>
      <NextSeo {...SEO_CONFIG} title="Accueil" />
      
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
              <div className="mb-6 flex justify-center">
                <img 
                  src="/assets/images/logo.png" 
                  alt="BLAKKOUT_MARS" 
                  className="w-auto mx-auto" 
                  style={{ height: '384px' }}
                />
              </div>
              <p className="mb-8 font-mono text-lg text-blakkout-foreground text-center">
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
              </div>
            </motion.div>
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
            viewport={{ once: true, margin: "-100px" }}
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
            viewport={{ once: true, margin: "-50px" }}
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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 font-display text-3xl text-blakkout-primary">MERCH</h2>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {merchItems.map((item) => (
              <div key={item.id} className="h-96 cursor-pointer" onClick={() => router.push('/404?hack=true')}>
                <RotatingMerch3D 
                  modelUrl={item.modelUrl}
                  productName={item.name}
                  price={item.price}
                  autoRotate={true}
                  className="w-full h-full mx-auto"
                />
              </div>
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
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