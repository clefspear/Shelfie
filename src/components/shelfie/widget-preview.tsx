'use client';

import { cn } from '@/lib/utils';
import BookCard from './book-card';

interface Book {
  id: string;
  cover_url: string;
  title: string;
  author: string;
  percentage: number;
}

interface WidgetPreviewProps {
  books: Book[];
  size?: 'small' | 'medium' | 'large';
  friendsActivity?: Array<{
    user: { display_name: string; avatar_config: any };
    book: Book;
  }>;
}

export default function WidgetPreview({ 
  books, 
  size = 'large',
  friendsActivity = []
}: WidgetPreviewProps) {
  const displayBooks = books.slice(0, size === 'small' ? 1 : size === 'medium' ? 3 : 4);

  return (
    <div className={cn(
      "bg-gradient-to-br from-cream to-[#FFF5ED] rounded-2xl p-6 border border-coral/10",
      "shadow-[0_4px_24px_rgba(255,107,107,0.08)]"
    )}>
      {/* Currently Reading Section */}
      <div className="mb-6">
        <h2 className="font-fraunces text-2xl font-light tracking-wide text-gray-900 mb-4">
          Currently Reading
        </h2>
        
        <div className={cn(
          "grid gap-4",
          size === 'small' ? 'grid-cols-1' : 
          size === 'medium' ? 'grid-cols-3' :
          'grid-cols-2'
        )}>
          {displayBooks.map((book) => (
            <BookCard
              key={book.id}
              cover={book.cover_url}
              title={book.title}
              author={book.author}
              progress={book.percentage}
              size={size === 'large' ? 'medium' : 'small'}
            />
          ))}
        </div>
      </div>

      {/* Friends Activity (only for large widget) */}
      {size === 'large' && friendsActivity.length > 0 && (
        <div className="pt-6 border-t border-coral/10">
          <h3 className="font-fraunces text-lg font-light text-gray-700 mb-3">
            Friends Activity
          </h3>
          <div className="space-y-3">
            {friendsActivity.slice(0, 2).map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center text-coral font-inter font-medium">
                  {activity.user.display_name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-inter text-gray-700">
                    <span className="font-medium">{activity.user.display_name}</span> is reading
                  </p>
                  <p className="text-xs text-gray-500">{activity.book.title}</p>
                </div>
                <div className="text-xs font-mono text-coral">
                  {activity.book.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
