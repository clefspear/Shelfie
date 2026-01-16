import { ReactNode } from 'react';

interface ShelfieLayoutProps {
  children: ReactNode;
}

export default function ShelfieLayout({ children }: ShelfieLayoutProps) {
  return (
    <div className="min-h-screen bg-cream pb-20">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
    </div>
  );
}
