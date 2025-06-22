import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EasterEggProvider, useEasterEggs } from '../EasterEggContext';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock utils
jest.mock('../../lib/utils', () => ({
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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Test component that uses the context
const TestComponent = () => {
  const { 
    easterEggs, 
    activateEasterEgg, 
    resetEasterEggs, 
    testNotification
  } = useEasterEggs();

  return (
    <div>
      <div data-testid="konami-status">
        {easterEggs.konami ? 'active' : 'inactive'}
      </div>
      <div data-testid="console-status">
        {easterEggs.consoleAccess ? 'active' : 'inactive'}
      </div>
      <div data-testid="glitch-status">
        {easterEggs.glitch ? 'active' : 'inactive'}
      </div>
      <button 
        data-testid="activate-konami" 
        onClick={() => activateEasterEgg('konami')}
      >
        Activate Konami
      </button>
      <button 
        data-testid="activate-console" 
        onClick={() => activateEasterEgg('consoleAccess')}
      >
        Activate Console
      </button>
      <button 
        data-testid="activate-glitch" 
        onClick={() => activateEasterEgg('glitch')}
      >
        Activate Glitch
      </button>
      <button 
        data-testid="reset-eggs" 
        onClick={resetEasterEggs}
      >
        Reset
      </button>
      <button 
        data-testid="test-notification" 
        onClick={testNotification}
      >
        Test Notification
      </button>
    </div>
  );
};

describe('EasterEggContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should provide initial state correctly', () => {
    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    expect(screen.getByTestId('konami-status')).toHaveTextContent('inactive');
    expect(screen.getByTestId('console-status')).toHaveTextContent('inactive');
    expect(screen.getByTestId('glitch-status')).toHaveTextContent('inactive');
  });

  it('should activate konami easter egg', () => {
    const { checkEasterEgg } = require('../../lib/utils');
    checkEasterEgg.mockReturnValue('konami');

    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    act(() => {
      screen.getByTestId('activate-konami').click();
    });

    expect(screen.getByTestId('konami-status')).toHaveTextContent('active');
    expect(toast.success).toHaveBeenCalled();
  });

  it('should activate consoleAccess easter egg', () => {
    const { checkEasterEgg } = require('../../lib/utils');
    checkEasterEgg.mockReturnValue('consoleAccess');

    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    act(() => {
      screen.getByTestId('activate-console').click();
    });

    expect(screen.getByTestId('console-status')).toHaveTextContent('active');
    expect(toast.success).toHaveBeenCalled();
  });

  it('should activate glitch easter egg', () => {
    const { checkEasterEgg } = require('../../lib/utils');
    checkEasterEgg.mockReturnValue('glitch');

    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    act(() => {
      screen.getByTestId('activate-glitch').click();
    });

    expect(screen.getByTestId('glitch-status')).toHaveTextContent('active');
    expect(toast.success).toHaveBeenCalled();
  });

  it('should reset all easter eggs', () => {
    const { checkEasterEgg } = require('../../lib/utils');
    checkEasterEgg.mockReturnValueOnce('konami').mockReturnValueOnce('consoleAccess');

    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    // Activate some easter eggs first
    act(() => {
      screen.getByTestId('activate-konami').click();
      screen.getByTestId('activate-console').click();
    });

    expect(screen.getByTestId('konami-status')).toHaveTextContent('active');
    expect(screen.getByTestId('console-status')).toHaveTextContent('active');

    // Reset
    act(() => {
      screen.getByTestId('reset-eggs').click();
    });

    expect(screen.getByTestId('konami-status')).toHaveTextContent('inactive');
    expect(screen.getByTestId('console-status')).toHaveTextContent('inactive');
    expect(screen.getByTestId('glitch-status')).toHaveTextContent('inactive');
    expect(toast.success).toHaveBeenCalled();
  });

  it('should trigger test notification', () => {
    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    act(() => {
      screen.getByTestId('test-notification').click();
    });

    expect(toast.success).toHaveBeenCalled();
  });

  it('should load saved easter eggs from localStorage', () => {
    const savedEggs = JSON.stringify({
      konami: true,
      consoleAccess: false,
      glitch: true
    });
    localStorageMock.getItem.mockReturnValue(savedEggs);

    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    expect(localStorageMock.getItem).toHaveBeenCalledWith('blakkout_easter_eggs');
    expect(screen.getByTestId('konami-status')).toHaveTextContent('active');
    expect(screen.getByTestId('console-status')).toHaveTextContent('inactive');
    expect(screen.getByTestId('glitch-status')).toHaveTextContent('active');
  });

  it('should save easter eggs to localStorage when activated', () => {
    const { checkEasterEgg } = require('../../lib/utils');
    checkEasterEgg.mockReturnValue('konami');

    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    act(() => {
      screen.getByTestId('activate-konami').click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'blakkout_easter_eggs',
      expect.stringContaining('"konami":true')
    );
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    render(
      <EasterEggProvider>
        <TestComponent />
      </EasterEggProvider>
    );

    // Should render with default state despite invalid localStorage
    expect(screen.getByTestId('konami-status')).toHaveTextContent('inactive');
    expect(screen.getByTestId('console-status')).toHaveTextContent('inactive');
    expect(screen.getByTestId('glitch-status')).toHaveTextContent('inactive');
  });

  it('should render provider without crashing', () => {
    const { container } = render(
      <EasterEggProvider>
        <div>Test content</div>
      </EasterEggProvider>
    );

    expect(container).toBeInTheDocument();
  });
});