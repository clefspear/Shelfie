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

  // Fetch accepted friendships with friend profiles
  const { data: friendships } = await supabase
    .from('friendships')
    .select(`
      friend_id,
      profiles!friendships_friend_id_fkey (
        id,
        display_name,
        avatar_config
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'accepted');

  const friendIds = friendships?.map(f => f.friend_id) || [];
  
  // Fetch friends' currently reading books
  const { data: friendsBooks } = await supabase
    .from('books')
    .select(`
      *,
      profiles (
        id,
        display_name,
        avatar_config
      )
    `)
    .in('user_id', friendIds)
    .eq('status', 'reading')
    .order('updated_at', { ascending: false })
    .limit(10);

  // Transform to FriendWithBook format for widget
  const friendsWithBooks = friendsBooks?.map(book => ({
    id: book.id,
    user_id: book.user_id,
    display_name: book.profiles?.display_name || 'Unknown',
    avatar_config: book.profiles?.avatar_config || {},
    book: {
      id: book.id,
      cover_url: book.cover_url,
      title: book.title,
      author: book.author,
      percentage: book.percentage,
      current_page: book.current_page,
      total_pages: book.total_pages
    }
  })) || [];

  return (
    <ShelfieLayout>
      <HomeContent 
        initialBooks={books || []} 
        friendsWithBooks={friendsWithBooks}
        profile={profile}
      />
      <BottomNav />
    </ShelfieLayout>
  );
}
