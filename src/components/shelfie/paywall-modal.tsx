'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { createClient } from '../../../supabase/client';
import { useState } from 'react';

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PaywallModal({ open, onOpenChange }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_premium',
          userId: user?.id
        })
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream border-coral/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fraunces text-3xl font-light text-gray-900 text-center">
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Premium Badge */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-coral to-coral-light flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Free Limit Message */}
          <div className="text-center">
            <p className="font-inter text-gray-600 mb-2">
              You've reached the free limit of 5 books
            </p>
            <p className="font-inter text-sm text-gray-500">
              Upgrade to add unlimited books to your shelf
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl p-6 space-y-4">
            <h3 className="font-fraunces text-xl font-light text-gray-900 mb-4">
              Premium Features
            </h3>
            
            {[
              'Unlimited books on your shelf',
              'Priority book recommendations',
              'Advanced reading statistics',
              'Custom share card themes',
              'Ad-free experience'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-coral/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-coral" />
                </div>
                <span className="font-inter text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="text-center bg-gradient-to-br from-coral to-coral-light rounded-xl p-6 text-white">
            <div className="font-fraunces text-4xl font-light mb-1">
              $4.99
            </div>
            <div className="font-inter text-sm opacity-90">
              per month
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-coral hover:bg-coral/90 text-white h-12 text-lg"
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
