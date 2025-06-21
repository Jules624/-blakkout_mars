import React, { ReactNode } from 'react';
import { EasterEggProvider as EasterEggContextProvider } from '@/context/EasterEggContext';

type EasterEggProviderProps = {
  children: ReactNode;
};

export default function EasterEggProvider({ children }: EasterEggProviderProps) {
  return <EasterEggContextProvider>{children}</EasterEggContextProvider>;
}