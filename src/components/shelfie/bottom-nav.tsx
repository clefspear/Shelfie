'use client';

import { Home, Search, Users, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: User, label: 'Profile', href: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream border-t border-coral/10 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200",
                isActive ? "scale-105" : "scale-100"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-colors",
                  isActive ? "text-coral" : "text-gray-400"
                )}
              />
              <span className={cn(
                "text-xs mt-1 font-inter",
                isActive ? "text-coral font-medium" : "text-gray-400"
              )}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
