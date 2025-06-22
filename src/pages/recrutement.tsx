import React, { useState } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import TVBlackout from '@/components/effects/TVBlackout';
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
      console.log('Code secret détecté:', value);
      activateEasterEgg('activate_consoleAccess');
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
      
      // Déclencher une récompense pour la soumission du formulaire
      if (selectedRole) {
        // Activer un easter egg spécial pour le recrutement
        activateEasterEgg('activate_hidden');
        
        // Notification de succès personnalisée selon le rôle
        const roleMessages: Record<string, string> = {
          'dj': '🎵 Candidature DJ reçue! Préparez vos meilleurs sets...',
          'vj': '🎨 Candidature VJ reçue! Vos visuels vont illuminer nos événements...',
          'dev': '💻 Candidature Dev reçue! Prêt à coder l\'avenir de @blakkout_mars?',
          'comm': '📱 Candidature Communication reçue! Ensemble, nous allons faire du bruit...',
          'secret': '🕵️ Agent Cryptique détecté... Transmission sécurisée initiée...'
        };
        
        const message = roleMessages[selectedRole] || '✅ Candidature reçue avec succès!';
      }
      
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

  return (
    <Layout>
      <NextSeo title="Recrutement" />
      
      <TVBlackout initialDelay={1000} frequency={0.05}>
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
                Rejoignez l'aventure @blakkout_mars et participez à la création d'expériences immersives uniques.
              </p>
            </motion.div>

            {/* Section Rôles disponibles */}
            <section className="mb-12">
              <motion.h2 
                className="mb-8 font-display text-2xl text-blakkout-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                RÔLES DISPONIBLES
              </motion.h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {visibleRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    className={`cursor-pointer rounded-md border p-6 backdrop-blur-sm transition-all duration-300 ${
                      selectedRole === role.id
                        ? 'border-blakkout-primary bg-blakkout-primary/20'
                        : 'border-blakkout-primary/50 bg-blakkout-background/50 hover:border-blakkout-primary'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <h3 className="mb-2 font-display text-lg text-blakkout-primary">{role.title}</h3>
                    <p className="mb-4 text-sm text-blakkout-foreground">{role.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="mb-2 font-mono text-xs uppercase text-blakkout-primary">Prérequis :</h4>
                      <ul className="space-y-1">
                        {role.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-xs text-blakkout-foreground">
                            • {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {role.isHidden && (
                      <div className="rounded bg-blakkout-primary/20 p-2">
                        <p className="font-mono text-xs text-blakkout-primary">🔓 Rôle secret débloqué !</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Formulaire de candidature */}
            {selectedRole && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm"
              >
                <h2 className="mb-6 font-display text-2xl text-blakkout-primary">
                  CANDIDATURE - {availableRoles.find(r => r.id === selectedRole)?.title}
                </h2>
                
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="mb-4 text-4xl">✓</div>
                    <h3 className="mb-2 font-display text-xl text-blakkout-primary">Candidature envoyée !</h3>
                    <p className="font-mono text-blakkout-foreground">
                      Nous examinerons votre candidature et vous recontacterons bientôt.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-2 block font-mono text-sm text-blakkout-primary">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded border border-blakkout-primary/50 bg-blakkout-background/50 p-3 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                          placeholder="Votre nom"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="mb-2 block font-mono text-sm text-blakkout-primary">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded border border-blakkout-primary/50 bg-blakkout-background/50 p-3 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                          placeholder="votre@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="skills" className="mb-2 block font-mono text-sm text-blakkout-primary">
                        Compétences *
                      </label>
                      <textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded border border-blakkout-primary/50 bg-blakkout-background/50 p-3 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                        placeholder="Décrivez vos compétences techniques et artistiques..."
                      />
                      {errors.skills && (
                        <p className="mt-1 text-xs text-red-400">{errors.skills}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="motivation" className="mb-2 block font-mono text-sm text-blakkout-primary">
                        Motivation *
                      </label>
                      <textarea
                        id="motivation"
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded border border-blakkout-primary/50 bg-blakkout-background/50 p-3 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                        placeholder="Pourquoi souhaitez-vous rejoindre @blakkout_mars ?"
                      />
                      {errors.motivation && (
                        <p className="mt-1 text-xs text-red-400">{errors.motivation}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="portfolio" className="mb-2 block font-mono text-sm text-blakkout-primary">
                        Portfolio (optionnel)
                      </label>
                      <input
                        type="url"
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        className="w-full rounded border border-blakkout-primary/50 bg-blakkout-background/50 p-3 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                        placeholder="https://votre-portfolio.com"
                      />
                      {errors.portfolio && (
                        <p className="mt-1 text-xs text-red-400">{errors.portfolio}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="secretCode" className="mb-2 block font-mono text-sm text-blakkout-primary">
                        Code secret (si vous en avez un)
                      </label>
                      <input
                        type="text"
                        id="secretCode"
                        name="secretCode"
                        value={formData.secretCode}
                        onChange={handleChange}
                        className="w-full rounded border border-blakkout-primary/50 bg-blakkout-background/50 p-3 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none"
                        placeholder="XXXX-XXXXX"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="hacker-button"
                      >
                        {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER CANDIDATURE'}
                      </button>
                    </div>
                  </form>
                )}
              </motion.section>
            )}
          </div>
        </div>
      </TVBlackout>
    </Layout>
  );
}