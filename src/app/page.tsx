import { createClient } from "../../supabase/server";
import { redirect } from 'next/navigation';
import LandingPage from './landing-page';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect to home
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      redirect('/home');
    } else {
      redirect('/onboarding');
    }
  }

  return <LandingPage />;
}
