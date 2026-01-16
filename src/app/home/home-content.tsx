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

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  current_page: number;
  total_pages: number;
  percentage: number;
}

interface HomeContentProps {
  initialBooks: Book[];
  friendsActivity: any[];
  profile: any;
}

export default function HomeContent({ initialBooks, friendsActivity, profile }: HomeContentProps) {
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

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-fraunces text-4xl font-light tracking-wide text-gray-900 mb-2">
          Welcome back, {profile.display_name}
        </h1>
        <p className="font-inter text-gray-600">
          Keep the momentum going
        </p>
      </div>

      {/* Widget Preview */}
      {books.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-fraunces text-2xl font-light text-gray-900">
              Your Shelf
            </h2>
            <Button
              size="sm"
              onClick={() => selectedBook && handleShare(selectedBook)}
              disabled={!books[0]}
              className="bg-coral hover:bg-coral/90 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          
          <WidgetPreview 
            books={books} 
            friendsActivity={friendsActivity}
          />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-cream to-[#FFF5ED] rounded-2xl p-12 border border-coral/10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-coral/10 flex items-center justify-center">
            <Plus className="w-10 h-10 text-coral" />
          </div>
          <h3 className="font-fraunces text-2xl font-light text-gray-900 mb-2">
            Start Your Reading Journey
          </h3>
          <p className="font-inter text-gray-600 mb-6">
            Add your first book to get started
          </p>
          <Button
            onClick={() => router.push('/search')}
            className="bg-coral hover:bg-coral/90 text-white"
          >
            Add a Book
          </Button>
        </div>
      )}

      {/* All Books Grid */}
      {books.length > 0 && (
        <div>
          <h2 className="font-fraunces text-2xl font-light text-gray-900 mb-4">
            Currently Reading
          </h2>
          <div className="grid grid-cols-2 gap-6">
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
      )}

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
