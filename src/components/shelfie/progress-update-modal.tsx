'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, Minus, Plus, Check } from 'lucide-react';

interface ProgressUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    id: string;
    title: string;
    author: string;
    cover_url: string;
    current_page: number;
    total_pages: number;
    percentage: number;
  };
  onUpdate: (bookId: string, currentPage: number) => Promise<void>;
}

export default function ProgressUpdateModal({
  open,
  onOpenChange,
  book,
  onUpdate
}: ProgressUpdateModalProps) {
  const [currentPage, setCurrentPage] = useState(book.current_page);
  const [loading, setLoading] = useState(false);

  // Reset state when book changes or modal opens
  useEffect(() => {
    if (open) {
      setCurrentPage(book.current_page);
    }
  }, [open, book.current_page]);

  const handleSliderChange = (value: number[]) => {
    setCurrentPage(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const maxPages = book.total_pages || 1000; // Fallback if total_pages is 0
    setCurrentPage(Math.min(Math.max(0, value), maxPages));
  };

  const incrementPage = (amount: number) => {
    const maxPages = book.total_pages || 1000;
    setCurrentPage(prev => Math.min(Math.max(0, prev + amount), maxPages));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(book.id, currentPage);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxPages = book.total_pages || 1;
  const percentage = Math.round((currentPage / maxPages) * 100);
  const hasPageCount = book.total_pages > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream border-coral/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fraunces text-2xl font-light text-gray-900">
            Update Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Book Preview */}
          <div className="flex gap-4">
            {book.cover_url ? (
              <img 
                src={book.cover_url}
                alt={book.title}
                className="w-20 h-28 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-20 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-inter font-medium text-gray-900 leading-tight mb-1">
                {book.title}
              </h3>
              <p className="text-sm font-inter text-coral-light mb-3">
                {book.author}
              </p>
              {hasPageCount && (
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-coral/10 rounded-md">
                  <span className="font-mono text-xs text-coral">
                    {book.total_pages} pages
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Progress Section */}
          {hasPageCount ? (
            <div className="space-y-4">
              {/* Visual Progress Bar */}
              <div className="relative">
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-coral to-[#FF8E8E] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div 
                  className="absolute -top-1 w-5 h-5 bg-white border-2 border-coral rounded-full shadow-md transition-all duration-300"
                  style={{ left: `calc(${percentage}% - 10px)` }}
                />
              </div>

              {/* Progress Slider */}
              <div className="space-y-2">
                <Slider
                  value={[currentPage]}
                  onValueChange={handleSliderChange}
                  max={book.total_pages}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-inter text-gray-500">0</span>
                  <span className="font-mono text-2xl font-bold text-coral">{percentage}%</span>
                  <span className="text-sm font-inter text-gray-500">{book.total_pages}</span>
                </div>
              </div>

              {/* Quick Increment Buttons */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementPage(-10)}
                  className="h-9 px-3"
                >
                  <Minus className="w-3 h-3 mr-1" />
                  10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementPage(-1)}
                  className="h-9 w-9"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <Input
                  type="number"
                  value={currentPage}
                  onChange={handleInputChange}
                  min={0}
                  max={book.total_pages}
                  className="w-20 h-9 font-mono text-center"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementPage(1)}
                  className="h-9 w-9"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementPage(10)}
                  className="h-9 px-3"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  10
                </Button>
              </div>
            </div>
          ) : (
            /* No page count - percentage based */
            <div className="space-y-4">
              <p className="text-sm font-inter text-gray-500 text-center">
                Page count unavailable. Update by percentage:
              </p>
              
              {/* Percentage Slider */}
              <div className="space-y-2">
                <Slider
                  value={[percentage]}
                  onValueChange={(value) => setCurrentPage(Math.round((value[0] / 100) * 100))}
                  max={100}
                  step={5}
                  className="w-full"
                />
                
                <div className="text-center">
                  <span className="font-mono text-3xl font-bold text-coral">{percentage}%</span>
                </div>
              </div>

              {/* Quick Percentage Buttons */}
              <div className="flex justify-center gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <Button
                    key={pct}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(pct)}
                    className={cn(
                      "h-9",
                      currentPage === pct && "bg-coral text-white border-coral"
                    )}
                  >
                    {pct}%
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-coral hover:bg-coral/90 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Save Progress
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
