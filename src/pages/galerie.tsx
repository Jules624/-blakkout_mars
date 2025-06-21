import React, { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import Layout from '@/components/layout/Layout';
import TerminalInput from '@/components/ui/TerminalInput';
import TVBlackout from '@/components/ui/TVBlackout';

// Types pour les médias
type MediaType = 'image' | 'video';

type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  src: string;
  event: string;
  date: string;
  tags: string[];
};

// Données d'exemple pour la galerie
const mediaItems: MediaItem[] = [
  {
    id: 'media-001',
    type: 'image',
    title: 'NEURAL NETWORK - OPENING',
    description: 'Ouverture de la soirée Neural Network à la Friche Belle de Mai',
    src: '/assets/images/gallery/neural-opening.jpg',
    event: 'NEURAL NETWORK',
    date: '2023-10-05',
    tags: ['opening', 'light', 'crowd'],
  },
  {
    id: 'media-002',
    type: 'image',
    title: 'NEURAL NETWORK - MAIN STAGE',
    description: 'Vue de la scène principale pendant le set de DJ Netrunner',
    src: '/assets/images/gallery/neural-mainstage.jpg',
    event: 'NEURAL NETWORK',
    date: '2023-10-05',
    tags: ['stage', 'performance', 'light'],
  },
  {
    id: 'media-003',
    type: 'video',
    title: 'NEURAL NETWORK - AFTERMOVIE',
    description: 'Résumé de la soirée Neural Network',
    src: '/assets/videos/neural-aftermovie.mp4',
    event: 'NEURAL NETWORK',
    date: '2023-10-05',
    tags: ['aftermovie', 'highlights', 'recap'],
  },
  {
    id: 'media-004',
    type: 'image',
    title: 'SYSTEM FAILURE - ROOFTOP',
    description: 'Vue du rooftop R2 pendant System Failure',
    src: '/assets/images/gallery/system-rooftop.jpg',
    event: 'SYSTEM FAILURE',
    date: '2023-08-12',
    tags: ['outdoor', 'sunset', 'crowd'],
  },
  {
    id: 'media-005',
    type: 'image',
    title: 'SYSTEM FAILURE - DJ BOOTH',
    description: 'Le DJ booth pendant le set de Error 404',
    src: '/assets/images/gallery/system-djbooth.jpg',
    event: 'SYSTEM FAILURE',
    date: '2023-08-12',
    tags: ['dj', 'equipment', 'performance'],
  },
  {
    id: 'media-006',
    type: 'video',
    title: 'SYSTEM FAILURE - AFTERMOVIE',
    description: 'Résumé de la soirée System Failure',
    src: '/assets/videos/system-aftermovie.mp4',
    event: 'SYSTEM FAILURE',
    date: '2023-08-12',
    tags: ['aftermovie', 'highlights', 'recap'],
  },
  {
    id: 'media-007',
    type: 'image',
    title: 'TERMINAL ACCESS - WAREHOUSE',
    description: 'L\'entrepôt K7 transformé pour Terminal Access',
    src: '/assets/images/gallery/terminal-warehouse.jpg',
    event: 'TERMINAL ACCESS',
    date: '2023-06-30',
    tags: ['venue', 'decoration', 'industrial'],
  },
  {
    id: 'media-008',
    type: 'image',
    title: 'TERMINAL ACCESS - LIGHT SHOW',
    description: 'Le spectacle de lumière pendant Terminal Access',
    src: '/assets/images/gallery/terminal-lightshow.jpg',
    event: 'TERMINAL ACCESS',
    date: '2023-06-30',
    tags: ['light', 'visual', 'atmosphere'],
  },
  {
    id: 'media-009',
    type: 'video',
    title: 'TERMINAL ACCESS - AFTERMOVIE',
    description: 'Résumé de la soirée Terminal Access',
    src: '/assets/videos/terminal-aftermovie.mp4',
    event: 'TERMINAL ACCESS',
    date: '2023-06-30',
    tags: ['aftermovie', 'highlights', 'recap'],
  },
];

// Commandes pour le terminal
const galleryCommands = [
  {
    command: 'list',
    description: 'Liste tous les médias ou filtre par type (list [type])',
    action: (args: string[]) => {
      const type = args[0]?.toLowerCase();
      let filtered = mediaItems;
      
      if (type === 'image' || type === 'video') {
        filtered = mediaItems.filter(item => item.type === type);
      }
      
      return (
        <div className="space-y-1 font-mono text-sm">
          <p className="mb-2 text-blakkout-accent">{filtered.length} médias trouvés:</p>
          {filtered.map(item => (
            <div key={item.id} className="flex">
              <span className="mr-2 text-blakkout-primary">{item.id}</span>
              <span className="text-blakkout-foreground">{item.title}</span>
              <span className="ml-2 text-blakkout-foreground/50">[{item.type}]</span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    command: 'show',
    description: 'Affiche un média spécifique (show [id])',
    action: (args: string[]) => {
      const id = args[0];
      const item = mediaItems.find(item => item.id === id);
      
      if (!item) {
        return `Erreur: Média avec l'ID "${id}" non trouvé. Utilisez la commande "list" pour voir tous les médias disponibles.`;
      }
      
      return (
        <div className="space-y-2 font-mono text-sm">
          <p className="text-blakkout-accent">{item.title}</p>
          <p className="text-blakkout-foreground">{item.description}</p>
          <p>
            <span className="text-blakkout-foreground/50">Événement: </span>
            <span className="text-blakkout-primary">{item.event}</span>
          </p>
          <p>
            <span className="text-blakkout-foreground/50">Date: </span>
            <span className="text-blakkout-primary">{item.date}</span>
          </p>
          <p>
            <span className="text-blakkout-foreground/50">Tags: </span>
            <span className="text-blakkout-primary">{item.tags.join(', ')}</span>
          </p>
          <p className="text-blakkout-foreground/50">Utilisez la galerie visuelle pour voir ce média.</p>
        </div>
      );
    },
  },
  {
    command: 'filter',
    description: 'Filtre les médias par tag ou événement (filter [tag|event] [valeur])',
    action: (args: string[]) => {
      if (args.length < 2) {
        return 'Erreur: Utilisez le format "filter [tag|event] [valeur]"';
      }
      
      const filterType = args[0].toLowerCase();
      const filterValue = args[1].toLowerCase();
      
      let filtered: MediaItem[] = [];
      
      if (filterType === 'tag') {
        filtered = mediaItems.filter(item => 
          item.tags.some(tag => tag.toLowerCase() === filterValue)
        );
      } else if (filterType === 'event') {
        filtered = mediaItems.filter(item => 
          item.event.toLowerCase().includes(filterValue)
        );
      } else {
        return `Erreur: Type de filtre "${filterType}" non reconnu. Utilisez "tag" ou "event".`;
      }
      
      if (filtered.length === 0) {
        return `Aucun média trouvé pour ${filterType} "${filterValue}".`;
      }
      
      return (
        <div className="space-y-1 font-mono text-sm">
          <p className="mb-2 text-blakkout-accent">{filtered.length} médias trouvés pour {filterType} "{filterValue}":</p>
          {filtered.map(item => (
            <div key={item.id} className="flex">
              <span className="mr-2 text-blakkout-primary">{item.id}</span>
              <span className="text-blakkout-foreground">{item.title}</span>
              <span className="ml-2 text-blakkout-foreground/50">[{item.type}]</span>
            </div>
          ))}
        </div>
      );
    },
  },
];

export default function Galerie() {
  const [activeView, setActiveView] = useState<'grid' | 'terminal'>('grid');
  const [showTerminal, setShowTerminal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<{
    type: MediaType | 'all';
    event: string | null;
    tag: string | null;
  }>({ type: 'all', event: null, tag: null });
  
  // Filtrer les médias
  const filteredMedia = mediaItems.filter(item => {
    // Filtre par type
    if (filter.type !== 'all' && item.type !== filter.type) return false;
    
    // Filtre par événement
    if (filter.event && !item.event.toLowerCase().includes(filter.event.toLowerCase())) return false;
    
    // Filtre par tag
    if (filter.tag && !item.tags.some(tag => tag.toLowerCase() === filter.tag?.toLowerCase())) return false;
    
    return true;
  });
  
  // Obtenir les événements uniques pour le filtre
  const uniqueEvents = Array.from(new Set(mediaItems.map(item => item.event)));
  
  // Obtenir les tags uniques pour le filtre
  const uniqueTags = Array.from(new Set(mediaItems.flatMap(item => item.tags)));
  
  return (
    <Layout>
      <NextSeo title="Galerie" />
      
      <TVBlackout initialDelay={1000} frequency={0.05} />
      
      <div className="circuit-bg py-20 pt-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 font-display text-4xl text-blakkout-primary">GALERIE</h1>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
            <p className="mt-4 font-mono text-blakkout-foreground">
              Explorez les photos et vidéos de nos événements passés.
            </p>
          </motion.div>
          
          {/* Contrôles de vue et filtres */}
          <motion.div 
            className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveView('grid')}
                className={`hacker-button ${activeView === 'grid' ? 'active' : ''}`}
              >
                GRILLE
              </button>
              <button 
                onClick={() => {
                  setActiveView('terminal');
                  setShowTerminal(true);
                }}
                className={`hacker-button ${activeView === 'terminal' ? 'active' : ''}`}
              >
                TERMINAL
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value as MediaType | 'all' })}
                className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-sm text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
              >
                <option value="all">TOUS LES TYPES</option>
                <option value="image">IMAGES</option>
                <option value="video">VIDÉOS</option>
              </select>
              
              <select
                value={filter.event || ''}
                onChange={(e) => setFilter({ ...filter, event: e.target.value || null })}
                className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-sm text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
              >
                <option value="">TOUS LES ÉVÉNEMENTS</option>
                {uniqueEvents.map(event => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
              
              <select
                value={filter.tag || ''}
                onChange={(e) => setFilter({ ...filter, tag: e.target.value || null })}
                className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-sm text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
              >
                <option value="">TOUS LES TAGS</option>
                {uniqueTags.map(tag => (
                  <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </motion.div>
          
          {/* Vue grille */}
          {activeView === 'grid' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMedia.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      onClick={() => setSelectedMedia(item)}
                      className="cursor-pointer"
                    >
                      <div className="group relative overflow-hidden rounded-md border border-blakkout-primary bg-blakkout-background/50 backdrop-blur-sm">
                        <div className="aspect-video bg-blakkout-muted">
                          {/* Placeholder pour image/vidéo */}
                          <div className="flex h-full items-center justify-center bg-blakkout-muted">
                            {item.type === 'image' ? (
                              <span className="font-mono text-sm text-blakkout-primary">[IMAGE] {item.title}</span>
                            ) : (
                              <span className="font-mono text-sm text-blakkout-primary">[VIDÉO] {item.title}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="mb-2 font-display text-lg text-blakkout-primary">{item.title}</h3>
                          <p className="mb-2 font-mono text-sm text-blakkout-foreground">{item.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-blakkout-foreground/70">{item.event}</span>
                            <span className="font-mono text-xs text-blakkout-foreground/70">{item.date}</span>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.tags.map(tag => (
                              <span 
                                key={tag} 
                                className="rounded-full bg-blakkout-primary/10 px-2 py-0.5 font-mono text-xs text-blakkout-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFilter({ ...filter, tag });
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center bg-blakkout-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <button className="hacker-button">
                            {item.type === 'image' ? 'VOIR L\'IMAGE' : 'VOIR LA VIDÉO'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-6 text-center font-mono">
                  <p className="text-blakkout-foreground">Aucun média trouvé pour les filtres sélectionnés.</p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Vue terminal */}
          {activeView === 'terminal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-2xl text-blakkout-accent">TERMINAL GALERIE</h2>
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
                      availableCommands={galleryCommands}
                      initialMessage="Terminal de la galerie @blakkout_mars. Tapez 'list' pour voir tous les médias disponibles ou 'help' pour voir toutes les commandes."
                    />
                  </motion.div>
                ) : (
                  <p className="font-mono text-sm text-blakkout-foreground/70">
                    Utilisez le terminal pour naviguer dans la galerie avec des commandes comme 'list', 'show' et 'filter'.
                  </p>
                )}
              </div>
              
              <div className="mt-8">
                <h2 className="mb-6 font-display text-2xl text-blakkout-accent">GUIDE DU TERMINAL</h2>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-4">
                    <h3 className="mb-2 font-display text-lg text-blakkout-primary">COMMANDES DE BASE</h3>
                    <ul className="space-y-2 font-mono text-sm">
                      <li><span className="text-blakkout-accent">help</span> - Affiche toutes les commandes disponibles</li>
                      <li><span className="text-blakkout-accent">clear</span> - Efface le terminal</li>
                      <li><span className="text-blakkout-accent">list</span> - Liste tous les médias</li>
                      <li><span className="text-blakkout-accent">list image</span> - Liste toutes les images</li>
                      <li><span className="text-blakkout-accent">list video</span> - Liste toutes les vidéos</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-4">
                    <h3 className="mb-2 font-display text-lg text-blakkout-primary">COMMANDES AVANCÉES</h3>
                    <ul className="space-y-2 font-mono text-sm">
                      <li><span className="text-blakkout-accent">show media-001</span> - Affiche les détails d'un média spécifique</li>
                      <li><span className="text-blakkout-accent">filter tag aftermovie</span> - Filtre les médias par tag</li>
                      <li><span className="text-blakkout-accent">filter event NEURAL</span> - Filtre les médias par événement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Modal pour média sélectionné */}
          <AnimatePresence>
            {selectedMedia && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                onClick={() => setSelectedMedia(null)}
              >
                <motion.div 
                  className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-md border border-blakkout-primary bg-blakkout-background p-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    className="absolute right-4 top-4 text-blakkout-foreground hover:text-blakkout-primary"
                    onClick={() => setSelectedMedia(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                  
                  <h2 className="mb-4 font-display text-2xl text-blakkout-primary">{selectedMedia.title}</h2>
                  
                  <div className="mb-4 aspect-video bg-blakkout-muted">
                    {/* Placeholder pour image/vidéo */}
                    <div className="flex h-full items-center justify-center bg-blakkout-muted">
                      {selectedMedia.type === 'image' ? (
                        <span className="font-mono text-sm text-blakkout-primary">[IMAGE] {selectedMedia.title}</span>
                      ) : (
                        <span className="font-mono text-sm text-blakkout-primary">[VIDÉO] {selectedMedia.title}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="font-mono text-blakkout-foreground">{selectedMedia.description}</p>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-sm text-blakkout-foreground/70">ÉVÉNEMENT</p>
                        <p className="font-mono text-blakkout-primary">{selectedMedia.event}</p>
                      </div>
                      
                      <div>
                        <p className="font-mono text-sm text-blakkout-foreground/70">DATE</p>
                        <p className="font-mono text-blakkout-primary">{selectedMedia.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="mb-2 font-mono text-sm text-blakkout-foreground/70">TAGS</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMedia.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="rounded-full bg-blakkout-primary/10 px-2 py-1 font-mono text-xs text-blakkout-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 text-right">
                      <button 
                        className="hacker-button"
                        onClick={() => setSelectedMedia(null)}
                      >
                        FERMER
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}