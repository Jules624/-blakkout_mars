import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import EasterEggNotification from '../effects/EasterEggNotification';
import TVBlackout from '../effects/TVBlackout';

type LayoutProps = {
  children: ReactNode;
  transparentNavbar?: boolean;
  withoutFooter?: boolean;
  disableTVBlackout?: boolean;
};

export default function Layout({
  children,
  transparentNavbar = false,
  withoutFooter = false,
  disableTVBlackout = false,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar transparent={transparentNavbar} />
      <TVBlackout disabled={disableTVBlackout}>
        <main className="flex-1">{children}</main>
      </TVBlackout>
      {!withoutFooter && <Footer />}
      <EasterEggNotification />
    </div>
  );
}