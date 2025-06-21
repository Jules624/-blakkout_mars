import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
  transparentNavbar?: boolean;
  withoutFooter?: boolean;
};

export default function Layout({
  children,
  transparentNavbar = false,
  withoutFooter = false,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar transparent={transparentNavbar} />
      <main className="flex-1">{children}</main>
      {!withoutFooter && <Footer />}
    </div>
  );
}