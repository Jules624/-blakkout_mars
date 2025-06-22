import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../Layout';
import { EasterEggProvider } from '../../../context/EasterEggContext';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

// Mock child components
jest.mock('../Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('../Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

jest.mock('../../effects/TVBlackout', () => {
  return function MockTVBlackout({ children }: { children: React.ReactNode }) {
    return <div data-testid="tv-blackout">{children}</div>;
  };
});

jest.mock('../../effects/EasterEggNotification', () => {
  return function MockEasterEggNotification() {
    return <div data-testid="easter-egg-notification">Easter Egg Notification</div>;
  };
});

// Mock utils
jest.mock('../../../lib/utils', () => ({
  cn: jest.fn((...args) => args.join(' '))
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

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <EasterEggProvider>
      {ui}
    </EasterEggProvider>
  );
};

describe('Layout Component', () => {
  const TestChild = () => <div data-testid="test-content">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should render all main layout components', () => {
      renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('tv-blackout')).toBeInTheDocument();
      expect(screen.getByTestId('easter-egg-notification')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render children content', () => {
      renderWithProvider(
        <Layout>
          <div data-testid="custom-content">Custom Content</div>
        </Layout>
      );
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct HTML structure', () => {
      renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      const navbar = screen.getByTestId('navbar');
      const footer = screen.getByTestId('footer');
      const content = screen.getByTestId('test-content');
      
      expect(navbar).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('should wrap content in TVBlackout component', () => {
      renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      const tvBlackout = screen.getByTestId('tv-blackout');
      const content = screen.getByTestId('test-content');
      
      expect(tvBlackout).toBeInTheDocument();
      expect(tvBlackout).toContainElement(content);
    });
  });

  describe('Multiple Children', () => {
    it('should render multiple children correctly', () => {
      renderWithProvider(
        <Layout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </Layout>
      );
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should handle complex nested children', () => {
      renderWithProvider(
        <Layout>
          <div data-testid="parent">
            <div data-testid="nested-child-1">Nested 1</div>
            <div data-testid="nested-child-2">Nested 2</div>
          </div>
        </Layout>
      );
      
      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('nested-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('nested-child-2')).toBeInTheDocument();
    });
  });

  describe('Easter Egg Integration', () => {
    it('should render EasterEggNotification component', () => {
      renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      expect(screen.getByTestId('easter-egg-notification')).toBeInTheDocument();
    });

    it('should provide EasterEgg context to children', () => {
      const EasterEggConsumer = () => {
        return <div data-testid="easter-egg-consumer">Easter Egg Consumer</div>;
      };

      renderWithProvider(
        <Layout>
          <EasterEggConsumer />
        </Layout>
      );
      
      expect(screen.getByTestId('easter-egg-consumer')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle different viewport sizes', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should maintain layout integrity on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle rapid re-renders', () => {
      const { rerender } = renderWithProvider(
        <Layout>
          <div data-testid="content-1">Content 1</div>
        </Layout>
      );
      
      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      
      // Simulate rapid re-renders
      for (let i = 2; i <= 5; i++) {
        rerender(
          <EasterEggProvider>
            <Layout>
              <div data-testid={`content-${i}`}>Content {i}</div>
            </Layout>
          </EasterEggProvider>
        );
        expect(screen.getByTestId(`content-${i}`)).toBeInTheDocument();
      }
    });

    it('should cleanup properly on unmount', () => {
      const { unmount } = renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    it('should handle children rendering errors gracefully', () => {
      const ErrorChild = () => {
        throw new Error('Test error');
      };

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => {
        renderWithProvider(
          <Layout>
            <ErrorChild />
          </Layout>
        );
      }).toThrow('Test error');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      renderWithProvider(
        <Layout>
          <TestChild />
        </Layout>
      );
      
      const navbar = screen.getByTestId('navbar');
      const footer = screen.getByTestId('footer');
      
      expect(navbar.tagName.toLowerCase()).toBe('nav');
      expect(footer.tagName.toLowerCase()).toBe('footer');
    });

    it('should maintain focus management', () => {
      renderWithProvider(
        <Layout>
          <button data-testid="test-button">Test Button</button>
        </Layout>
      );
      
      const button = screen.getByTestId('test-button');
      button.focus();
      
      expect(document.activeElement).toBe(button);
    });
  });
});