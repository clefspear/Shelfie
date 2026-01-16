'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createClient } from '../../../supabase/client';
import { cn } from '@/lib/utils';

interface AvatarCustomizerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
}

const avatarColors = [
  { name: 'Coral', value: '#FF6B6B', gradient: 'from-coral to-coral-light' },
  { name: 'Ocean', value: '#4ECDC4', gradient: 'from-teal-400 to-cyan-500' },
  { name: 'Lavender', value: '#9B59B6', gradient: 'from-purple-400 to-violet-500' },
  { name: 'Mint', value: '#2ECC71', gradient: 'from-emerald-400 to-green-500' },
  { name: 'Sunset', value: '#F39C12', gradient: 'from-amber-400 to-orange-500' },
  { name: 'Rose', value: '#E91E63', gradient: 'from-pink-400 to-rose-500' },
  { name: 'Midnight', value: '#2C3E50', gradient: 'from-slate-600 to-indigo-700' },
  { name: 'Gold', value: '#F1C40F', gradient: 'from-yellow-400 to-amber-500' },
  { name: 'Berry', value: '#8E44AD', gradient: 'from-fuchsia-500 to-purple-600' }
];

const avatarImages = [
  { name: 'Reader', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Cozy', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Creative', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { name: 'Studious', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
  { name: 'Chill', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  { name: 'Bold', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80' },
];

export default function AvatarCustomizerModal({ 
  open, 
  onOpenChange,
  profile 
}: AvatarCustomizerModalProps) {
  const [selectedColor, setSelectedColor] = useState(avatarColors[0]);
  const [selectedImage, setSelectedImage] = useState<typeof avatarImages[0] | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_config: { 
            color: selectedColor.value,
            gradient: selectedColor.gradient,
            image: selectedImage?.url || null
          } 
        })
        .eq('id', profile.id);

      if (!error) {
        onOpenChange(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream border-coral/20 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-fraunces text-2xl font-light text-gray-900">
            Customize Avatar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <div 
              className={cn(
                "w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 overflow-hidden",
                `bg-gradient-to-br ${selectedColor.gradient}`
              )}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-inter font-medium text-white drop-shadow-sm">
                  {profile.display_name[0]}
                </span>
              )}
            </div>
            <p className="text-sm font-inter text-gray-500 mt-3">
              {profile.display_name}
            </p>
            <p className="text-xs font-inter text-gray-400 mt-1">
              Your avatar syncs to your iOS widget
            </p>
          </div>

          {/* Photo Selection */}
          <div>
            <label className="block text-sm font-inter text-gray-700 mb-3 font-medium">
              Choose a Photo (Optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedImage(null)}
                className={cn(
                  "relative rounded-xl p-2 border-2 transition-all",
                  !selectedImage
                    ? "border-coral scale-105"
                    : "border-transparent hover:scale-105"
                )}
              >
                <div 
                  className={cn(
                    "w-full aspect-square rounded-lg bg-gradient-to-br flex items-center justify-center",
                    selectedColor.gradient
                  )}
                >
                  <span className="text-2xl font-inter font-medium text-white">
                    {profile.display_name[0]}
                  </span>
                </div>
                <p className="text-xs font-inter text-gray-600 text-center mt-2">
                  Initial
                </p>
              </button>
              {avatarImages.map((image) => (
                <button
                  key={image.name}
                  onClick={() => setSelectedImage(image)}
                  className={cn(
                    "relative rounded-xl p-2 border-2 transition-all",
                    selectedImage?.name === image.name
                      ? "border-coral scale-105"
                      : "border-transparent hover:scale-105"
                  )}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-inter text-gray-600 text-center mt-2">
                    {image.name}
                  </p>
                  
                  {selectedImage?.name === image.name && (
                    <div className="absolute top-0 right-0 w-6 h-6 bg-coral rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-inter text-gray-700 mb-3 font-medium">
              {selectedImage ? 'Border Color' : 'Background Color'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {avatarColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "relative rounded-xl p-3 border-2 transition-all",
                    selectedColor.name === color.name
                      ? "border-coral scale-105"
                      : "border-transparent hover:scale-105"
                  )}
                >
                  <div 
                    className={cn(
                      "w-full aspect-square rounded-lg bg-gradient-to-br",
                      color.gradient
                    )}
                  />
                  <p className="text-xs font-inter text-gray-600 text-center mt-2">
                    {color.name}
                  </p>
                  
                  {selectedColor.name === color.name && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-coral rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
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
              disabled={saving}
              className="flex-1 bg-coral hover:bg-coral/90 text-white"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
