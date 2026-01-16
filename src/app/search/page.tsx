import { redirect } from 'next/navigation';
import { createClient } from '../../../supabase/server';
import ShelfieLayout from '@/components/shelfie/shelfie-layout';
import BottomNav from '@/components/shelfie/bottom-nav';
import SearchContent from './search-content';

export default async function SearchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  // Count user's books
  const { count } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return (
    <ShelfieLayout>
      <SearchContent 
        profile={profile}
        bookCount={count || 0}
      />
      <BottomNav />
    </ShelfieLayout>
  );
}
