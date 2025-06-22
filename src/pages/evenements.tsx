import React, { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Image from 'next/image';

import Layout from '@/components/layout/Layout';
import CrypticEventCard from '@/components/events/CrypticEventCard';
import TVBlackout from '@/components/effects/TVBlackout';

// Types pour les événements
type EventType = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  isSecret?: boolean;
  secretCode?: string;
  lineup?: string[];
  ticketUrl?: string;
};

// Données d'exemple pour les événements
const upcomingEvents: EventType[] = [
  {
    id: 'event-001',
    title: 'BLAKKOUT: CYBERPUNK EDITION',
    date: '2023-12-15',
    location: 'Cabaret Aléatoire, Marseille',
    description: 'Plongez dans l\'univers Cyberpunk avec une soirée mêlant techno industrielle et décors futuristes. Dress code: néons et cuir.',
    imageUrl: '/assets/images/events/event-cyberpunk.jpg',
    lineup: ['DJ Netrunner', 'Synth Riot', 'Binary Pulse'],
    ticketUrl: 'https://example.com/tickets/cyberpunk',
  },
  {
    id: 'event-002',
    title: 'DIGITAL WASTELAND',
    date: '2024-01-20',
    location: 'Dock des Suds, Marseille',
    description: 'Une expérience post-apocalyptique où la techno rencontre le chaos numérique. Installations interactives et performances live.',
    imageUrl: '/assets/images/events/event-wasteland.jpg',
    lineup: ['Glitch Mob', 'Error 404', 'Data Corruption'],
    ticketUrl: 'https://example.com/tickets/wasteland',
  },
  {
    id: 'event-003',
    title: 'HIDDEN TRANSMISSION',
    date: '2024-02-10',
    location: '???',
    description: 'Événement secret dans un lieu révélé 24h avant. Techno minimaliste et ambiances sombres.',
    imageUrl: '/assets/images/events/event-hidden.jpg',
    isSecret: true,
    secretCode: 'DARKNET',
    lineup: ['???', '???', '???'],
  },
];

const pastEvents: EventType[] = [
  {
    id: 'event-p001',
    title: 'NEURAL NETWORK',
    date: '2023-10-05',
    location: 'Friche Belle de Mai, Marseille',
    description: 'Première édition de notre série d\'événements sur l\'intelligence artificielle et la techno expérimentale.',
    imageUrl: '/assets/images/events/event-neural.jpg',
  },
  {
    id: 'event-p002',
    title: 'SYSTEM FAILURE',
    date: '2023-08-12',
    location: 'Rooftop R2, Marseille',
    description: 'Open air avec vue sur la mer et sons électroniques disruptifs.',
    imageUrl: '/assets/images/events/event-system.jpg',
  },
  {
    id: 'event-p003',
    title: 'ACCESS',
    date: '2023-06-30',
    location: 'Warehouse K7, Marseille',
    description: 'Dans un entrepôt désaffecté, une nuit de techno industrielle et d\'installations numériques.',
    imageUrl: '/assets/images/events/event-terminal.jpg',
  },
];

export default function Evenements() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer les événements
  const filteredEvents = {
    upcoming: upcomingEvents.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    past: pastEvents.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };
  
  return (
    <Layout>
      <NextSeo title="Événements" />
      
      <TVBlackout initialDelay={1000} frequency={0.1}>
        <div className="circuit-bg py-20 pt-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 font-display text-4xl text-blakkout-primary">ÉVÉNEMENTS</h1>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
            <p className="mt-4 font-mono text-blakkout-foreground">
              Découvrez nos événements passés et à venir. Certains événements sont secrets et nécessitent un code d'accès.
            </p>
          </motion.div>
          
          {/* Filtres et recherche */}
          <motion.div 
            className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`hacker-button ${filter === 'all' ? 'active' : ''}`}
              >
                TOUS
              </button>
              <button 
                onClick={() => setFilter('upcoming')}
                className={`hacker-button ${filter === 'upcoming' ? 'active' : ''}`}
              >
                À VENIR
              </button>
              <button 
                onClick={() => setFilter('past')}
                className={`hacker-button ${filter === 'past' ? 'active' : ''}`}
              >
                PASSÉS
              </button>
            </div>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="RECHERCHER..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
              />
              <div className="absolute right-2 top-2 text-blakkout-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
            </div>
          </motion.div>
          
          {/* Événements à venir */}
          {(filter === 'all' || filter === 'upcoming') && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="mb-6 font-display text-2xl text-blakkout-accent">ÉVÉNEMENTS À VENIR</h2>
              
              {filteredEvents.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.upcoming.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <CrypticEventCard
                        id={event.id}
                        title={event.title}
                        date={new Date(event.date)}
                        location={event.location}
                        description={event.description}
                        imageUrl={event.imageUrl}
                        isSecret={event.isSecret}
                        ticketUrl={event.ticketUrl}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-6 text-center font-mono">
                  <p className="text-blakkout-foreground">Aucun événement à venir trouvé pour votre recherche.</p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Événements passés */}
          {(filter === 'all' || filter === 'past') && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="mb-6 font-display text-2xl text-blakkout-accent">ÉVÉNEMENTS PASSÉS</h2>
              
              {filteredEvents.past.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.past.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <CrypticEventCard
                        id={event.id}
                        title={event.title}
                        date={new Date(event.date)}
                        location={event.location}
                        description={event.description}
                        imageUrl={event.imageUrl}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-6 text-center font-mono">
                  <p className="text-blakkout-foreground">Aucun événement passé trouvé pour votre recherche.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
        </div>
      </TVBlackout>
    </Layout>
  );
}