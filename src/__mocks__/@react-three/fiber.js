// Mock for @react-three/fiber
import React from 'react';

export const Canvas = ({ children, ...props }) => {
  return React.createElement('div', { 'data-testid': 'canvas', ...props }, children);
};

export const useFrame = jest.fn();

export const useThree = jest.fn(() => ({
  camera: { 
    position: { set: jest.fn() },
    lookAt: jest.fn()
  },
  gl: { 
    domElement: document.createElement('canvas'),
    setSize: jest.fn(),
    render: jest.fn()
  },
  scene: {
    add: jest.fn(),
    remove: jest.fn()
  },
  size: { width: 800, height: 600 },
  viewport: { width: 800, height: 600 }
}));

export const useLoader = jest.fn();

export const extend = jest.fn();

export const createRoot = jest.fn();