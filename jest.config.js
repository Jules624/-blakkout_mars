const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^three/examples/jsm/loaders/GLTFLoader$': '<rootDir>/src/__mocks__/GLTFLoader.js',
    '^three$': '<rootDir>/src/__mocks__/three.js',
    '^@react-three/fiber$': '<rootDir>/src/__mocks__/@react-three/fiber.js',
    '^@react-three/drei$': '<rootDir>/src/__mocks__/@react-three/drei.js'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx'
  ]
}

module.exports = createJestConfig(customJestConfig)
