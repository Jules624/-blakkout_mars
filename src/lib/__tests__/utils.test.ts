import {
  cn,
  randomDelay,
  generateCrypticText,
  decryptEffect,
  formatCrypticDate,
  checkEasterEgg,
  activateEasterEggByName,
  triggerSpecialEasterEgg,
  encryptMessage,
  decryptMessage
} from '../utils';

// Mock clsx for testing
jest.mock('clsx', () => ({
  clsx: jest.fn((...args) => args.filter(Boolean).join(' '))
}));
jest.mock('tailwind-merge', () => ({
  twMerge: jest.fn((str) => str)
}));

// Mock timers for delay functions
jest.useFakeTimers();

describe('Utils Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('cn (className utility)', () => {
    it('should return a string', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(typeof result).toBe('string');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden');
      expect(typeof result).toBe('string');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid');
      expect(typeof result).toBe('string');
    });

    it('should handle empty strings', () => {
      const result = cn('', 'valid', '');
      expect(typeof result).toBe('string');
    });

    it('should handle arrays and objects', () => {
      const result = cn(['class1', 'class2'], { active: true, disabled: false });
      expect(typeof result).toBe('string');
    });
  });

  describe('randomDelay', () => {
    it('should return a number within the specified range', () => {
      const min = 100;
      const max = 500;
      const result = randomDelay(min, max);
      
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('should handle equal min and max values', () => {
      const value = 250;
      const result = randomDelay(value, value);
      
      expect(result).toBe(value);
    });

    it('should handle zero values', () => {
      const result = randomDelay(0, 0);
      expect(result).toBe(0);
    });

    it('should handle negative values', () => {
      const result = randomDelay(-100, -50);
      expect(result).toBeGreaterThanOrEqual(-100);
      expect(result).toBeLessThanOrEqual(-50);
    });

    it('should swap min and max if min > max', () => {
      const result = randomDelay(500, 100);
      expect(result).toBeGreaterThanOrEqual(100);
      expect(result).toBeLessThanOrEqual(500);
    });
  });

  describe('generateCrypticText', () => {
    it('should generate text of specified length', () => {
      const length = 10;
      const result = generateCrypticText(length);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBe(length);
    });

    it('should generate different text on multiple calls', () => {
      const result1 = generateCrypticText(20);
      const result2 = generateCrypticText(20);
      
      expect(result1).not.toBe(result2);
    });

    it('should handle zero length', () => {
      const result = generateCrypticText(0);
      expect(result).toBe('');
    });

    it('should handle large lengths', () => {
      const length = 1000;
      const result = generateCrypticText(length);
      
      expect(result.length).toBe(length);
    });

    it('should contain only valid characters', () => {
      const result = generateCrypticText(100);
      const validChars = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?~`\s]*$/;
      
      expect(validChars.test(result)).toBe(true);
    });
  });

  describe('decryptEffect', () => {
    it('should work with DOM element', () => {
      const element = document.createElement('div');
      const finalText = 'Hello World';
      
      expect(() => {
        decryptEffect(element, finalText, 100);
      }).not.toThrow();
    });

    it('should handle empty strings', () => {
      const element = document.createElement('div');
      
      expect(() => {
        decryptEffect(element, '', 10);
      }).not.toThrow();
    });

    it('should handle special characters', () => {
      const element = document.createElement('div');
      const specialText = '!@#$%^&*()';
      
      expect(() => {
        decryptEffect(element, specialText, 10);
      }).not.toThrow();
    });
  });

  describe('formatCrypticDate', () => {
    it('should format date in cryptic format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatCrypticDate(date);
      
      expect(typeof result).toBe('string');
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });

    it('should handle current date when no date provided', () => {
      const result = formatCrypticDate(new Date());
      
      expect(typeof result).toBe('string');
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });

    it('should format different dates consistently', () => {
      const date1 = new Date('2023-12-25T00:00:00Z');
      const date2 = new Date('2024-06-15T12:00:00Z');
      
      const result1 = formatCrypticDate(date1);
      const result2 = formatCrypticDate(date2);
      
      expect(result1).toMatch(/25\.12\.2023/);
      expect(result2).toMatch(/15\.06\.2024/);
    });

    it('should handle edge case dates', () => {
      const edgeDate = new Date(0); // Unix epoch
      const result = formatCrypticDate(edgeDate);
      
      expect(result).toMatch(/01\.01\.1970/);
    });
  });

  describe('checkEasterEgg', () => {
    it('should return easter egg name for valid codes', () => {
      const easterEggs = { konami: false, consoleAccess: false, glitch: false };
      const konamiCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
      
      const result = checkEasterEgg(konamiCode, easterEggs);
      expect(result).toBe('konami');
    });

    it('should return null for invalid codes', () => {
      const easterEggs = { konami: false, consoleAccess: false, glitch: false };
      const result = checkEasterEgg('invalidCode', easterEggs);
      expect(result).toBe(null);
    });

    it('should return null for empty string', () => {
      const easterEggs = { konami: false, consoleAccess: false, glitch: false };
      const result = checkEasterEgg('', easterEggs);
      expect(result).toBe(null);
    });

    it('should return null for already activated easter eggs', () => {
      const easterEggs = { konami: true, consoleAccess: false, glitch: false };
      const konamiCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
      
      const result = checkEasterEgg(konamiCode, easterEggs);
      expect(result).toBe(null);
    });
  });

  describe('activateEasterEggByName', () => {
    it('should return easter egg name for valid names', () => {
      const easterEggs = { konami: false, consoleAccess: false, glitch: false };
      
      const result = activateEasterEggByName('konami', easterEggs);
      expect(result).toBe('konami');
    });

    it('should return null for invalid easter egg names', () => {
      const easterEggs = { konami: false, consoleAccess: false, glitch: false };
      const result = activateEasterEggByName('invalid', easterEggs);
      expect(result).toBe(null);
    });

    it('should return null for empty string', () => {
      const easterEggs = { konami: false, consoleAccess: false, glitch: false };
      const result = activateEasterEggByName('', easterEggs);
      expect(result).toBe(null);
    });

    it('should return null for already activated easter eggs', () => {
      const easterEggs = { konami: true, consoleAccess: false, glitch: false };
      const result = activateEasterEggByName('konami', easterEggs);
      expect(result).toBe(null);
    });
  });

  describe('triggerSpecialEasterEgg', () => {
    it('should return correct easter egg for valid types', () => {
      const result1 = triggerSpecialEasterEgg('konami_sequence');
      expect(result1).toBe('konami');
      
      const result2 = triggerSpecialEasterEgg('console_hack');
      expect(result2).toBe('consoleAccess');
    });

    it('should return null for invalid types', () => {
      const result = triggerSpecialEasterEgg('invalid_type');
      expect(result).toBe(null);
    });

    it('should handle empty string', () => {
      const result = triggerSpecialEasterEgg('');
      expect(result).toBe(null);
    });
  });

  describe('encryptMessage', () => {
    it('should encrypt simple messages', () => {
      const message = 'Hello World';
      const result = encryptMessage(message);
      
      expect(typeof result).toBe('string');
      expect(result).not.toBe(message);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty strings', () => {
      const result = encryptMessage('');
      expect(typeof result).toBe('string');
    });

    it('should handle special characters', () => {
      const message = '!@#$%^&*()';
      const result = encryptMessage(message);
      
      expect(typeof result).toBe('string');
      expect(result).toBe(message); // Special characters remain unchanged
    });

    it('should handle unicode characters', () => {
      const message = 'Hello 世界 🌍';
      const result = encryptMessage(message);
      
      expect(typeof result).toBe('string');
      expect(result).not.toBe(message);
    });

    it('should produce different results for different inputs', () => {
      const message1 = 'Hello';
      const message2 = 'World';
      
      const result1 = encryptMessage(message1);
      const result2 = encryptMessage(message2);
      
      expect(result1).not.toBe(result2);
    });
  });

  describe('decryptMessage', () => {
    it('should decrypt messages encrypted by encryptMessage', () => {
      const originalMessage = 'Hello World';
      const encrypted = encryptMessage(originalMessage);
      const decrypted = decryptMessage(encrypted);
      
      expect(decrypted).toBe(originalMessage);
    });

    it('should handle empty encrypted strings', () => {
      const encrypted = encryptMessage('');
      const result = decryptMessage(encrypted);
      
      expect(result).toBe('');
    });

    it('should handle special characters', () => {
      const originalMessage = '!@#$%^&*()';
      const encrypted = encryptMessage(originalMessage);
      const decrypted = decryptMessage(encrypted);
      
      expect(decrypted).toBe(originalMessage);
    });

    it('should handle unicode characters', () => {
      const originalMessage = 'Hello 世界 🌍';
      const encrypted = encryptMessage(originalMessage);
      const decrypted = decryptMessage(encrypted);
      
      expect(decrypted).toBe(originalMessage);
    });

    it('should handle invalid encrypted data gracefully', () => {
      const invalidData = 'not-encrypted-data';
      expect(() => decryptMessage(invalidData)).not.toThrow();
    });
  });

  describe('Encryption/Decryption Round Trip', () => {
    it('should maintain data integrity through multiple encrypt/decrypt cycles', () => {
      const originalMessage = 'Test message for round trip';
      let current = originalMessage;
      
      // Encrypt and decrypt multiple times
      for (let i = 0; i < 5; i++) {
        const encrypted = encryptMessage(current);
        current = decryptMessage(encrypted);
      }
      
      expect(current).toBe(originalMessage);
    });

    it('should handle long messages', () => {
      const longMessage = 'A'.repeat(1000);
      const encrypted = encryptMessage(longMessage);
      const decrypted = decryptMessage(encrypted);
      
      expect(decrypted).toBe(longMessage);
    });

    it('should handle messages with newlines and tabs', () => {
      const messageWithWhitespace = 'Line 1\nLine 2\tTabbed';
      const encrypted = encryptMessage(messageWithWhitespace);
      const decrypted = decryptMessage(encrypted);
      
      expect(decrypted).toBe(messageWithWhitespace);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large text generation efficiently', () => {
      const startTime = Date.now();
      const largeText = generateCrypticText(10000);
      const endTime = Date.now();
      
      expect(largeText.length).toBe(10000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle multiple rapid function calls', () => {
      const startTime = Date.now();
      const easterEggs = { konami: false, consoleAccess: false, glitch: false };
      
      for (let i = 0; i < 100; i++) {
        generateCrypticText(50);
        formatCrypticDate(new Date());
        checkEasterEgg('konami', easterEggs);
      }
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle extremely large numbers in randomDelay', () => {
      const result = randomDelay(Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER);
      expect(typeof result).toBe('number');
      expect(isFinite(result)).toBe(true);
    });

    it('should handle past dates in formatCrypticDate', () => {
      const oldDate = new Date('1900-01-01');
      const result = formatCrypticDate(oldDate);
      expect(result).toMatch(/01\.01\.1900/);
    });

    it('should handle future dates in formatCrypticDate', () => {
      const futureDate = new Date('2100-12-31');
      const result = formatCrypticDate(futureDate);
      expect(result).toMatch(/31\.12\.2100/);
    });
  });
});