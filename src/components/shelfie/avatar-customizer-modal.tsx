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
  { name: 'Blue', value: '#4ECDC4', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Purple', value: '#9B59B6', gradient: 'from-purple-400 to-purple-600' },
  { name: 'Green', value: '#2ECC71', gradient: 'from-green-400 to-green-600' },
  { name: 'Orange', value: '#F39C12', gradient: 'from-orange-400 to-orange-600' },
  { name: 'Pink', value: '#E91E63', gradient: 'from-pink-400 to-pink-600' }
];

export default function AvatarCustomizerModal({ 
  open, 
  onOpenChange,
  profile 
}: AvatarCustomizerModalProps) {
  const [selectedColor, setSelectedColor] = useState(avatarColors[0]);
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
            gradient: selectedColor.gradient 
          } 
        })
        .eq('id', profile.id);

      if (!error) {
        onOpenChange(false);
        window.location.reload(); // Refresh to show new avatar
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream border-coral/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fraunces text-2xl font-light text-gray-900">
            Customize Avatar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div 
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all",
                `bg-gradient-to-br ${selectedColor.gradient}`
              )}
            >
              <span className="text-5xl font-inter font-medium text-white">
                {profile.display_name[0]}
              </span>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-inter text-gray-600 mb-3">
              Choose Color
            </label>
            <div className="grid grid-cols-3 gap-3">
              {avatarColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "relative rounded-xl p-4 border-2 transition-all",
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
                    <div className="absolute top-1 right-1 w-6 h-6 bg-coral rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
