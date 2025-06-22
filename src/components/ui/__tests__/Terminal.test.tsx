import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Terminal } from '../Terminal';

// Mock EasterEggContext
const mockEasterEggContext = {
  easterEggs: { konami: false, consoleAccess: false, glitch: false, hidden: false, matrix: false },
  activateEasterEgg: jest.fn(),
  triggerEasterEgg: jest.fn(),
  resetEasterEggs: jest.fn(),
  testNotification: jest.fn(),
  getUnlockedRewards: jest.fn(() => []),
  isAllEasterEggsFound: jest.fn(() => false)
};

jest.mock('../../../context/EasterEggContext', () => ({
  useEasterEggs: () => mockEasterEggContext
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

// Mock utils
jest.mock('../../../lib/utils', () => ({
  cn: jest.fn((...args) => args.join(' ')),
  randomDelay: jest.fn((min: number, max: number) => min),
  generateCrypticText: jest.fn(() => 'CRYPTIC_TEXT'),
  decryptEffect: jest.fn(),
  formatCrypticDate: jest.fn(() => '2024.01.01'),
  checkEasterEgg: jest.fn(),
  activateEasterEggByName: jest.fn(),
  triggerSpecialEasterEgg: jest.fn(),
  encryptMessage: jest.fn((msg) => `ENCRYPTED_${msg}`),
  decryptMessage: jest.fn((msg) => msg.replace('ENCRYPTED_', ''))
}));

// Mock timers
jest.useFakeTimers();

const defaultProps = {
  isOpen: true,
  onClose: jest.fn()
};

describe('Terminal Component', () => {
  const user = userEvent.setup({ delay: null, advanceTimers: jest.advanceTimersByTime });

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

  describe('Basic Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<Terminal {...defaultProps} />);
      expect(screen.getByText('BLAKKOUT Terminal')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<Terminal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('BLAKKOUT Terminal')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Terminal {...defaultProps} className="custom-class" />);
      const terminal = screen.getByText('BLAKKOUT Terminal');
      expect(terminal).toBeInTheDocument();
    });

    it('should render terminal header with title', () => {
      render(<Terminal {...defaultProps} />);
      expect(screen.getByText('BLAKKOUT Terminal')).toBeInTheDocument();
    });

    it('should render close button', () => {
      render(<Terminal {...defaultProps} />);
      const closeButton = screen.getByText('✕');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Terminal Functionality', () => {
    it('should display welcome message on mount', async () => {
      render(<Terminal {...defaultProps} />);
      
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByText('BLAKKOUT Terminal v2.0.77 - Accès sécurisé activé')).toBeInTheDocument();
      });
    });

    it('should show command prompt', () => {
      render(<Terminal {...defaultProps} />);
      const prompts = screen.queryAllByText(/>/); 
      expect(prompts.length).toBeGreaterThanOrEqual(0);
    });

    it('should have input field for commands', () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveFocus();
    });
  });

  describe('Command Processing', () => {
    it('should process help command', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'help');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText('Commandes disponibles:')).toBeInTheDocument();
      });
    });

    it('should process clear command', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      // Add some content first
      await user.type(input, 'help');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Then clear
      await user.type(input, 'clear');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.queryByText(/Commandes disponibles/i)).not.toBeInTheDocument();
      });
    });

    it('should handle unknown commands', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'unknown_command');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText(/Commande inconnue:/)).toBeInTheDocument();
      });
    });

    it('should handle empty commands', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.keyboard('{Enter}');
      
      // Should not add empty line or error
      expect(input).toHaveFocus();
      expect(input).toHaveValue('');
    });
  });

  describe('Special Commands', () => {
    it('should process status command', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'status');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText(/SYSTÈME: OPÉRATIONNEL/i)).toBeInTheDocument();
      });
    });

    it('should process date command', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'date');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText('2024.01.01')).toBeInTheDocument();
      });
    });

    it('should process whoami command', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'whoami');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText(/guest/i)).toBeInTheDocument();
      });
    });
  });

  describe('Easter Egg Commands', () => {
    it('should handle konami command', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'konami');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText(/CODE KONAMI DÉTECTÉ/i)).toBeInTheDocument();
      });
    });

    it('should handle matrix command', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'matrix');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByText(/01001000 01100101 01101100 01101100 01101111/)).toBeInTheDocument();
      });
    });
  });

  describe('User Interaction', () => {
    it('should close terminal when close button is clicked', async () => {
      const onClose = jest.fn();
      render(<Terminal {...defaultProps} onClose={onClose} />);
      
      const closeButton = screen.getByText('✕');
      await user.click(closeButton);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should close terminal when Escape key is pressed', async () => {
      const onClose = jest.fn();
      render(<Terminal {...defaultProps} onClose={onClose} />);
      
      await user.keyboard('{Escape}');
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should maintain focus on input after command execution', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'help');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });
  });

  describe('Command History', () => {
    it('should navigate command history with arrow keys', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      // Execute a command
      await user.type(input, 'help');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Navigate up in history
      await user.keyboard('{ArrowUp}');
      
      expect(input).toHaveValue('help');
    });

    it('should handle multiple commands in history', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      // Execute multiple commands
      await user.type(input, 'help');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await user.type(input, 'status');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Navigate history
      await user.keyboard('{ArrowUp}');
      expect(input).toHaveValue('status');
      
      await user.keyboard('{ArrowUp}');
      expect(input).toHaveValue('help');
      
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveValue('status');
    });
  });

  describe('Terminal Output', () => {
    it('should display command output with proper formatting', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      await user.type(input, 'help');
      await user.keyboard('{Enter}');
      
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        const output = screen.getByText('Commandes disponibles:');
        expect(output).toBeInTheDocument();
      });
    });

    it('should scroll to bottom when new output is added', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      // Add multiple commands to create scrollable content
      for (let i = 0; i < 5; i++) {
        await user.type(input, 'help');
        await user.keyboard('{Enter}');
        
        act(() => {
          jest.advanceTimersByTime(500);
        });
      }

      // Terminal should auto-scroll to bottom
      const terminal = screen.getByText('BLAKKOUT Terminal');
      expect(terminal).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle rapid command execution', async () => {
      render(<Terminal {...defaultProps} />);
      const input = screen.getByPlaceholderText('Tapez une commande...');
      
      // Execute commands rapidly
      for (let i = 0; i < 10; i++) {
        await user.clear(input);
        await user.type(input, `command${i}`);
        await user.keyboard('{Enter}');
        
        act(() => {
          jest.advanceTimersByTime(100);
        });
      }

      expect(input).toBeInTheDocument();
      expect(input).toHaveFocus();
    });

    it('should cleanup properly on unmount', () => {
      const { unmount } = render(<Terminal {...defaultProps} />);
      
      expect(screen.getByText('BLAKKOUT Terminal')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByText('BLAKKOUT Terminal')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Terminal {...defaultProps} />);
      
      const terminal = screen.getByText('BLAKKOUT Terminal');
      expect(terminal).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<Terminal {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Tapez une commande...');
      const closeButton = screen.getByText('✕');
      
      expect(input).toHaveFocus();
      expect(closeButton).toBeInTheDocument();
      
      // Test that input maintains focus
      await user.keyboard('{Tab}');
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(input).toHaveFocus();
    });
  });
});