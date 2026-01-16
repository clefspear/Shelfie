'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Loader2, BookOpen, FileText } from 'lucide-react';
import { createClient } from '../../../supabase/client';
import { useRouter } from 'next/navigation';
import PaywallModal from '@/components/shelfie/paywall-modal';

interface SearchResult {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  number_of_pages_median?: number;
}

interface SearchContentProps {
  profile: any;
  bookCount: number;
}

// Debounce hook for auto-search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchContent({ profile, bookCount }: SearchContentProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(null);
  const [adding, setAdding] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Debounced query for auto-search
  const debouncedQuery = useDebounce(query, 300);

  // Auto-search after 3+ characters
  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      searchBooks(debouncedQuery);
    } else if (debouncedQuery.length === 0) {
      setResults([]);
    }
  }, [debouncedQuery]);

  const searchBooks = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,number_of_pages_median`
      );
      const data = await response.json();
      setResults(data.docs || []);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 3) {
      searchBooks(query);
    }
  };

  const handleSelectBook = (book: SearchResult) => {
    // Check book limit
    if (bookCount >= 5 && profile.subscription_status !== 'premium') {
      setShowPaywall(true);
      return;
    }
    
    setSelectedBook(book);
  };

  const handleAddBook = async () => {
    if (!selectedBook) return;

    // Use the median pages from Open Library, or default to 0 if not available
    const totalPages = selectedBook.number_of_pages_median || 0;

    setAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('books')
        .insert({
          user_id: user?.id,
          open_library_id: selectedBook.key,
          title: selectedBook.title,
          author: selectedBook.author_name?.[0] || 'Unknown Author',
          cover_url: selectedBook.cover_i 
            ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
            : null,
          total_pages: totalPages,
          current_page: 0,
          status: 'reading'
        });

      if (!error) {
        router.push('/home');
      }
    } catch (error) {
      console.error('Failed to add book:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-fraunces text-4xl font-light tracking-wide text-gray-900 mb-2">
          Discover Books
        </h1>
        <p className="font-inter text-gray-600">
          Search for your next read
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-14 bg-white border-coral/20 focus:border-coral font-inter"
        />
        {query.length > 0 && query.length < 3 && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {3 - query.length} more...
          </span>
        )}
      </form>

      {/* Hint Text */}
      <p className="text-xs font-inter text-gray-400 -mt-2">
        Works with physical books, Kindle books, and PDFs — we'll find them all
      </p>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-coral" />
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((book) => (
            <div
              key={book.key}
              onClick={() => handleSelectBook(book)}
              className="bg-white rounded-xl p-4 border border-coral/10 hover:border-coral/30 cursor-pointer transition-all flex gap-4"
            >
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-16 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-inter font-medium text-gray-900 leading-tight mb-1 truncate">
                  {book.title}
                </h3>
                <p className="text-sm font-inter text-coral-light mb-2 truncate">
                  {book.author_name?.[0] || 'Unknown Author'}
                </p>
                <div className="flex gap-3 text-xs font-inter text-gray-500">
                  {book.first_publish_year && (
                    <span>{book.first_publish_year}</span>
                  )}
                  {book.number_of_pages_median && (
                    <span className="font-mono">{book.number_of_pages_median} pages</span>
                  )}
                </div>
              </div>

              <Plus className="w-6 h-6 text-coral flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && query.length >= 3 && results.length === 0 && (
        <div className="text-center py-12">
          <p className="font-inter text-gray-500">
            No books found. Try a different search.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && query.length < 3 && results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-coral" />
          </div>
          <p className="font-inter text-gray-500 mb-2">
            Type at least 3 characters to search
          </p>
          <p className="font-inter text-xs text-gray-400">
            Search works for all book formats — physical, Kindle, or PDF
          </p>
        </div>
      )}

      {/* Add Book Modal */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="bg-cream border-coral/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-fraunces text-2xl font-light text-gray-900">
              Add to Shelf
            </DialogTitle>
          </DialogHeader>

          {selectedBook && (
            <div className="space-y-6 py-4">
              <div className="flex gap-4">
                {selectedBook.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`}
                    alt={selectedBook.title}
                    className="w-24 h-36 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-24 h-36 bg-gray-200 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-inter font-medium text-gray-900 leading-tight mb-1">
                    {selectedBook.title}
                  </h3>
                  <p className="text-sm font-inter text-coral-light mb-3">
                    {selectedBook.author_name?.[0] || 'Unknown Author'}
                  </p>
                  {selectedBook.number_of_pages_median ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-coral/10 rounded-full">
                      <FileText className="w-4 h-4 text-coral" />
                      <span className="font-mono text-sm text-coral">
                        {selectedBook.number_of_pages_median} pages
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="font-inter text-sm text-gray-500">
                        Page count unavailable
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBook(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddBook}
                  disabled={adding}
                  className="flex-1 bg-coral hover:bg-coral/90 text-white"
                >
                  {adding ? 'Adding...' : 'Add to Shelf'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Paywall Modal */}
      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
      />
    </div>
  );
}
