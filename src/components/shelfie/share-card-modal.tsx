'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, Copy, ExternalLink } from 'lucide-react';

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

const sharePlatforms = [
  { 
    name: 'Instagram', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    color: 'from-purple-500 via-pink-500 to-orange-500',
    action: 'download'
  },
  { 
    name: 'Snapchat', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
      </svg>
    ),
    color: 'from-yellow-400 to-yellow-500',
    action: 'download'
  },
  { 
    name: 'X (Twitter)', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'from-gray-800 to-black',
    action: 'twitter'
  },
  { 
    name: 'Threads', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.73 2.115-1.146 3.476-1.17.932-.016 1.79.1 2.564.346.025-.89-.021-1.703-.145-2.398l2.07-.37c.172.96.227 2.063.166 3.278 1.07.596 1.876 1.327 2.396 2.177.755 1.234.933 2.806.5 4.425-.614 2.294-2.062 4.07-4.07 4.99-1.618.74-3.57 1.105-5.787 1.085zm-.074-7.994c-.94.017-1.756.255-2.298.672-.465.357-.71.823-.688 1.313.022.425.234.815.613 1.13.484.4 1.168.61 1.925.59 1.168-.035 2.025-.39 2.551-1.054.436-.55.71-1.345.818-2.37-.848-.2-1.782-.3-2.921-.281z"/>
      </svg>
    ),
    color: 'from-gray-900 to-black',
    action: 'download'
  },
  { 
    name: 'TikTok', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    color: 'from-gray-900 via-pink-500 to-cyan-400',
    action: 'download'
  },
  { 
    name: 'WhatsApp', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: 'from-green-500 to-green-600',
    action: 'whatsapp'
  },
];

export default function ShareCardModal({
  open,
  onOpenChange,
  book,
  user
}: ShareCardModalProps) {
  const [format, setFormat] = useState<'stories' | 'feed'>('stories');
  const [generating, setGenerating] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#FFF9F5',
        logging: false
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      return blob;
    } catch (error) {
      console.error('Failed to generate image:', error);
      return null;
    }
  };

  const downloadImage = async () => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shelfie-${book.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  };

  const shareViaPlatform = async (platform: typeof sharePlatforms[0]) => {
    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;

      const shareText = `I'm ${book.percentage}% through "${book.title}" by ${book.author} 📚`;
      
      if (platform.action === 'twitter') {
        // Open Twitter/X with pre-filled text
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, '_blank');
        // Also download the image for them to attach
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `shelfie-${book.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (platform.action === 'whatsapp') {
        // Open WhatsApp with pre-filled text
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
        // Download image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `shelfie-${book.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // For platforms that don't have direct share API, download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `shelfie-${book.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setGenerating(false);
    }
  };

  const shareViaWebShare = async () => {
    if (!cardRef.current) return;

    setGenerating(true);
    try {
      const blob = await generateImage();
      if (!blob) return;

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

  const copyShareText = () => {
    const text = `I'm ${book.percentage}% through "${book.title}" by ${book.author} 📚 #Shelfie #reading`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dimensions = format === 'stories' 
    ? { width: 270, height: 480 } 
    : { width: 300, height: 300 };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream border-coral/20 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-fraunces text-2xl font-light text-gray-900">
            Share Your Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Format Selector */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={format === 'stories' ? 'default' : 'outline'}
              onClick={() => setFormat('stories')}
              className={format === 'stories' ? 'bg-coral hover:bg-coral/90' : ''}
            >
              Stories (9:16)
            </Button>
            <Button
              size="sm"
              variant={format === 'feed' ? 'default' : 'outline'}
              onClick={() => setFormat('feed')}
              className={format === 'feed' ? 'bg-coral hover:bg-coral/90' : ''}
            >
              Feed (1:1)
            </Button>
          </div>

          {/* Card Preview */}
          <div className="flex justify-center bg-gray-100 rounded-xl p-4">
            <div
              ref={cardRef}
              style={{ 
                width: dimensions.width, 
                height: dimensions.height 
              }}
              className="bg-cream relative overflow-hidden shadow-xl rounded-xl"
            >
              {/* User Avatar */}
              <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
                <span className="text-lg font-inter font-medium text-coral">
                  {user.display_name[0]}
                </span>
              </div>

              {/* Book Cover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                <img
                  src={book.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80'}
                  alt={book.title}
                  className={format === 'stories' ? "w-32 h-48 object-cover rounded-lg shadow-xl mb-4" : "w-24 h-36 object-cover rounded-lg shadow-xl mb-3"}
                />

                {/* Book Info */}
                <h2 className={`font-fraunces font-light text-center text-gray-900 mb-1 leading-tight ${format === 'stories' ? 'text-xl' : 'text-lg'}`}>
                  {book.title}
                </h2>
                <p className={`font-inter text-coral-light mb-3 ${format === 'stories' ? 'text-sm' : 'text-xs'}`}>
                  {book.author}
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-[180px] space-y-2">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-coral to-[#FF8E8E] rounded-full"
                      style={{ width: `${book.percentage}%` }}
                    />
                  </div>
                  <p className="font-mono text-xs text-center text-gray-600">
                    {book.percentage}% • Page {book.current_page} of {book.total_pages}
                  </p>
                </div>
              </div>

              {/* Shelfie Logo */}
              <div className="absolute bottom-3 right-3 opacity-40">
                <p className="font-fraunces text-sm text-gray-600">Shelfie</p>
              </div>
            </div>
          </div>

          {/* Share to Platforms */}
          <div>
            <label className="block text-sm font-inter text-gray-700 mb-3 font-medium">
              Share to
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sharePlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => shareViaPlatform(platform)}
                  disabled={generating}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br ${platform.color} text-white hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50`}
                >
                  {platform.icon}
                  <span className="text-xs font-inter font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              onClick={downloadImage}
              disabled={generating}
              className="flex-1 bg-coral hover:bg-coral/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Download'}
            </Button>
            
            <Button
              onClick={copyShareText}
              variant="outline"
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Text'}
            </Button>
          </div>

          {/* Native Share (Mobile) */}
          {canShare && (
            <Button
              onClick={shareViaWebShare}
              disabled={generating}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              More Options...
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
