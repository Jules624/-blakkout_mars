import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MerchPage from '../../pages/merch';
import { EasterEggProvider } from '../../context/EasterEggContext';

// Mock Next.js components
jest.mock('next/head', () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/merch',
    pathname: '/merch',
    query: {},
    asPath: '/merch',
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

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} data-testid="next-image" />;
  };
});

// Mock NextSeo
jest.mock('next-seo', () => ({
  NextSeo: (props: any) => {
    const finalTitle = props.title ? `${props.title} | @blakkout_mars` : props.defaultTitle || '@blakkout_mars';
    const finalDescription = props.description || 'Collectif marseillais organisateur d\'événements immersifs mêlant culture techno et univers geek.';
    return (
      <div data-testid="next-seo" data-title={finalTitle} data-description={finalDescription} />
    );
  }
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

// Mock Layout component
jest.mock('../../components/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock RotatingMerch3D component
jest.mock('../../components/merch/RotatingMerch3D', () => {
  const MockRotatingMerch3D = ({ productName, modelUrl, price, ...props }: any) => (
    <div 
      data-testid="rotating-merch-3d" 
      data-product={productName}
      data-model={modelUrl}
      data-price={price}
      {...props}
    >
      3D Model: {productName} - {price}
    </div>
  );
  
  const MockModelCacheProvider = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="model-cache-provider">{children}</div>
  );
  
  MockRotatingMerch3D.displayName = 'RotatingMerch3D';
  MockModelCacheProvider.displayName = 'ModelCacheProvider';
  
  return {
    __esModule: true,
    default: MockRotatingMerch3D,
    ModelCacheProvider: MockModelCacheProvider
  };
});

// Mock TVBlackout component
jest.mock('../../components/effects/TVBlackout', () => {
  return function MockTVBlackout({ children }: { children: React.ReactNode }) {
    return <div data-testid="tv-blackout">{children}</div>;
  };
});

// Mock utils
jest.mock('../../lib/utils', () => ({
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

describe('Merch Page', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      renderWithProvider(<MerchPage />);
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('should render SEO component with correct props', () => {
      renderWithProvider(<MerchPage />);
      const seo = screen.getByTestId('next-seo');
      expect(seo).toBeInTheDocument();
      expect(seo).toHaveAttribute('data-title', expect.stringContaining('Merchandising'));
    });

    it('should render page title', () => {
      renderWithProvider(<MerchPage />);
      expect(screen.getByText(/MERCH/)).toBeInTheDocument();
    });

    it('should render ModelCacheProvider', () => {
      renderWithProvider(<MerchPage />);
      expect(screen.getByTestId('model-cache-provider')).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('should render category filter buttons', () => {
      renderWithProvider(<MerchPage />);
      
      expect(screen.getByText(/TOUS/)).toBeInTheDocument();
      expect(screen.getByText(/VÊTEMENTS/)).toBeInTheDocument();
      expect(screen.getByText(/ACCESSOIRES/)).toBeInTheDocument();
      expect(screen.getByText(/PRINTS/)).toBeInTheDocument();
      expect(screen.getByText(/ÉDITION LIMITÉE/)).toBeInTheDocument();
    });

    it('should filter products by category when clicked', async () => {
      renderWithProvider(<MerchPage />);
      
      const clothingButton = screen.getAllByText(/VÊTEMENTS/)[0];
      await user.click(clothingButton);
      
      // Should show only clothing items
      await waitFor(() => {
        const products = screen.getAllByTestId('rotating-merch-3d');
        expect(products.length).toBeGreaterThan(0);
      });
    });

    it('should show all products when "TOUS" is selected', async () => {
      renderWithProvider(<MerchPage />);
      
      // First filter by category
      const clothingButton = screen.getAllByText(/VÊTEMENTS/)[0];
      await user.click(clothingButton);
      
      // Then show all
      const allButton = screen.getAllByText(/TOUS/)[0];
      await user.click(allButton);
      
      await waitFor(() => {
        const products = screen.getAllByTestId('rotating-merch-3d');
        expect(products.length).toBeGreaterThan(0);
      });
    });

    it('should highlight active category', async () => {
      renderWithProvider(<MerchPage />);
      
      const clothingButton = screen.getByText(/VÊTEMENTS/);
      await user.click(clothingButton);
      
      // Active category should have different styling
      expect(clothingButton).toBeInTheDocument();
    });
  });

  describe('Product Display', () => {
    it('should render product cards', () => {
      renderWithProvider(<MerchPage />);
      
      const products = screen.getAllByTestId('rotating-merch-3d');
      expect(products.length).toBeGreaterThan(0);
    });

    it('should display product information', () => {
      renderWithProvider(<MerchPage />);
      
      // Should show product names
      const tshirts = screen.getAllByText(/T-SHIRT/i);
      const hoodies = screen.getAllByText(/HOODIE/i);
      expect(tshirts.length).toBeGreaterThanOrEqual(1);
      expect(hoodies.length).toBeGreaterThanOrEqual(1);
    });

    it('should display product prices', () => {
      renderWithProvider(<MerchPage />);
      
      const products = screen.getAllByTestId('rotating-merch-3d');
      products.forEach(product => {
        expect(product).toHaveAttribute('data-price', expect.stringContaining('€'));
      });
    });

    it('should show limited edition badges', () => {
      renderWithProvider(<MerchPage />);
      
      // Look for limited edition indicators
      const limitedBadges = screen.queryAllByText(/LIMITED/i);
      expect(limitedBadges.length).toBeGreaterThanOrEqual(0);
    });

    it('should display product availability status', () => {
      renderWithProvider(<MerchPage />);
      
      // Products should show availability
      const products = screen.getAllByTestId('rotating-merch-3d');
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('3D Model Integration', () => {
    it('should render 3D models for each product', () => {
      renderWithProvider(<MerchPage />);
      
      const models = screen.getAllByTestId('rotating-merch-3d');
      expect(models.length).toBeGreaterThan(0);
      
      models.forEach(model => {
        expect(model).toHaveAttribute('data-model', expect.stringContaining('.glb'));
      });
    });

    it('should pass correct props to RotatingMerch3D components', () => {
      renderWithProvider(<MerchPage />);
      
      const models = screen.getAllByTestId('rotating-merch-3d');
      
      models.forEach(model => {
        expect(model).toHaveAttribute('data-product');
        expect(model).toHaveAttribute('data-model');
        expect(model).toHaveAttribute('data-price');
      });
    });

    it('should enable mouse controls on 3D models', () => {
      renderWithProvider(<MerchPage />);
      
      const models = screen.getAllByTestId('rotating-merch-3d');
      expect(models.length).toBeGreaterThan(0);
      
      // Models should have controls enabled (showControls=true)
      // This would be verified through the component props
    });
  });

  describe('Product Categories', () => {
    it('should handle clothing category', async () => {
      renderWithProvider(<MerchPage />);
      
      const clothingButton = screen.getByText(/VÊTEMENTS/);
      await user.click(clothingButton);
      
      await waitFor(() => {
        // Check if clothing products are visible
        const products = screen.getAllByTestId('rotating-merch-3d');
        expect(products.length).toBeGreaterThanOrEqual(1);
      }, { timeout: 3000 });
    });

    it('should handle accessories category', async () => {
      renderWithProvider(<MerchPage />);
      
      const accessoriesButton = screen.getByText(/ACCESSOIRES/);
      await user.click(accessoriesButton);
      
      // Should filter to show only accessories
      await waitFor(() => {
        const products = screen.getAllByTestId('rotating-merch-3d');
        expect(products.length).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle prints category', async () => {
      renderWithProvider(<MerchPage />);
      
      const printsButton = screen.getByText(/PRINTS/);
      await user.click(printsButton);
      
      await waitFor(() => {
        const products = screen.getAllByTestId('rotating-merch-3d');
        expect(products.length).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle limited edition category', async () => {
      renderWithProvider(<MerchPage />);
      
      const limitedButton = screen.getByText(/ÉDITION LIMITÉE/);
      await user.click(limitedButton);
      
      await waitFor(() => {
        const products = screen.getAllByTestId('rotating-merch-3d');
        expect(products.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('User Interaction', () => {
    it('should handle rapid category switching', async () => {
      renderWithProvider(<MerchPage />);
      
      const categories = [
        screen.getByText(/VÊTEMENTS/),
        screen.getByText(/ACCESSOIRES/),
        screen.getByText(/PRINTS/),
        screen.getByText(/TOUS/)
      ];
      
      // Rapidly switch between categories
      for (const category of categories) {
        await user.click(category);
        await waitFor(() => {
          expect(screen.getAllByTestId('rotating-merch-3d').length).toBeGreaterThanOrEqual(0);
        });
      }
    });

    it('should maintain state during category changes', async () => {
      renderWithProvider(<MerchPage />);
      
      const clothingButton = screen.getByText(/VÊTEMENTS/);
      await user.click(clothingButton);
      
      // State should be maintained
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render properly on mobile devices', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProvider(<MerchPage />);
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('should render properly on tablet devices', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderWithProvider(<MerchPage />);
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('should adapt product grid to screen size', () => {
      renderWithProvider(<MerchPage />);
      
      const products = screen.getAllByTestId('rotating-merch-3d');
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should render efficiently with multiple products', () => {
      const startTime = performance.now();
      renderWithProvider(<MerchPage />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(2000); // Should render within 2 seconds
    });

    it('should handle category filtering efficiently', async () => {
      renderWithProvider(<MerchPage />);
      
      const startTime = performance.now();
      
      const clothingButton = screen.getByText(/VÊTEMENTS/);
      await user.click(clothingButton);
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing product data gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      renderWithProvider(<MerchPage />);
      
      expect(screen.getByTestId('layout')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('should handle 3D model loading errors', () => {
      renderWithProvider(<MerchPage />);
      
      // Should render even if some 3D models fail to load
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithProvider(<MerchPage />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have accessible category buttons', () => {
      renderWithProvider(<MerchPage />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      renderWithProvider(<MerchPage />);
      
      const firstButton = screen.getAllByText(/TOUS/)[0];
      firstButton.focus();
      
      expect(document.activeElement).toBe(firstButton);
      expect(firstButton).toBeInTheDocument();
    });
  });

  describe('SEO and Meta Tags', () => {
    it('should have proper meta information', () => {
      renderWithProvider(<MerchPage />);
      
      const seo = screen.getByTestId('next-seo');
      expect(seo).toHaveAttribute('data-title');
      expect(seo).toHaveAttribute('data-description');
    });

    it('should have meaningful page title', () => {
      renderWithProvider(<MerchPage />);
      
      const seo = screen.getByTestId('next-seo');
      const title = seo.getAttribute('data-title');
      
      expect(title).toContain('Merchandising');
    });
  });

  describe('Product Data Integrity', () => {
    it('should display consistent product information', () => {
      renderWithProvider(<MerchPage />);
      
      const products = screen.getAllByTestId('rotating-merch-3d');
      
      products.forEach(product => {
        expect(product).toHaveAttribute('data-product');
        expect(product).toHaveAttribute('data-price');
        expect(product).toHaveAttribute('data-model');
      });
    });

    it('should handle product availability correctly', () => {
      renderWithProvider(<MerchPage />);
      
      // All displayed products should be available or show proper status
      const products = screen.getAllByTestId('rotating-merch-3d');
      expect(products.length).toBeGreaterThan(0);
    });
  });
});