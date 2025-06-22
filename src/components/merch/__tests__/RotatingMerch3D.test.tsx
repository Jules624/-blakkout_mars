import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RotatingMerch3D, { ModelCacheProvider } from '../RotatingMerch3D';
import { Canvas } from '@react-three/fiber';

// Mock Three.js and React Three Fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, className, ...props }: any) => (
    <div data-testid="canvas" className={className} {...props}>
      {children}
    </div>
  ),
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    camera: { position: { set: jest.fn() } },
    gl: { domElement: document.createElement('canvas') }
  }))
}));

// Mock React Three Drei
jest.mock('@react-three/drei', () => ({
  OrbitControls: ({ children, ...props }: any) => (
    <div data-testid="orbit-controls" {...props}>
      {children}
    </div>
  ),
  useGLTF: jest.fn(() => ({
    scene: {
      clone: jest.fn(() => ({
        traverse: jest.fn(),
        scale: { set: jest.fn() },
        position: { set: jest.fn() },
        rotation: { set: jest.fn() }
      }))
    }
  })),
  Preload: ({ children, ...props }: any) => (
    <div data-testid="preload" {...props}>
      {children}
    </div>
  )
}));

// Mock Three.js
jest.mock('three', () => ({
  ...jest.requireActual('three'),
  TextureLoader: jest.fn(() => ({
    load: jest.fn((url, onLoad) => {
      const mockTexture = { url };
      if (onLoad) onLoad(mockTexture);
      return mockTexture;
    })
  }))
}));

// Mock utils
jest.mock('../../../lib/utils', () => ({
  cn: jest.fn((...args) => args.join(' '))
}));

const defaultProps = {
  modelUrl: '/assets/models/tshirt.glb',
  productName: 'Test Product',
  price: '35€',
  images: ['/test-image1.jpg', '/test-image2.jpg'],
  scale: [1, 1, 1] as [number, number, number],
  position: [0, 0, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  backgroundColor: '#0a0a0a',
  showControls: true,
  autoRotate: true,
  className: 'test-class'
};

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <ModelCacheProvider>
      {ui}
    </ModelCacheProvider>
  );
};

describe('RotatingMerch3D Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      renderWithProvider(<RotatingMerch3D {...defaultProps} />);
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      renderWithProvider(<RotatingMerch3D {...defaultProps} className="custom-class" />);
      const wrapper = screen.getByTestId('canvas').parentElement;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should render with default props when optional props are not provided', () => {
      const minimalProps = {
        modelUrl: '/assets/models/tshirt.glb',
        productName: 'Test Product',
        price: '35€'
      };
      renderWithProvider(<RotatingMerch3D {...minimalProps} />);
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('Props Validation', () => {
    it('should handle different scale values', () => {
      const customScale: [number, number, number] = [2, 2, 2];
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} scale={customScale} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle different position values', () => {
      const customPosition: [number, number, number] = [1, 2, 3];
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} position={customPosition} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle different rotation values', () => {
      const customRotation: [number, number, number] = [0.5, 1, 0];
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} rotation={customRotation} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle different background colors', () => {
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} backgroundColor="#ff0000" />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('Controls Configuration', () => {
    it('should render OrbitControls when showControls is true', () => {
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} showControls={true} />
      );
      expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
    });

    it('should not render OrbitControls when showControls is false', () => {
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} showControls={false} />
      );
      expect(screen.queryByTestId('orbit-controls')).not.toBeInTheDocument();
    });

    it('should handle autoRotate prop', () => {
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} autoRotate={false} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should handle multiple images', () => {
      const multipleImages = [
        '/image1.jpg',
        '/image2.jpg',
        '/image3.jpg'
      ];
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} images={multipleImages} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle empty images array', () => {
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} images={[]} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle undefined images', () => {
      const propsWithoutImages = { ...defaultProps };
      delete (propsWithoutImages as any).images;
      renderWithProvider(<RotatingMerch3D {...propsWithoutImages} />);
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });

  describe('Model Loading', () => {
    it('should handle different model URLs', () => {
      const differentModels = [
        '/assets/models/hoodie.glb',
        '/assets/models/cap.glb',
        '/assets/models/tshirt.glb'
      ];

      differentModels.forEach(modelUrl => {
        const { unmount } = renderWithProvider(
          <RotatingMerch3D {...defaultProps} modelUrl={modelUrl} />
        );
        expect(screen.getByTestId('canvas')).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle model loading errors gracefully', () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} modelUrl="/invalid-model.glb" />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('ModelCacheProvider', () => {
    it('should provide cache context to children', () => {
      const TestChild = () => {
        return <div data-testid="cache-child">Cache Child</div>;
      };

      render(
        <ModelCacheProvider>
          <TestChild />
        </ModelCacheProvider>
      );

      expect(screen.getByTestId('cache-child')).toBeInTheDocument();
    });

    it('should handle multiple RotatingMerch3D components', () => {
      render(
        <ModelCacheProvider>
          <RotatingMerch3D {...defaultProps} productName="Product 1" />
          <RotatingMerch3D {...defaultProps} productName="Product 2" />
        </ModelCacheProvider>
      );

      const canvases = screen.getAllByTestId('canvas');
      expect(canvases).toHaveLength(2);
    });
  });

  describe('Performance and Optimization', () => {
    it('should handle rapid prop changes', () => {
      const { rerender } = renderWithProvider(
        <RotatingMerch3D {...defaultProps} />
      );

      // Simulate rapid prop changes
      for (let i = 0; i < 5; i++) {
        rerender(
          <ModelCacheProvider>
            <RotatingMerch3D 
              {...defaultProps} 
              scale={[i + 1, i + 1, i + 1] as [number, number, number]}
            />
          </ModelCacheProvider>
        );
      }

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should cleanup properly on unmount', () => {
      const { unmount } = renderWithProvider(
        <RotatingMerch3D {...defaultProps} />
      );

      expect(screen.getByTestId('canvas')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large scale values', () => {
      const largeScale: [number, number, number] = [100, 100, 100];
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} scale={largeScale} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle negative scale values', () => {
      const negativeScale: [number, number, number] = [-1, -1, -1];
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} scale={negativeScale} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle zero scale values', () => {
      const zeroScale: [number, number, number] = [0, 0, 0];
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} scale={zeroScale} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });

    it('should handle extreme position values', () => {
      const extremePosition: [number, number, number] = [1000, -1000, 500];
      renderWithProvider(
        <RotatingMerch3D {...defaultProps} position={extremePosition} />
      );
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
    });
  });
});