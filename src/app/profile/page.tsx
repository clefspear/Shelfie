import { redirect } from 'next/navigation';
import { createClient } from '../../../supabase/server';
import ShelfieLayout from '@/components/shelfie/shelfie-layout';
import BottomNav from '@/components/shelfie/bottom-nav';
import ProfileContent from './profile-content';

export default async function ProfilePage() {
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

  // Get book stats
  const { count: totalBooks } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { data: books } = await supabase
    .from('books')
    .select('current_page, total_pages')
    .eq('user_id', user.id);

  const totalPages = books?.reduce((sum, book) => sum + book.current_page, 0) || 0;

  return (
    <ShelfieLayout>
      <ProfileContent 
        profile={profile}
        stats={{
          totalBooks: totalBooks || 0,
          totalPages
        }}
      />
      <BottomNav />
    </ShelfieLayout>
  );
}
