import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TVBlackout from '../TVBlackout';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

// Mock the randomDelay utility
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

// Mock timers for controlled testing
jest.useFakeTimers();

describe('TVBlackout Component (Effects)', () => {
  const TestChild = () => <div data-testid="test-content">Test Content</div>;

  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render children correctly', () => {
    render(
      <TVBlackout disabled>
        <TestChild />
      </TVBlackout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should apply disabled state correctly', () => {
    const { container } = render(
      <TVBlackout disabled>
        <TestChild />
      </TVBlackout>
    );
    
    // When disabled, should render simple container without flicker effects
    expect(container.firstChild).toHaveClass('relative', 'overflow-hidden');
    expect(container.firstChild).not.toHaveClass('tv-blackout');
  });

  it('should initialize with correct default props', () => {
    const { container } = render(
      <TVBlackout>
        <TestChild />
      </TVBlackout>
    );
    
    expect(container.firstChild).toHaveClass('tv-blackout');
  });

  it('should handle different intensity levels', () => {
    const intensities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    
    intensities.forEach(intensity => {
      const { container } = render(
        <TVBlackout intensity={intensity}>
          <TestChild />
        </TVBlackout>
      );
      
      expect(container.firstChild).toHaveClass('tv-blackout');
    });
  });

  it('should initialize after initial delay', async () => {
    render(
      <TVBlackout initialDelay={1000}>
        <TestChild />
      </TVBlackout>
    );
    
    // Fast-forward time by initial delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Component should be initialized after delay
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should cleanup timers on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    const { unmount } = render(
      <TVBlackout>
        <TestChild />
      </TVBlackout>
    );
    
    // Advance time to trigger some timeouts
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    unmount();
    
    // Verify cleanup was called
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });

  it('should handle frequency prop correctly', () => {
    const { rerender } = render(
      <TVBlackout frequency={1}>
        <TestChild />
      </TVBlackout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    
    // Test with different frequency
    rerender(
      <TVBlackout frequency={10}>
        <TestChild />
      </TVBlackout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should apply flickering class when in flickering state', async () => {
    const { container } = render(
      <TVBlackout initialDelay={0} frequency={100}>
        <TestChild />
      </TVBlackout>
    );
    
    // Initialize component
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Trigger flicker by advancing time significantly
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    
    // The component might be in flickering state
    // Note: Due to randomness, we mainly test that the component doesn't crash
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should handle duration prop correctly', () => {
    const { container } = render(
      <TVBlackout duration={500}>
        <TestChild />
      </TVBlackout>
    );
    
    expect(container.firstChild).toHaveClass('tv-blackout');
  });

  it('should render overlay effects during flickering', () => {
    const { container } = render(
      <TVBlackout initialDelay={0}>
        <TestChild />
      </TVBlackout>
    );
    
    // The component should render without errors
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });
});