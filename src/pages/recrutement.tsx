import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import TVBlackout from '@/components/ui/TVBlackout';
import TerminalInput from '@/components/ui/TerminalInput';
import { useEasterEggs } from '@/context/EasterEggContext';

// Schéma de validation pour le formulaire
const applicationSchema = z.object({
  name: z.string().min(2, { message: 'Nom requis (min. 2 caractères)' }),
  email: z.string().email({ message: 'Email invalide' }),
  skills: z.string().min(3, { message: 'Compétences requises' }),
  motivation: z.string().min(10, { message: 'Motivation requise (min. 10 caractères)' }),
  portfolio: z.string().url({ message: 'URL invalide' }).optional().or(z.literal('')),
  secretCode: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

// Rôles disponibles dans le collectif
const availableRoles = [
  {
    id: 'dj',
    title: 'DJ / PRODUCTEUR',
    description: 'Créez des sets immersifs et des productions originales pour nos événements.',
    requirements: ['Expérience en production musicale', 'Connaissance des genres techno, electro, breakbeat', 'Portfolio sonore'],
    isHidden: false,
  },
  {
    id: 'vj',
    title: 'VJ / ARTISTE VISUEL',
    description: 'Concevez des visuels temps-réel et des installations pour nos événements.',
    requirements: ['Maîtrise de logiciels comme TouchDesigner, Resolume', 'Sensibilité esthétique glitch/hacking', 'Portfolio visuel'],
    isHidden: false,
  },
  {
    id: 'dev',
    title: 'DÉVELOPPEUR CRÉATIF',
    description: 'Créez des expériences interactives et des installations numériques.',
    requirements: ['Compétences en programmation (JavaScript, Python, C++)', 'Expérience avec des frameworks créatifs', 'Portfolio de projets'],
    isHidden: false,
  },
  {
    id: 'comm',
    title: 'COMMUNICATION / RÉSEAUX',
    description: 'Gérez notre présence en ligne et développez notre communauté.',
    requirements: ['Expérience en community management', 'Sensibilité à notre univers', 'Capacités rédactionnelles'],
    isHidden: false,
  },
  {
    id: 'secret',
    title: 'AGENT CRYPTIQUE',
    description: 'Rôle secret nécessitant des compétences spéciales en cryptographie et sécurité.',
    requirements: ['Connaissances en cryptographie', 'Expérience en sécurité informatique', 'Pensée latérale'],
    isHidden: true, // Rôle caché, accessible uniquement via easter egg
  },
];

export default function Recrutement() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<ApplicationForm>({
    name: '',
    email: '',
    skills: '',
    motivation: '',
    portfolio: '',
    secretCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);
  
  const { activateEasterEgg, easterEggs } = useEasterEggs();
  
  // Filtrer les rôles visibles (sauf si l'easter egg est activé)
  const visibleRoles = availableRoles.filter(role => 
    !role.isHidden || (role.id === 'secret' && easterEggs.secretAgent)
  );
  
  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Vérifier si le code secret est entré
    if (name === 'secretCode' && value === 'BLKKT-AGENT') {
      activateEasterEgg('secretAgent');
    }
  };
  
  // Valider et soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Valider les données avec Zod
      const validData = applicationSchema.parse(formData);
      
      // Simuler un envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Formulaire soumis:', validData);
      setIsSuccess(true);
      
      // Réinitialiser le formulaire après succès
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          skills: '',
          motivation: '',
          portfolio: '',
          secretCode: '',
        });
        setSelectedRole(null);
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convertir les erreurs Zod en format utilisable
        const fieldErrors: Partial<Record<keyof ApplicationForm, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ApplicationForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Erreur lors de la soumission:', error);
        setErrors({ name: 'Une erreur est survenue. Veuillez réessayer.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Commandes personnalisées pour le terminal
  const availableCommands = [
    {
      command: 'roles',
      description: 'Afficher les rôles disponibles',
      action: () => {
        return `Rôles disponibles:\n${visibleRoles.map(role => `- ${role.title}: ${role.description}`).join('\n')}`;
      }
    },
    {
      command: 'apply',
      description: 'Postuler à un rôle spécifique',
      action: (args: string[]) => {
        const roleId = args[0];
        const role = availableRoles.find(r => r.id === roleId);
        if (!role) {
          return `Rôle inconnu: ${roleId}\nUtilisez 'roles' pour voir les options disponibles.`;
        }
        setSelectedRole(roleId);
        setTerminalMode(false);
        return `Sélection du rôle: ${role.title}\nPassage en mode formulaire...`;
      }
    },
    {
      command: 'requirements',
      description: 'Voir les prérequis d\'un rôle',
      action: (args: string[]) => {
        const roleId = args[0];
        const role = availableRoles.find(r => r.id === roleId);
        if (!role) {
          return `Rôle inconnu: ${roleId}\nUtilisez 'roles' pour voir les options disponibles.`;
        }
        return `Prérequis pour ${role.title}:\n${role.requirements.map(req => `- ${req}`).join('\n')}`;
      }
    },
    {
      command: 'unlock',
      description: 'Déverrouiller des rôles cachés',
      action: (args: string[]) => {
        const code = args.join(' ');
        if (code === 'BLKKT-AGENT') {
          activateEasterEgg('secretAgent');
          return `Code accepté. Rôle secret débloqué: AGENT CRYPTIQUE`;
        }
        return `Code invalide. Accès refusé.`;
      }
    }
  ];
  
  return (
    <Layout>
      <NextSeo title="Recrutement" />
      
      <TVBlackout initialDelay={1000} frequency={0.05} />
      
      <div className="circuit-bg py-20 pt-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 font-display text-4xl text-blakkout-primary">RECRUTEMENT</h1>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
            <p className="mt-4 font-mono text-blakkout-foreground">
              Rejoignez le collectif @blakkout_mars et participez à la création d'expériences immersives.
            </p>
          </motion.div>
          
          {/* Bouton pour basculer entre formulaire et terminal */}
          <div className="mb-8 text-center">
            <button 
              onClick={() => setTerminalMode(!terminalMode)}
              className="hacker-button"
            >
              {terminalMode ? 'MODE FORMULAIRE' : 'MODE TERMINAL'}
            </button>
          </div>
          
          {terminalMode ? (
            <div className="mx-auto max-w-3xl">
              <TerminalInput 
                initialMessage="Bienvenue dans l'interface de recrutement @blakkout_mars.\nUtilisez les commandes suivantes:\n- roles: Afficher les rôles disponibles\n- apply [role_id]: Postuler à un rôle spécifique\n- requirements [role_id]: Voir les prérequis d'un rôle\n- unlock [code]: Déverrouiller des rôles cachés"
                availableCommands={availableCommands}
              />
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">
              {!selectedRole ? (
                <motion.div 
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {visibleRoles.map((role, index) => (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="cursor-pointer rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm transition-all hover:border-blakkout-accent hover:shadow-glow"
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <h3 className="mb-2 font-display text-xl text-blakkout-primary">{role.title}</h3>
                      <p className="mb-4 font-mono text-sm text-blakkout-foreground">{role.description}</p>
                      <ul className="space-y-1">
                        {role.requirements.map((req, i) => (
                          <li key={i} className="font-mono text-xs text-blakkout-foreground/70">• {req}</li>
                        ))}
                      </ul>
                      <div className="mt-4 text-right">
                        <span className="cryptic-link">POSTULER</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl text-blakkout-primary">
                      {availableRoles.find(r => r.id === selectedRole)?.title}
                    </h2>
                    <button 
                      onClick={() => setSelectedRole(null)}
                      className="font-mono text-sm text-blakkout-foreground hover:text-blakkout-primary"
                    >
                      RETOUR
                    </button>
                  </div>
                  
                  {isSuccess ? (
                    <motion.div 
                      className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 text-center backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4 text-4xl text-blakkout-primary">✓</div>
                      <h3 className="mb-2 font-display text-xl text-blakkout-primary">CANDIDATURE ENVOYÉE</h3>
                      <p className="font-mono text-blakkout-foreground">
                        Votre candidature a été transmise à notre équipe. Nous vous contacterons prochainement.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                      <div>
                        <label htmlFor="name" className="mb-1 block font-mono text-sm text-blakkout-foreground">NOM / PSEUDONYME *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                        />
                        {errors.name && <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="mb-1 block font-mono text-sm text-blakkout-foreground">EMAIL *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                        />
                        {errors.email && <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="skills" className="mb-1 block font-mono text-sm text-blakkout-foreground">COMPÉTENCES *</label>
                        <textarea
                          id="skills"
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          rows={3}
                          className="w-full rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                          placeholder="Listez vos compétences pertinentes pour ce rôle"
                        />
                        {errors.skills && <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.skills}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="motivation" className="mb-1 block font-mono text-sm text-blakkout-foreground">MOTIVATION *</label>
                        <textarea
                          id="motivation"
                          name="motivation"
                          value={formData.motivation}
                          onChange={handleChange}
                          rows={5}
                          className="w-full rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                          placeholder="Expliquez pourquoi vous souhaitez rejoindre @blakkout_mars"
                        />
                        {errors.motivation && <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.motivation}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="portfolio" className="mb-1 block font-mono text-sm text-blakkout-foreground">PORTFOLIO / LIENS</label>
                        <input
                          type="url"
                          id="portfolio"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          className="w-full rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                          placeholder="https://votre-portfolio.com"
                        />
                        {errors.portfolio && <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.portfolio}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="secretCode" className="mb-1 block font-mono text-sm text-blakkout-foreground">CODE SECRET (optionnel)</label>
                        <input
                          type="text"
                          id="secretCode"
                          name="secretCode"
                          value={formData.secretCode}
                          onChange={handleChange}
                          className="w-full rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                          placeholder="Entrez un code secret si vous en possédez un"
                        />
                      </div>
                      
                      <div className="pt-4 text-right">
                        <button 
                          type="submit" 
                          className="hacker-button"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER CANDIDATURE'}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}