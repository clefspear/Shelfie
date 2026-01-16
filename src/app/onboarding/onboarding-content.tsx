'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createClient } from '../../../supabase/client';
import { useRouter } from 'next/navigation';
import { BookOpen, User, Sparkles } from 'lucide-react';

interface OnboardingContentProps {
  userId: string;
  userEmail: string;
}

const avatarColors = [
  { name: 'Coral', gradient: 'from-coral to-coral-light' },
  { name: 'Blue', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Purple', gradient: 'from-purple-400 to-purple-600' },
  { name: 'Green', gradient: 'from-green-400 to-green-600' }
];

export default function OnboardingContent({ userId, userEmail }: OnboardingContentProps) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedColor, setSelectedColor] = useState(avatarColors[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          phone_number: phoneNumber,
          display_name: displayName,
          avatar_config: {
            gradient: selectedColor.gradient
          }
        });

      if (!error) {
        router.push('/home');
      } else {
        console.error('Failed to create profile:', error);
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                s === step ? "bg-coral w-8" : "bg-gray-300"
              )}
            />
          ))}
        </div>

        {/* Step 1: Phone Number */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-coral" />
              </div>
              <h1 className="font-fraunces text-5xl font-light tracking-wide text-gray-900 mb-4">
                Welcome to Shelfie
              </h1>
              <p className="font-inter text-gray-600 text-lg">
                Let's set up your reading profile
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-inter text-gray-600 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-14 text-lg font-mono bg-white border-coral/20 focus:border-coral"
                />
                <p className="text-xs font-inter text-gray-500 mt-2">
                  Used to connect with friends
                </p>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!phoneNumber}
                className="w-full h-14 bg-coral hover:bg-coral/90 text-white text-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Display Name */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-coral" />
              </div>
              <h1 className="font-fraunces text-4xl font-light tracking-wide text-gray-900 mb-4">
                What should we call you?
              </h1>
              <p className="font-inter text-gray-600">
                This name will be visible to your friends
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-inter text-gray-600 mb-2">
                  Display Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-14 text-lg font-inter bg-white border-coral/20 focus:border-coral"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-14"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!displayName}
                  className="flex-1 h-14 bg-coral hover:bg-coral/90 text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Avatar Customization */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-coral" />
              </div>
              <h1 className="font-fraunces text-4xl font-light tracking-wide text-gray-900 mb-4">
                Personalize Your Avatar
              </h1>
              <p className="font-inter text-gray-600">
                Choose a color that represents you
              </p>
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center">
              <div 
                className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all",
                  `bg-gradient-to-br ${selectedColor.gradient}`
                )}
              >
                <span className="text-5xl font-inter font-medium text-white">
                  {displayName[0]?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-inter text-gray-600 mb-3 text-center">
                Choose Your Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {avatarColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "relative rounded-xl p-3 border-2 transition-all hover:scale-105",
                      selectedColor.name === color.name
                        ? "border-coral scale-105"
                        : "border-transparent"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-full aspect-square rounded-lg bg-gradient-to-br",
                        color.gradient
                      )}
                    />
                    {selectedColor.name === color.name && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-coral rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 h-14"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 h-14 bg-coral hover:bg-coral/90 text-white"
              >
                {loading ? 'Creating Profile...' : 'Get Started'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
