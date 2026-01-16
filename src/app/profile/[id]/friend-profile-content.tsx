'use client';

import { cn } from '@/lib/utils';
import { ArrowLeft, Quote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  current_page: number;
  total_pages: number;
  percentage: number;
}

interface FriendProfileContentProps {
  friendProfile: {
    id: string;
    display_name: string;
    avatar_config: any;
    favorite_quote?: string;
    favorite_author?: string;
  };
  currentlyReading: Book[];
  topBooks: Book[];
}

export default function FriendProfileContent({ 
  friendProfile, 
  currentlyReading, 
  topBooks 
}: FriendProfileContentProps) {
  const router = useRouter();

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-gray-600 hover:text-gray-900 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      {/* Profile Header */}
      <div className="text-center pt-2">
        <div 
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg",
            friendProfile.avatar_config?.gradient 
              ? `bg-gradient-to-br ${friendProfile.avatar_config.gradient}` 
              : "bg-gradient-to-br from-coral to-coral-light"
          )}
        >
          <span className="text-3xl font-inter font-medium text-white">
            {friendProfile.display_name[0]}
          </span>
        </div>
        
        <h1 className="font-fraunces text-2xl font-light tracking-wide text-gray-900">
          {friendProfile.display_name}
        </h1>
      </div>

      {/* Favorite Quote */}
      {friendProfile.favorite_quote && (
        <div className="bg-white rounded-2xl p-5 border border-coral/10">
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-coral/50 flex-shrink-0 mt-1" />
            <div>
              <p className="font-inter text-gray-700 italic leading-relaxed">
                "{friendProfile.favorite_quote}"
              </p>
              {friendProfile.favorite_author && (
                <p className="font-inter text-sm text-coral-light mt-2">
                  — {friendProfile.favorite_author}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <div>
          <h2 className="font-fraunces text-lg font-light text-gray-900 mb-3">
            Currently Reading
          </h2>
          <div className="space-y-3">
            {currentlyReading.map((book) => (
              <div 
                key={book.id}
                className="bg-white rounded-xl p-4 border border-coral/10 flex gap-3"
              >
                <div className="w-12 h-18 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                  <img 
                    src={book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80'} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-inter font-medium text-gray-900 text-sm truncate">
                    {book.title}
                  </h3>
                  <p className="font-inter text-xs text-gray-500 truncate mb-2">
                    {book.author}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-coral to-[#FF8E8E] rounded-full shadow-[0_0_6px_rgba(255,107,107,0.5)]"
                        style={{ width: `${book.percentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-coral">
                      {book.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Books (Completed) */}
      {topBooks.length > 0 && (
        <div>
          <h2 className="font-fraunces text-lg font-light text-gray-900 mb-3">
            Top Books
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
            {topBooks.map((book, idx) => (
              <div 
                key={book.id}
                className="flex-shrink-0 w-20"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-2">
                  <img 
                    src={book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80'} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <div className="absolute top-1 right-1 bg-coral text-white text-[10px] px-1.5 py-0.5 rounded-full font-inter font-medium">
                      #1
                    </div>
                  )}
                </div>
                <p className="font-inter text-xs text-gray-900 truncate">
                  {book.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {currentlyReading.length === 0 && topBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="font-inter text-gray-500">
            {friendProfile.display_name} hasn't added any books yet
          </p>
        </div>
      )}
    </div>
  );
}
