import { redirect } from 'next/navigation';
import { createClient } from '../../../supabase/server';
import OnboardingContent from './onboarding-content';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if already onboarded
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    redirect('/home');
  }

  return (
    <div className="min-h-screen bg-cream">
      <OnboardingContent userId={user.id} userEmail={user.email || ''} />
    </div>
  );
}
