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
          <p className="mt-2">
            <span className="text-blakkout-primary">{'{'}</span> Développé avec passion par <span className="text-blakkout-primary font-bold">Hugo BURNET</span> <span className="text-blakkout-primary">{'}'}</span>
          </p>
          <p className="mt-1 text-sm flex items-center justify-center">
            <a 
              href="https://github.com/Jules624" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blakkout-primary hover:text-blakkout-accent transition-colors duration-300 flex items-center gap-2 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
              title="Voir le profil GitHub de Hugo BURNET"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="hover:scale-125 transition-transform duration-300"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-blakkout-accent">@</span>Jules624
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}