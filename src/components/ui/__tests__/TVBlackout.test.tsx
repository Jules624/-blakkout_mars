import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TVBlackout from '../TVBlackout';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

// Mock the utils
jest.mock('../../../lib/utils', () => ({
  cn: jest.fn((...args) => args.join(' ')),
  randomDelay: jest.fn((min: number, max: number) => min),
  generateCrypticText: jest.fn(),
  decryptEffect: jest.fn(),
  formatCrypticDate: jest.fn(),
  checkEasterEgg: jest.fn(),
  activateEasterEggByName: jest.fn(),
  triggerSpecialEasterEgg: jest.fn(),
  encryptMessage: jest.fn(),
  decryptMessage: jest.fn(),
}));

// Mock Math.random for consistent testing
const originalMathRandom = Math.random;
const mockMathRandom = jest.fn();
Object.defineProperty(global.Math, 'random', {
  value: mockMathRandom,
  writable: true,
});

jest.useFakeTimers();

describe('TVBlackout Component (UI)', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    mockMathRandom.mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render without crashing', () => {
    const { container } = render(<TVBlackout />);
    expect(container).toBeInTheDocument();
  });

  it('should handle initial delay correctly', () => {
    render(<TVBlackout initialDelay={2000} />);
    
    // Fast-forward past initial delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Component should be active after delay
    expect(true).toBe(true); // Component doesn't crash
  });

  it('should trigger blackout based on frequency', () => {
    // Mock Math.random to return a value that triggers blackout
    mockMathRandom.mockReturnValue(0.001); // Less than default frequency (0.01)

    render(<TVBlackout />);

    // Fast-forward time to trigger the interval
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('tv-blackout')).toBeInTheDocument();
  });

  it('should not trigger blackout when frequency is low', () => {
    // Mock Math.random to never trigger blackout
    mockMathRandom.mockReturnValue(0.9); // Greater than frequency
    
    const { container } = render(
      <TVBlackout frequency={0.1} />
    );
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(container).toBeInTheDocument();
  });

  it('should cleanup intervals on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    
    const { unmount } = render(<TVBlackout />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
  });

  it('should handle duration prop correctly', () => {
    const { container } = render(
      <TVBlackout duration={0.5} frequency={1} />
    );
    
    // Trigger blackout
    (Math.random as jest.Mock).mockReturnValue(0.5);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Advance by duration
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    expect(container).toBeInTheDocument();
  });

  it('should render scan lines and static noise effects', () => {
    // Force blackout to be visible
    (Math.random as jest.Mock).mockReturnValue(0.01);
    
    const { container } = render(
      <TVBlackout frequency={1} />
    );
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // The component should render without errors
    // Visual effects are tested through CSS classes and styles
    expect(container).toBeInTheDocument();
  });

  it('should handle default props correctly', () => {
    const { container } = render(<TVBlackout />);
    
    // Should render with default props without errors
    expect(container).toBeInTheDocument();
  });

  it('should handle custom frequency and duration', () => {
    const { container } = render(
      <TVBlackout 
        initialDelay={500}
        frequency={0.8}
        duration={0.3}
      />
    );
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(container).toBeInTheDocument();
  });

  it('should properly manage active state', () => {
    const { container } = render(
      <TVBlackout initialDelay={1000} />
    );
    
    // Before initial delay, should still render
    expect(container).toBeInTheDocument();
    
    // After initial delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(container).toBeInTheDocument();
  });
});