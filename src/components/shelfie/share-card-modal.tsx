'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, Instagram, Twitter, MessageCircle } from 'lucide-react';

interface ShareCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    title: string;
    author: string;
    cover_url: string;
    current_page: number;
    total_pages: number;
    percentage: number;
  };
  user: {
    display_name: string;
    avatar_config: any;
  };
}

export default function ShareCardModal({
  open,
  onOpenChange,
  book,
  user
}: ShareCardModalProps) {
  const [format, setFormat] = useState<'stories' | 'feed'>('stories');
  const [generating, setGenerating] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const generateImage = async () => {
    if (!cardRef.current) return;

    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FFF9F5',
        logging: false
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shelfie-${book.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setGenerating(false);
    }
  };

  const shareViaWebShare = async () => {
    if (!cardRef.current) return;

    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FFF9F5'
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const file = new File([blob], 'shelfie-share.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: `Reading ${book.title}`,
          text: `I'm ${book.percentage}% through ${book.title} by ${book.author}`
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const dimensions = format === 'stories' 
    ? { width: 540, height: 960 } 
    : { width: 540, height: 540 };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream border-coral/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-fraunces text-2xl font-light text-gray-900">
            Share Your Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selector */}
          <div className="flex gap-3">
            <Button
              variant={format === 'stories' ? 'default' : 'outline'}
              onClick={() => setFormat('stories')}
              className={format === 'stories' ? 'bg-coral hover:bg-coral/90' : ''}
            >
              Stories (9:16)
            </Button>
            <Button
              variant={format === 'feed' ? 'default' : 'outline'}
              onClick={() => setFormat('feed')}
              className={format === 'feed' ? 'bg-coral hover:bg-coral/90' : ''}
            >
              Feed (1:1)
            </Button>
          </div>

          {/* Card Preview */}
          <div className="flex justify-center bg-gray-100 rounded-lg p-8">
            <div
              ref={cardRef}
              style={{ 
                width: dimensions.width, 
                height: dimensions.height 
              }}
              className="bg-cream relative overflow-hidden shadow-xl"
            >
              {/* User Avatar */}
              <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center">
                <span className="text-2xl font-inter font-medium text-coral">
                  {user.display_name[0]}
                </span>
              </div>

              {/* Book Cover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-12">
                <img
                  src={book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80'}
                  alt={book.title}
                  className="w-64 h-96 object-cover rounded-xl shadow-2xl mb-8"
                />

                {/* Book Info */}
                <h2 className="font-fraunces text-3xl font-light text-center text-gray-900 mb-2 leading-tight">
                  {book.title}
                </h2>
                <p className="font-inter text-xl text-coral-light mb-6">
                  {book.author}
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-xs space-y-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-coral rounded-full"
                      style={{ width: `${book.percentage}%` }}
                    />
                  </div>
                  <p className="font-mono text-lg text-center text-gray-600">
                    Page {book.current_page} of {book.total_pages}
                  </p>
                </div>
              </div>

              {/* Shelfie Logo */}
              <div className="absolute bottom-8 right-8 opacity-40">
                <p className="font-fraunces text-lg text-gray-600">Shelfie</p>
              </div>
            </div>
          </div>

          {/* Share Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={generateImage}
              disabled={generating}
              className="bg-coral hover:bg-coral/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Download'}
            </Button>
            
            {canShare && (
              <Button
                onClick={shareViaWebShare}
                disabled={generating}
                variant="outline"
              >
                Share
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
