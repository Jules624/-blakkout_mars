import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
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
    <footer className="bg-blakkout-muted py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 font-display text-xl text-blakkout-primary">@BLAKKOUT_MARS</h3>
            <p className="font-mono text-sm text-blakkout-foreground/70">
              Collectif marseillais organisateur d'événements immersifs mêlant culture techno et univers geek.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 font-display text-xl text-blakkout-primary">LIENS</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <Link href="/collectif" className="cryptic-link">
                  COLLECTIF
                </Link>
              </li>
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
                <Link href="/recrutement" className="cryptic-link">
                  RECRUTEMENT
                </Link>
              </li>
              <li>
                <Link href="/contact" className="cryptic-link">
                  CONTACT
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 font-display text-xl text-blakkout-primary">SUIVEZ-NOUS</h3>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blakkout-foreground transition-colors duration-300 hover:text-blakkout-primary transition-transform duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blakkout-foreground transition-colors duration-300 hover:text-blakkout-primary"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blakkout-foreground transition-colors duration-300 hover:text-blakkout-primary"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-8 border-t border-blakkout-primary/30 pt-8 text-center font-mono text-xs text-blakkout-foreground/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p>
            &copy; {currentYear} @blakkout_mars. Tous droits réservés.
          </p>
          <p className="mt-2">
            <span className="text-blakkout-primary">{'<'}</span> Conçu avec des algorithmes cryptiques <span className="text-blakkout-primary">{'>'}</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}