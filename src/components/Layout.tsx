import type { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Navigation />
      </header>
      <main className="p-4">
        <div className="max-w-2xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
