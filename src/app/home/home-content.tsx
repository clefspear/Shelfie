'use client';

import { useState } from 'react';
import WidgetPreview from '@/components/shelfie/widget-preview';
import BookCard from '@/components/shelfie/book-card';
import ProgressUpdateModal from '@/components/shelfie/progress-update-modal';
import ShareCardModal from '@/components/shelfie/share-card-modal';
import { Button } from '@/components/ui/button';
import { Share2, Plus } from 'lucide-react';
import { createClient } from '../../../supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  current_page: number;
  total_pages: number;
  percentage: number;
}

interface FriendWithBook {
  id: string;
  user_id: string;
  display_name: string;
  avatar_config: any;
  book: Book;
}

interface HomeContentProps {
  initialBooks: Book[];
  friendsWithBooks: FriendWithBook[];
  profile: any;
}

export default function HomeContent({ initialBooks, friendsWithBooks, profile }: HomeContentProps) {
  const [books, setBooks] = useState(initialBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowProgressModal(true);
  };

  const handleUpdateProgress = async (bookId: string, currentPage: number) => {
    const { error } = await supabase
      .from('books')
      .update({ current_page: currentPage })
      .eq('id', bookId);

    if (!error) {
      setBooks(books.map(book => 
        book.id === bookId 
          ? { 
              ...book, 
              current_page: currentPage,
              percentage: Math.round((currentPage / book.total_pages) * 100)
            }
          : book
      ));
    }
  };

  const handleShare = (book: Book) => {
    setSelectedBook(book);
    setShowShareModal(true);
  };

  const handleFriendClick = (friendId: string) => {
    router.push(`/profile/${friendId}`);
  };

  return (
    <div className="px-5 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-inter text-sm text-gray-500 mb-0.5">Welcome back</p>
          <h1 className="font-fraunces text-2xl font-light tracking-wide text-gray-900">
            {profile.display_name}
          </h1>
        </div>
        <div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white font-inter font-medium text-base shadow-sm",
            profile.avatar_config?.gradient 
              ? `bg-gradient-to-br ${profile.avatar_config.gradient}` 
              : "bg-gradient-to-br from-coral to-coral-light"
          )}
        >
          {profile.display_name[0]}
        </div>
      </div>

      {/* Currently Reading */}
      {books.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-fraunces text-xl font-light text-gray-900">
              Currently Reading
            </h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => books[0] && handleShare(books[0])}
              className="text-coral hover:text-coral/80 hover:bg-coral/5 h-8 px-2"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                cover={book.cover_url}
                title={book.title}
                author={book.author}
                progress={book.percentage}
                onClick={() => handleBookClick(book)}
                size="medium"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Sample Book Preview */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex gap-4">
              {/* Sample Book Cover */}
              <div className="w-20 h-28 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80" 
                  alt="Sample book"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              
              {/* Sample Book Info */}
              <div className="flex-1">
                <p className="font-inter text-sm font-medium text-gray-400 mb-0.5">
                  Your First Book
                </p>
                <p className="font-inter text-xs text-gray-300 mb-3">
                  by Your Favorite Author
                </p>
                
                {/* Sample Progress Bar */}
                <div className="mb-2">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-coral/30 to-coral/10 rounded-full"
                      style={{ width: '35%' }}
                    />
                  </div>
                </div>
                <p className="font-mono text-xs text-gray-300">
                  Track your progress
                </p>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-coral/5 to-coral/10 rounded-2xl p-6 border border-coral/10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-coral/10 flex items-center justify-center">
              <Plus className="w-7 h-7 text-coral" />
            </div>
            <h3 className="font-fraunces text-xl font-light text-gray-900 mb-2">
              Start Your Reading Journey
            </h3>
            <p className="font-inter text-sm text-gray-500 mb-5">
              Search and add your first book to start tracking
            </p>
            <Button
              onClick={() => router.push('/search')}
              className="bg-coral hover:bg-coral/90 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Book
            </Button>
          </div>
        </div>
      )}

      {/* Friends Widget - Shows friends and what they're reading */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-fraunces text-xl font-light text-gray-900">
            Friends Activity
          </h2>
          {friendsWithBooks.length > 0 && (
            <span className="text-xs font-inter text-gray-400">
              {friendsWithBooks.length} reading
            </span>
          )}
        </div>
        {friendsWithBooks.length > 0 ? (
          <WidgetPreview 
            friends={friendsWithBooks}
            onFriendClick={handleFriendClick}
          />
        ) : (
          <div className="space-y-2">
            {/* Sample friend preview cards */}
            <div className="bg-white/60 rounded-2xl p-3 border border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 opacity-40" />
                <div className="w-8 h-12 rounded-md bg-gray-100/60" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-100/60 rounded w-24 mb-1.5" />
                  <div className="h-2 bg-gray-100/60 rounded w-32 mb-2" />
                  <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                </div>
              </div>
            </div>
            <div className="bg-white/60 rounded-2xl p-3 border border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 opacity-40" />
                <div className="w-8 h-12 rounded-md bg-gray-100/60" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-100/60 rounded w-20 mb-1.5" />
                  <div className="h-2 bg-gray-100/60 rounded w-28 mb-2" />
                  <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                </div>
              </div>
            </div>
            
            {/* CTA overlay */}
            <div className="text-center py-4">
              <p className="text-sm font-inter text-gray-500 mb-2">
                See what your friends are reading
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/friends')}
                className="border-coral/30 text-coral hover:bg-coral/5"
              >
                Add Friends
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedBook && (
        <>
          <ProgressUpdateModal
            open={showProgressModal}
            onOpenChange={setShowProgressModal}
            book={selectedBook}
            onUpdate={handleUpdateProgress}
          />
          <ShareCardModal
            open={showShareModal}
            onOpenChange={setShowShareModal}
            book={selectedBook}
            user={profile}
          />
        </>
      )}
    </div>
  );
}
