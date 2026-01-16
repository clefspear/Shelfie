'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { createClient } from '../../../supabase/client';
import { useRouter } from 'next/navigation';
import { BookOpen, User, Sparkles, ArrowRight, ArrowLeft, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface OnboardingContentProps {
  userId: string;
  userEmail: string;
}

const avatarColors = [
  { name: 'Coral', gradient: 'from-coral to-coral-light' },
  { name: 'Ocean', gradient: 'from-teal-400 to-cyan-500' },
  { name: 'Lavender', gradient: 'from-purple-400 to-violet-500' },
  { name: 'Mint', gradient: 'from-emerald-400 to-green-500' },
  { name: 'Sunset', gradient: 'from-amber-400 to-orange-500' },
  { name: 'Rose', gradient: 'from-pink-400 to-rose-500' },
];

const avatarImages = [
  { name: 'Reader', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Cozy', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Creative', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { name: 'Studious', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
];

export default function OnboardingContent({ userId, userEmail }: OnboardingContentProps) {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedColor, setSelectedColor] = useState(avatarColors[0]);
  const [selectedImage, setSelectedImage] = useState<typeof avatarImages[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const isStep1Valid = () => {
    return displayName.trim() && phoneNumber.trim() && password && confirmPassword && password === confirmPassword;
  };

  const handleStep1Continue = () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    try {
      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordError) {
        console.error('Failed to update password:', passwordError);
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          display_name: displayName,
          phone_number: phoneNumber,
          avatar_config: {
            gradient: selectedColor.gradient,
            image: selectedImage?.url || null
          }
        });

      if (!profileError) {
        router.push('/home');
      } else {
        console.error('Failed to create profile:', profileError);
        setError('Failed to create profile. Please try again.');
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Progress Bar at Top */}
      <div className="sticky top-0 bg-cream/80 backdrop-blur-sm z-10 px-6 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-inter text-gray-500">
              Step {step} of {totalSteps}
            </span>
            <span className="text-xs font-inter text-coral font-medium">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Step 1: Account Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-6">
                  <User className="w-8 h-8 text-coral" />
                </div>
                <h1 className="font-fraunces text-3xl font-light tracking-wide text-gray-900 mb-3">
                  Let's set up your account
                </h1>
                <p className="font-inter text-gray-500 text-sm">
                  Fill in your details to get started
                </p>
              </div>

              <div className="space-y-4">
                {/* Email (read-only) */}
                <div>
                  <label className="block text-xs font-inter text-gray-500 mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      value={userEmail}
                      disabled
                      className="h-12 pl-12 font-inter bg-gray-100 border-coral/20 text-gray-500"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs font-inter text-gray-500 mb-1.5 uppercase tracking-wide">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="h-12 pl-12 font-inter bg-white border-coral/20 focus:border-coral"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-inter text-gray-500 mb-1.5 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12 pl-12 font-inter bg-white border-coral/20 focus:border-coral"
                    />
                  </div>
                  <p className="text-xs font-inter text-gray-400 mt-1">
                    Used to connect with friends
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-inter text-gray-500 mb-1.5 uppercase tracking-wide">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 pr-12 font-inter bg-white border-coral/20 focus:border-coral"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-inter text-gray-500 mb-1.5 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        "h-12 pl-12 pr-12 font-inter bg-white border-coral/20 focus:border-coral",
                        confirmPassword && password !== confirmPassword && "border-red-400 focus:border-red-400"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs font-inter text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-sm font-inter text-red-500 text-center bg-red-50 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleStep1Continue}
                  disabled={!isStep1Valid()}
                  className="w-full h-14 bg-coral hover:bg-coral/90 text-white text-lg group mt-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Avatar Customization */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-coral" />
                </div>
                <h1 className="font-fraunces text-3xl font-light tracking-wide text-gray-900 mb-3">
                  Create your avatar
                </h1>
                <p className="font-inter text-gray-500 text-sm">
                  This syncs to your iOS widget too!
                </p>
              </div>

              {/* Avatar Preview */}
              <div className="flex flex-col items-center py-4">
                <div 
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden ring-4 ring-white",
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
                    <span className="text-3xl font-inter font-medium text-white drop-shadow-sm">
                      {displayName[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-sm font-inter text-gray-600 mt-3 font-medium">
                  {displayName}
                </p>
              </div>

              {/* Photo Selection */}
              <div>
                <label className="block text-xs font-inter text-gray-500 mb-2 uppercase tracking-wide">
                  Choose a photo (optional)
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className={cn(
                      "flex-shrink-0 w-14 h-14 rounded-xl border-2 transition-all overflow-hidden",
                      !selectedImage ? "border-coral scale-105" : "border-transparent hover:border-coral/30"
                    )}
                  >
                    <div className={cn(
                      "w-full h-full bg-gradient-to-br flex items-center justify-center",
                      selectedColor.gradient
                    )}>
                      <span className="text-xl font-inter font-medium text-white">
                        {displayName[0]?.toUpperCase()}
                      </span>
                    </div>
                  </button>
                  {avatarImages.map((image) => (
                    <button
                      key={image.name}
                      onClick={() => setSelectedImage(image)}
                      className={cn(
                        "flex-shrink-0 w-14 h-14 rounded-xl border-2 transition-all overflow-hidden",
                        selectedImage?.name === image.name ? "border-coral scale-105" : "border-transparent hover:border-coral/30"
                      )}
                    >
                      <img src={image.url} alt={image.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-inter text-gray-500 mb-2 uppercase tracking-wide">
                  {selectedImage ? 'Border color' : 'Background color'}
                </label>
                <div className="flex gap-2">
                  {avatarColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "flex-1 aspect-square rounded-xl border-2 transition-all",
                        selectedColor.name === color.name
                          ? "border-coral scale-105 shadow-md"
                          : "border-transparent hover:scale-105"
                      )}
                    >
                      <div className={cn(
                        "w-full h-full rounded-lg bg-gradient-to-br",
                        color.gradient
                      )} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-14 px-6"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 h-14 bg-coral hover:bg-coral/90 text-white text-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Get Started
                      <BookOpen className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BookShelfie Branding */}
      <div className="py-6 text-center">
        <p className="font-fraunces text-xl text-gray-400">BookShelfie</p>
      </div>
    </div>
  );
}
