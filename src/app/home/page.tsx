import { redirect } from 'next/navigation';
import { createClient } from '../../../supabase/server';
import ShelfieLayout from '@/components/shelfie/shelfie-layout';
import BottomNav from '@/components/shelfie/bottom-nav';
import HomeContent from './home-content';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  // Fetch user's books
  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'reading')
    .order('updated_at', { ascending: false });

  // Fetch friends activity
  const { data: friendships } = await supabase
    .from('friendships')
    .select(`
      friend_id,
      profiles!friendships_friend_id_fkey (
        display_name,
        avatar_config
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'accepted');

  const friendIds = friendships?.map(f => f.friend_id) || [];
  
  const { data: friendsBooks } = await supabase
    .from('books')
    .select(`
      *,
      profiles (
        display_name,
        avatar_config
      )
    `)
    .in('user_id', friendIds)
    .eq('status', 'reading')
    .order('updated_at', { ascending: false })
    .limit(5);

  return (
    <ShelfieLayout>
      <HomeContent 
        initialBooks={books || []} 
        friendsActivity={friendsBooks || []}
        profile={profile}
      />
      <BottomNav />
    </ShelfieLayout>
  );
}
