import React, { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { z } from 'zod';
import toast from 'react-hot-toast';

import Layout from '@/components/layout/Layout';
import TerminalInput from '@/components/ui/TerminalInput';
import { encryptMessage, decryptMessage } from '@/lib/utils';

// Schéma de validation pour le formulaire
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Adresse email invalide' }),
  subject: z.string().min(5, { message: 'Le sujet doit contenir au moins 5 caractères' }),
  message: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [encryptedPreview, setEncryptedPreview] = useState('');

  // Mettre à jour l'aperçu chiffré lorsque le message change
  useEffect(() => {
    if (formData.message) {
      setEncryptedPreview(encryptMessage(formData.message));
    } else {
      setEncryptedPreview('');
    }
  }, [formData.message]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur pour ce champ s'il y en a une
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    try {
      contactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler un envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      setIsSuccess(true);
      toast.success('Message envoyé avec succès!');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Commandes pour le terminal
  const terminalCommands = [
    {
      command: 'contact',
      description: 'Affiche les informations de contact',
      action: () => (
        <div className="space-y-2">
          <p>Email: <span className="text-blakkout-primary">contact@blakkout-mars.fr</span></p>
          <p>Instagram: <span className="text-blakkout-primary">@blakkout_mars</span></p>
        </div>
      ),
    },
    {
      command: 'encrypt',
      description: 'Chiffre un message',
      action: (args: string[]) => {
        if (args.length === 0) return 'Erreur: Spécifiez un message à chiffrer';
        const message = args.join(' ');
        return `Message chiffré: ${encryptMessage(message)}`;
      },
    },
    {
      command: 'decrypt',
      description: 'Déchiffre un message',
      action: (args: string[]) => {
        if (args.length === 0) return 'Erreur: Spécifiez un message à déchiffrer';
        const message = args.join(' ');
        return `Message déchiffré: ${decryptMessage(message)}`;
      },
    },
  ];

  return (
    <Layout>
      <NextSeo title="Contact" />
      
      <div className="circuit-bg py-20 pt-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 font-display text-4xl text-blakkout-primary">CONTACT</h1>
            <div className="mx-auto h-1 w-24 bg-blakkout-primary"></div>
            <p className="mt-4 font-mono text-blakkout-foreground">
              Envoyez-nous un message chiffré. Nous vous répondrons dans les plus brefs délais.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                <h2 className="mb-6 font-display text-2xl text-blakkout-accent">FORMULAIRE SÉCURISÉ</h2>
                
                {isSuccess ? (
                  <div className="text-center">
                    <div className="mb-4 text-blakkout-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h3 className="mb-2 font-display text-xl text-blakkout-primary">MESSAGE ENVOYÉ</h3>
                    <p className="mb-6 font-mono text-blakkout-foreground">
                      Votre message a été chiffré et envoyé avec succès. Nous vous répondrons dès que possible.
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="hacker-button"
                    >
                      NOUVEAU MESSAGE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="mb-1 block font-mono text-sm text-blakkout-foreground">
                        NOM *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full rounded-md border bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none ${errors.name ? 'border-blakkout-error' : 'border-blakkout-primary/30'}`}
                      />
                      {errors.name && (
                        <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="mb-1 block font-mono text-sm text-blakkout-foreground">
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-md border bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none ${errors.email ? 'border-blakkout-error' : 'border-blakkout-primary/30'}`}
                      />
                      {errors.email && (
                        <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="subject" className="mb-1 block font-mono text-sm text-blakkout-foreground">
                        SUJET *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full rounded-md border bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none ${errors.subject ? 'border-blakkout-error' : 'border-blakkout-primary/30'}`}
                      />
                      {errors.subject && (
                        <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.subject}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="mb-1 block font-mono text-sm text-blakkout-foreground">
                        MESSAGE *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full rounded-md border bg-blakkout-muted p-2 font-mono text-blakkout-foreground focus:border-blakkout-primary focus:outline-none ${errors.message ? 'border-blakkout-error' : 'border-blakkout-primary/30'}`}
                      />
                      {errors.message && (
                        <p className="mt-1 font-mono text-xs text-blakkout-error">{errors.message}</p>
                      )}
                    </div>
                    
                    {encryptedPreview && (
                      <div className="mb-6 rounded-md border border-blakkout-primary/30 bg-blakkout-muted p-3">
                        <p className="mb-1 font-mono text-xs text-blakkout-foreground/70">APERÇU CHIFFRÉ:</p>
                        <p className="font-mono text-sm text-blakkout-primary">{encryptedPreview}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="hacker-button"
                      >
                        {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER MESSAGE'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
            
            {/* Terminal et informations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mb-6 rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                <h2 className="mb-6 font-display text-2xl text-blakkout-accent">INFORMATIONS</h2>
                
                <div className="space-y-4 font-mono">
                  <div className="flex items-start">
                    <div className="mr-3 text-blakkout-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blakkout-foreground/70">EMAIL</p>
                      <p className="text-blakkout-primary">contact@blakkout-mars.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 text-blakkout-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blakkout-foreground/70">INSTAGRAM</p>
                      <p className="text-blakkout-primary">@blakkout_mars</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 text-blakkout-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-blakkout-foreground/70">LOCALISATION</p>
                      <p className="text-blakkout-primary">Marseille, France</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border border-blakkout-primary bg-blakkout-background/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-2xl text-blakkout-accent">TERMINAL</h2>
                  <button 
                    onClick={() => setShowTerminal(!showTerminal)}
                    className="hacker-button text-sm"
                  >
                    {showTerminal ? 'FERMER' : 'OUVRIR'}
                  </button>
                </div>
                
                {showTerminal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TerminalInput 
                      availableCommands={terminalCommands}
                      initialMessage="Terminal de contact @blakkout_mars. Tapez 'contact' pour afficher les informations de contact ou 'help' pour voir toutes les commandes disponibles."
                    />
                  </motion.div>
                )}
                
                {!showTerminal && (
                  <p className="font-mono text-sm text-blakkout-foreground/70">
                    Utilisez le terminal pour accéder à des fonctionnalités supplémentaires comme le chiffrement et déchiffrement de messages.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}