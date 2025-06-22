import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCrypticDate, decryptEffect } from '@/lib/utils';

type CrypticEventCardProps = {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  imageUrl: string;
  ticketUrl?: string;
  isFeatured?: boolean;
  isSecret?: boolean;
  revealDelay?: number;
};

export default function CrypticEventCard({
  id,
  title,
  date,
  location,
  description,
  imageUrl,
  ticketUrl,
  isFeatured = false,
  isSecret = false,
  revealDelay = 0,
}: CrypticEventCardProps) {
  const [isRevealed, setIsRevealed] = useState(!isSecret);
  const [isHovered, setIsHovered] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLTimeElement>(null);

  // Effet pour révéler progressivement les informations secrètes
  useEffect(() => {
    if (isSecret && revealDelay > 0) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
        
        // Appliquer l'effet de déchiffrement au titre
        if (titleRef.current !== null) {
          decryptEffect(titleRef.current, title, 1000);
        }
        
        // Appliquer l'effet de déchiffrement à l'emplacement
        if (locationRef.current !== null) {
          setTimeout(() => {
            if (locationRef.current) {
              decryptEffect(locationRef.current, location, 800);
            }
          }, 300);
        }
        
        // Appliquer l'effet de déchiffrement à la date
        if (dateRef.current !== null) {
          setTimeout(() => {
            if (dateRef.current) {
              decryptEffect(dateRef.current, formatCrypticDate(date), 800);
            }
          }, 600);
        }
      }, revealDelay);

      return () => clearTimeout(timer);
    }
  }, [isSecret, revealDelay, title, location, date]);

  // Variantes pour l'animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 0 15px rgba(0, 255, 0, 0.5)",
      transition: { duration: 0.3 }
    }
  };

  // Variantes pour l'overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className={`event-card ${isFeatured ? 'border-2' : 'border'} ${isSecret && !isRevealed ? 'opacity-70' : ''} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        {/* Image avec effet de glitch */}
        {/* Vérification des URLs d'image et gestion des erreurs améliorée */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-blakkout-muted text-blakkout-foreground/50">
            <div className="text-center">
              <div className="mb-2 font-mono text-sm">IMAGE PLACEHOLDER</div>
              <div className="text-xs opacity-70">Aucune image disponible</div>
            </div>
          </div>
        )}
        
        {/* Overlay avec effet de scan ligne */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-blakkout-background/80 to-transparent"
          variants={overlayVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
        />
        
        {/* Badge Featured */}
        {isFeatured && (
          <div className="absolute right-0 top-0 bg-blakkout-primary px-2 py-1 font-mono text-xs text-blakkout-background">
            FEATURED
          </div>
        )}
        
        {/* Badge Secret */}
        {isSecret && (
          <div className="absolute left-0 top-0 bg-blakkout-secondary px-2 py-1 font-mono text-xs text-blakkout-background">
            {isRevealed ? 'DÉCHIFFRÉ' : 'CRYPTÉ'}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Titre */}
        <h3 
          ref={titleRef}
          className={`mb-2 font-display text-xl ${isSecret && !isRevealed ? 'text-glitch' : 'text-blakkout-primary'}`}
        >
          {isSecret && !isRevealed ? '█████████' : title}
        </h3>
        
        {/* Date et lieu */}
        <div className="mb-3 flex justify-between text-sm">
          <time 
            ref={dateRef}
            dateTime={date.toISOString()} 
            className="font-mono text-blakkout-accent"
          >
            {isSecret && !isRevealed ? '██.██.████' : formatCrypticDate(date)}
          </time>
          <div 
            ref={locationRef}
            className="font-mono text-blakkout-secondary"
          >
            {isSecret && !isRevealed ? '████████' : location}
          </div>
        </div>
        
        {/* Description */}
        <p className="mb-4 text-sm text-blakkout-foreground/80">
          {isSecret && !isRevealed 
            ? 'Informations cryptées. Accès restreint.'
            : description.length > 120 
              ? `${description.substring(0, 120)}...` 
              : description
          }
        </p>
        
        {/* Bouton */}
        <div className="flex justify-end">
          <Link href={`/evenements/${id}`} className="hacker-button text-sm">
            {isSecret && !isRevealed ? 'DÉCHIFFRER' : 'DÉTAILS'}
          </Link>
          
          {ticketUrl && isRevealed && (
            <Link href={ticketUrl} className="hacker-button ml-2 text-sm">
              TICKETS
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}