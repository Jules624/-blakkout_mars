import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour générer un délai aléatoire (utilisé pour les effets de glitch)
export function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Fonction pour générer un texte cryptique
export function generateCrypticText(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Fonction pour simuler un effet de déchiffrement progressif
export function decryptEffect(
  element: HTMLElement, 
  finalText: string, 
  duration: number = 1000,
  callback?: () => void
): void {
  const originalText = finalText;
  const steps = 20;
  const stepDuration = duration / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep >= steps) {
      element.textContent = originalText;
      clearInterval(interval);
      if (callback) callback();
      return;
    }

    let decryptedText = '';
    const progress = currentStep / steps;

    for (let i = 0; i < originalText.length; i++) {
      // Plus on avance dans les étapes, plus on révèle de caractères originaux
      if (Math.random() < progress) {
        decryptedText += originalText[i];
      } else {
        // Sinon on met un caractère aléatoire
        decryptedText += generateCrypticText(1);
      }
    }

    element.textContent = decryptedText;
    currentStep++;
  }, stepDuration);
}

// Fonction pour formater une date en style cryptique
export function formatCrypticDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}.${month}.${year} | ${hours}:${minutes} | UTC+2`;
}

// Fonction pour vérifier si un easter egg a été trouvé
export function checkEasterEgg(code: string, easterEggs: Record<string, boolean>): string | null {
  // Liste des easter eggs disponibles avec leurs codes
  const easterEggCodes: Record<string, string> = {
    'konami': 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba',
    'terminal': 'sudo access --grant',
    'glitch': 'ctrl+alt+glitch',
    'hidden': 'find_the_truth',
    'matrix': 'follow_the_white_rabbit',
  };

  // Vérifier si le code correspond à un easter egg
  for (const [key, value] of Object.entries(easterEggCodes)) {
    if (code.includes(value) && !easterEggs[key]) {
      return key;
    }
  }

  return null;
}

// Fonction pour chiffrer un message simple (pour l'effet visuel uniquement, pas de sécurité réelle)
export function encryptMessage(message: string, key: number = 3): string {
  return message
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      // Lettres majuscules (A-Z)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + key) % 26) + 65);
      }
      // Lettres minuscules (a-z)
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + key) % 26) + 97);
      }
      // Autres caractères restent inchangés
      return char;
    })
    .join('');
}

// Fonction pour déchiffrer un message simple
export function decryptMessage(message: string, key: number = 3): string {
  return encryptMessage(message, 26 - key);
}