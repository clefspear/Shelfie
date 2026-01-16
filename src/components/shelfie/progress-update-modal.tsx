'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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

  const handleSliderChange = (value: number[]) => {
    setCurrentPage(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCurrentPage(Math.min(Math.max(0, value), book.total_pages));
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

  const percentage = Math.round((currentPage / book.total_pages) * 100);

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
            <img 
              src={book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80'}
              alt={book.title}
              className="w-20 h-30 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h3 className="font-inter font-medium text-gray-900 leading-tight mb-1">
                {book.title}
              </h3>
              <p className="text-sm font-inter text-coral-light">
                {book.author}
              </p>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Slider
                value={[currentPage]}
                onValueChange={handleSliderChange}
                max={book.total_pages}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between items-center text-sm text-gray-600 font-inter">
                <span>Page {currentPage}</span>
                <span className="font-mono text-coral">{percentage}%</span>
                <span>of {book.total_pages}</span>
              </div>
            </div>

            {/* Direct Input */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-inter text-gray-600 whitespace-nowrap">
                Current Page:
              </label>
              <Input
                type="number"
                value={currentPage}
                onChange={handleInputChange}
                min={0}
                max={book.total_pages}
                className="w-24 font-mono"
              />
            </div>
          </div>

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
              {loading ? 'Saving...' : 'Save Progress'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
