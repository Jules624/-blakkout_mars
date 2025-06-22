// Mock for @react-three/drei
import React from 'react';

export const OrbitControls = ({ children, ...props }) => {
  return React.createElement('div', { 'data-testid': 'orbit-controls', ...props }, children);
};

export const useGLTF = jest.fn(() => ({
  scene: {
    clone: jest.fn(() => ({
      traverse: jest.fn(),
      scale: { set: jest.fn() },
      position: { set: jest.fn() },
      rotation: { set: jest.fn() },
      children: []
    }))
  },
  nodes: {},
  materials: {},
  animations: []
}));

export const Preload = ({ children, ...props }) => {
  return React.createElement('div', { 'data-testid': 'preload', ...props }, children);
};

export const useTexture = jest.fn(() => ({
  wrapS: 1000,
  wrapT: 1000,
  repeat: { set: jest.fn() }
}));

export const Text = ({ children, ...props }) => {
  return React.createElement('div', { 'data-testid': 'text-3d', ...props }, children);
};

export const Html = ({ children, ...props }) => {
  return React.createElement('div', { 'data-testid': 'html-3d', ...props }, children);
};

export const Text3D = ({ children, ...props }) => {
  return React.createElement('div', { 'data-testid': 'text-3d', ...props }, children);
};

export const Center = ({ children, ...props }) => {
  return React.createElement('div', { 'data-testid': 'center-3d', ...props }, children);
};