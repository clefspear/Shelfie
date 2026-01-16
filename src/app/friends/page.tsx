import { redirect } from 'next/navigation';
import { createClient } from '../../../supabase/server';
import ShelfieLayout from '@/components/shelfie/shelfie-layout';
import BottomNav from '@/components/shelfie/bottom-nav';
import FriendsContent from './friends-content';

export default async function FriendsPage() {
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

  // Fetch friendships
  const { data: friendships } = await supabase
    .from('friendships')
    .select(`
      *,
      friend:profiles!friendships_friend_id_fkey (
        id,
        display_name,
        avatar_config,
        phone_number
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch pending requests to user
  const { data: pendingRequests } = await supabase
    .from('friendships')
    .select(`
      *,
      requester:profiles!friendships_user_id_fkey (
        id,
        display_name,
        avatar_config,
        phone_number
      )
    `)
    .eq('friend_id', user.id)
    .eq('status', 'pending');

  // Fetch friends' books
  const acceptedFriendIds = friendships?.filter(f => f.status === 'accepted').map(f => f.friend_id) || [];
  
  const { data: friendsBooks } = await supabase
    .from('books')
    .select(`
      *,
      profiles (
        display_name,
        avatar_config
      )
    `)
    .in('user_id', acceptedFriendIds)
    .eq('status', 'reading')
    .order('updated_at', { ascending: false });

  return (
    <ShelfieLayout>
      <FriendsContent 
        friendships={friendships || []}
        pendingRequests={pendingRequests || []}
        friendsBooks={friendsBooks || []}
      />
      <BottomNav />
    </ShelfieLayout>
  );
}
