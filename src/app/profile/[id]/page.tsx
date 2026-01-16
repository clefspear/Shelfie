import { redirect } from 'next/navigation';
import { createClient } from '../../../../supabase/server';
import ShelfieLayout from '@/components/shelfie/shelfie-layout';
import BottomNav from '@/components/shelfie/bottom-nav';
import FriendProfileContent from './friend-profile-content';

interface PageProps {
  params: { id: string };
}

export default async function FriendProfilePage({ params }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Fetch friend's profile
  const { data: friendProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!friendProfile) {
    redirect('/home');
  }

  // Fetch friend's currently reading books
  const { data: currentlyReading } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', params.id)
    .eq('status', 'reading')
    .order('updated_at', { ascending: false })
    .limit(3);

  // Fetch friend's completed books (top books)
  const { data: completedBooks } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', params.id)
    .eq('status', 'completed')
    .order('updated_at', { ascending: false })
    .limit(5);

  return (
    <ShelfieLayout>
      <FriendProfileContent 
        friendProfile={friendProfile}
        currentlyReading={currentlyReading || []}
        topBooks={completedBooks || []}
      />
      <BottomNav />
    </ShelfieLayout>
  );
}
