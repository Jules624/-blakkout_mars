import { z } from 'zod';

/**
 * Schema to validate contact form data.
 * Ensures all required fields meet minimum validation requirements.
 */
export const contactSchema = z.object({
  // Name must be a string with at least 2 characters
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  
  // Email must be a valid email format
  email: z.string().email({ message: 'Adresse email invalide' }),
  
  // Subject must be a string with at least 5 characters
  subject: z.string().min(5, { message: 'Le sujet doit contenir au moins 5 caractères' }),
  
  // Message must be a string with at least 10 characters
  message: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères' }),
});

/**
 * Schema to validate recruitment application form data.
 * Ensures all required fields meet minimum validation requirements.
 */
export const applicationSchema = z.object({
  // Name must be a string with at least 2 characters
  name: z.string().min(2, { message: 'Nom requis (min. 2 caractères)' }),
  
  // Email must be a valid email format
  email: z.string().email({ message: 'Email invalide' }),
  
  // Skills must be a string with at least 3 characters
  skills: z.string().min(3, { message: 'Compétences requises' }),
  
  // Motivation must be a string with at least 10 characters
  motivation: z.string().min(10, { message: 'Motivation requise (min. 10 caractères)' }),
  
  // Portfolio URL is optional but must be valid if provided
  portfolio: z.string().url({ message: 'URL invalide' }).optional().or(z.literal('')),
  
  // Secret code is optional
  secretCode: z.string().optional(),
});

/**
 * TypeScript types inferred from the Zod schemas
 */
export type ContactFormData = z.infer<typeof contactSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;