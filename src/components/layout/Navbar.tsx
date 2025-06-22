import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

type NavbarProps = {
  transparent?: boolean;
};

export default function Navbar({ transparent = false }: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Effet pour détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);
  
  // Déterminer la classe de fond en fonction du scroll et de la prop transparent
  const bgClass = transparent
    ? isScrolled
      ? 'bg-blakkout-background/90 backdrop-blur-md'
      : 'bg-transparent'
    : 'bg-blakkout-background';
  
  // Liens de navigation
  const navLinks = [
    { href: '/', label: 'ACCUEIL' },
    { href: '/collectif', label: 'COLLECTIF' },
    { href: '/evenements', label: 'ÉVÉNEMENTS' },
    { href: '/univers', label: 'UNIVERS' },
    { href: '/rewards', label: '🏆 RÉCOMPENSES' },
    { href: '/merch', label: 'MERCH' },
    { href: '/galerie', label: 'GALERIE' },
    { href: '/recrutement', label: 'RECRUTEMENT' },
    { href: '/contact', label: 'CONTACT' },
  ];
  
  // Variantes pour les animations
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };
  
  return (
    <header 
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${bgClass} ${isScrolled ? 'shadow-lg shadow-blakkout-primary/10' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-display text-xl font-bold text-blakkout-primary">
              @BLAKKOUT<span className="text-blakkout-accent">_</span>MARS
            </span>
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`cryptic-link font-mono text-sm ${router.pathname === link.href ? 'text-blakkout-primary' : 'text-blakkout-foreground'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Bouton menu mobile */}
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-md border border-blakkout-primary md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
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
              className="text-blakkout-primary"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute left-0 top-16 w-full bg-blakkout-background/95 backdrop-blur-md md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <motion.li key={link.href} variants={itemVariants}>
                    <Link 
                      href={link.href}
                      className={`block border-l-2 ${router.pathname === link.href ? 'border-blakkout-primary text-blakkout-primary' : 'border-transparent text-blakkout-foreground'} px-4 py-2 font-mono text-sm transition-colors duration-300 hover:border-blakkout-primary hover:text-blakkout-primary`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}