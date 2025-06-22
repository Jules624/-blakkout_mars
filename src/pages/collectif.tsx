import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import Image from 'next/image';

import Layout from '@/components/layout/Layout';
// import TVBlackout from '@/components/effects/TVBlackout'; // Removed to disable flickering effect
import MarkdownReveal from '@/components/content/MarkdownReveal';

// Types pour les membres du collectif
type MemberRole = 'dj' | 'vj' | 'dev' | 'comm' | 'founder';

type Member = {
  id: string;
  name: string;
  alias?: string;
  role: MemberRole;
  bio: string;
  imageUrl: string;
  socialLinks?: {
    instagram?: string;
    soundcloud?: string;
    github?: string;
    website?: string;
  };
};

// Données d'exemple pour les membres du collectif
const members: Member[] = [
  {
    id: 'member-001',
    name: 'Alex Noir',
    alias: 'BLKKT_FOUNDER',
    role: 'founder',
    bio: 'Fondateur du collectif @blakkout_mars. DJ, producteur et développeur créatif spécialisé dans les expériences immersives et les performances audiovisuelles.',
    imageUrl: '/assets/images/team/founder.jpg',
    socialLinks: {
      instagram: 'https://instagram.com/blakkout_mars',
      soundcloud: 'https://soundcloud.com/blakkout_mars',
      github: 'https://github.com/blakkout',
      website: 'https://blakkout.mars',
    },
  },
  {
    id: 'member-002',
    name: 'Marie Glitch',
    alias: 'GLITCH_CTRL',
    role: 'vj',
    bio: 'Artiste visuelle et VJ spécialisée dans les visuels glitch et les installations immersives. Travaille avec TouchDesigner et VDMX pour créer des expériences visuelles uniques.',
    imageUrl: '/assets/images/team/vj.jpg',
    socialLinks: {
      instagram: 'https://instagram.com/glitch_ctrl',
      website: 'https://glitch-ctrl.net',
    },
  },
  {
    id: 'member-003',
    name: 'Thomas Bass',
    alias: 'LOWFREQ',
    role: 'dj',
    bio: 'DJ et producteur spécialisé dans la techno industrielle et l\'electro. Créateur de sets immersifs qui racontent une histoire à travers le son et le rythme.',
    imageUrl: '/assets/images/team/dj.jpg',
    socialLinks: {
      instagram: 'https://instagram.com/lowfreq',
      soundcloud: 'https://soundcloud.com/lowfreq',
    },
  },
  {
    id: 'member-004',
    name: 'Sarah Code',
    alias: 'CODEBREAKER',
    role: 'dev',
    bio: 'Développeuse créative spécialisée dans les installations interactives et les expériences web immersives. Travaille avec WebGL, Three.js et les technologies de réalité augmentée.',
    imageUrl: '/assets/images/team/dev.jpg',
    socialLinks: {
      github: 'https://github.com/codebreaker',
      website: 'https://codebreaker.dev',
    },
  },
  {
    id: 'member-005',
    name: 'Hugo BURNET',
    alias: 'JULES624',
    role: 'dev',
    bio: 'Développeur full-stack passionné par les technologies web modernes et l\'innovation numérique. Contributeur actif au projet @blakkout_mars, spécialisé dans React, Next.js, TypeScript et les expériences utilisateur immersives. Toujours à la recherche de nouveaux défis techniques.',
    imageUrl: '/assets/images/team/dev2.jpg',
    socialLinks: {
      github: 'https://github.com/Jules624',
      website: 'https://hugo-burnet.dev',
    },
  },
  {
    id: 'member-006',
    name: 'Julien Network',
    alias: 'NETRUNNER',
    role: 'comm',
    bio: 'Responsable communication et réseaux sociaux. Spécialiste en marketing digital et en création de communautés engagées autour de projets artistiques et culturels.',
    imageUrl: '/assets/images/team/comm.jpg',
    socialLinks: {
      instagram: 'https://instagram.com/netrunner',
      website: 'https://netrunner.media',
    },
  },
];

// Contenu markdown pour la section manifeste
const manifesteContent = `
# MANIFESTE @BLAKKOUT_MARS

## NOTRE VISION

@blakkout_mars est né d'une volonté de créer des espaces d'expression libres où la technologie rencontre l'art, où le code devient performance, et où l'immersion est totale.

Nous croyons en la puissance de l'expérience collective, à la fusion des disciplines artistiques et technologiques, et à la création d'univers parallèles éphémères.

## NOS PRINCIPES

### 1. IMMERSION TOTALE

Chaque événement est conçu comme une expérience immersive complète, où tous les sens sont sollicités. Son, lumière, projection, interaction : tout est pensé pour créer un univers cohérent.

### 2. FUSION TECHNOLOGIQUE

Nous explorons les frontières entre le réel et le virtuel, utilisant la technologie non comme une fin en soi, mais comme un médium d'expression artistique et d'expérimentation.

### 3. COMMUNAUTÉ PARTICIPATIVE

Nous croyons en l'intelligence collective et en la participation active. Notre communauté n'est pas spectatrice mais actrice de l'expérience.

### 4. ÉPHÉMÈRE ET UNIQUE

Chaque événement est unique, impossible à reproduire à l'identique. Nous célébrons le caractère éphémère de l'expérience vécue.

### 5. ACCESSIBILITÉ ET INCLUSION

Nous nous efforçons de créer des espaces sûrs, inclusifs et accessibles, où chacun peut exprimer sa créativité sans jugement.

## NOTRE APPROCHE

Notre collectif réunit des artistes, développeurs, musiciens, designers et penseurs qui partagent une vision commune : repousser les limites de l'expérience collective à travers la fusion de l'art et de la technologie.

Nous concevons chaque événement comme une œuvre totale, où chaque élément contribue à une narration globale, créant ainsi des souvenirs durables et des connexions authentiques.
`;

const getRoleLabel = (role: MemberRole): string => {
  const roleLabels = {
    founder: 'FONDATEUR',
    dj: 'DJ / PRODUCTEUR',
    vj: 'VJ / ARTISTE VISUEL',
    dev: 'DÉVELOPPEUR CRÉATIF',
    comm: 'COMMUNICATION',
  };
  return roleLabels[role];
};

export default function Collectif() {
  return (
    <Layout disableTVBlackout={true}>
      <NextSeo title="Le Collectif" />
      
      <div className="circuit-bg py-20 pt-32">
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-2 font-display text-4xl text-blakkout-primary">LE COLLECTIF</h1>
              <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
              <p className="mt-4 font-mono text-blakkout-foreground">
                Découvrez les membres de @blakkout_mars et notre manifeste.
              </p>
            </motion.div>
            
            {/* Section Équipe */}
            <section className="mb-20">
              <motion.h2 
                className="mb-8 font-display text-2xl text-blakkout-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                L'ÉQUIPE
              </motion.h2>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div className="mb-4 aspect-square overflow-hidden rounded-md">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    
                    <div className="mb-2">
                      <h3 className="font-display text-lg text-blakkout-primary">{member.name}</h3>
                      {member.alias && (
                        <p className="font-mono text-sm text-blakkout-foreground/70">@{member.alias}</p>
                      )}
                      <p className="font-mono text-xs uppercase text-blakkout-primary">
                        {getRoleLabel(member.role)}
                      </p>
                    </div>
                    
                    <p className="mb-4 text-sm text-blakkout-foreground">{member.bio}</p>
                    
                    {member.socialLinks && (
                      <div className="flex gap-2">
                        {member.socialLinks.instagram && (
                          <a 
                            href={member.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blakkout-primary hover:text-blakkout-foreground"
                          >
                            IG
                          </a>
                        )}
                        {member.socialLinks.soundcloud && (
                          <a 
                            href={member.socialLinks.soundcloud}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blakkout-primary hover:text-blakkout-foreground"
                          >
                            SC
                          </a>
                        )}
                        {member.socialLinks.github && (
                          <a 
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blakkout-primary hover:text-blakkout-foreground"
                          >
                            GH
                          </a>
                        )}
                        {member.socialLinks.website && (
                          <a 
                            href={member.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blakkout-primary hover:text-blakkout-foreground"
                          >
                            WEB
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
            
            {/* Section Manifeste */}
            <section className="mb-20">
              <motion.h2 
                className="mb-8 font-display text-2xl text-blakkout-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                MANIFESTE
              </motion.h2>
              
              <div className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                <MarkdownReveal 
                  content={manifesteContent}
                  revealOnScroll={true}
                  revealSpeed="medium"
                  crypticLevel="medium"
                />
              </div>
            </section>
            
            {/* Section Rejoindre */}
            <section>
              <motion.h2 
                className="mb-8 font-display text-2xl text-blakkout-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                REJOINDRE LE COLLECTIF
              </motion.h2>
              
              <motion.div 
                className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 text-center backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="mb-6 font-mono text-blakkout-foreground">
                  Vous souhaitez rejoindre l'aventure @blakkout_mars ? Nous sommes toujours à la recherche de nouveaux talents pour enrichir notre collectif.
                </p>
                
                <a 
                  href="/recrutement" 
                  className="inline-block hacker-button"
                >
                  VOIR LES OPPORTUNITÉS
                </a>
              </motion.div>
            </section>
          </div>
        </div>
    </Layout>
  );
}