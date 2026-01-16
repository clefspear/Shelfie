'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, BookOpen, FileText, LogOut, Crown } from 'lucide-react';
import { createClient } from '../../../supabase/client';
import { useRouter } from 'next/navigation';
import AvatarCustomizerModal from '@/components/shelfie/avatar-customizer-modal';

interface ProfileContentProps {
  profile: any;
  stats: {
    totalBooks: number;
    totalPages: number;
  };
}

export default function ProfileContent({ profile, stats }: ProfileContentProps) {
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  const handleManageSubscription = async () => {
    // TODO: Open Stripe Customer Portal
    console.log('Manage subscription');
  };

  const isPremium = profile.subscription_status === 'premium';

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header with Avatar */}
      <div className="text-center">
        <div 
          onClick={() => setShowAvatarCustomizer(true)}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-coral to-coral-light mx-auto mb-4 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg"
        >
          <span className="text-4xl font-inter font-medium text-white">
            {profile.display_name[0]}
          </span>
        </div>
        
        <h1 className="font-fraunces text-3xl font-light tracking-wide text-gray-900 mb-1">
          {profile.display_name}
        </h1>
        
        {isPremium && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-coral to-coral-light text-white text-sm font-inter">
            <Crown className="w-4 h-4" />
            Premium Member
          </div>
        )}
        
        <p className="font-inter text-gray-500 text-sm mt-2">
          {profile.phone_number}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-coral/10 text-center">
          <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-coral" />
          </div>
          <div className="font-fraunces text-3xl font-light text-gray-900 mb-1">
            {stats.totalBooks}
          </div>
          <div className="font-inter text-sm text-gray-600">
            Books
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-coral/10 text-center">
          <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-coral" />
          </div>
          <div className="font-fraunces text-3xl font-light text-gray-900 mb-1">
            {stats.totalPages.toLocaleString()}
          </div>
          <div className="font-inter text-sm text-gray-600">
            Pages Read
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div>
        <h2 className="font-fraunces text-xl font-light text-gray-900 mb-4">
          Account
        </h2>
        
        <div className="space-y-3">
          <button 
            onClick={() => setShowAvatarCustomizer(true)}
            className="w-full bg-white rounded-xl p-4 border border-coral/10 hover:border-coral/30 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-coral" />
              </div>
              <span className="font-inter text-gray-900">
                Customize Avatar
              </span>
            </div>
          </button>

          {isPremium && (
            <button 
              onClick={handleManageSubscription}
              className="w-full bg-white rounded-xl p-4 border border-coral/10 hover:border-coral/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-coral" />
                </div>
                <span className="font-inter text-gray-900">
                  Manage Subscription
                </span>
              </div>
            </button>
          )}

          <button 
            onClick={handleSignOut}
            className="w-full bg-white rounded-xl p-4 border border-coral/10 hover:border-red-200 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <span className="font-inter text-gray-900">
                Sign Out
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Upgrade CTA for Free Users */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-coral to-coral-light rounded-2xl p-6 text-white text-center">
          <Crown className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h3 className="font-fraunces text-2xl font-light mb-2">
            Upgrade to Premium
          </h3>
          <p className="font-inter text-sm opacity-90 mb-4">
            Unlock unlimited books and exclusive features
          </p>
          <Button 
            className="bg-white text-coral hover:bg-gray-50"
            onClick={() => router.push('/search')}
          >
            Learn More
          </Button>
        </div>
      )}

      {/* Avatar Customizer Modal */}
      <AvatarCustomizerModal
        open={showAvatarCustomizer}
        onOpenChange={setShowAvatarCustomizer}
        profile={profile}
      />
    </div>
  );
}
