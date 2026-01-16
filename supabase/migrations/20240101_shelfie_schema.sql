-- Shelfie schema for social reading tracker

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_config JSONB DEFAULT '{}',
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  open_library_id TEXT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  total_pages INTEGER NOT NULL,
  current_page INTEGER DEFAULT 0,
  percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'reading',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Friendships table
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS books_user_id_idx ON public.books(user_id);
CREATE INDEX IF NOT EXISTS books_status_idx ON public.books(status);
CREATE INDEX IF NOT EXISTS friendships_user_id_idx ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS friendships_friend_id_idx ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS friendships_status_idx ON public.friendships(status);
CREATE INDEX IF NOT EXISTS profiles_phone_number_idx ON public.profiles(phone_number);

-- Enable realtime for books table
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Books policies
DROP POLICY IF EXISTS "Users can view own books" ON public.books;
CREATE POLICY "Users can view own books" 
  ON public.books FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view friends books" ON public.books;
CREATE POLICY "Users can view friends books" 
  ON public.books FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.friendships 
      WHERE (user_id = auth.uid() AND friend_id = public.books.user_id AND status = 'accepted')
        OR (friend_id = auth.uid() AND user_id = public.books.user_id AND status = 'accepted')
    )
  );

DROP POLICY IF EXISTS "Users can insert own books" ON public.books;
CREATE POLICY "Users can insert own books" 
  ON public.books FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own books" ON public.books;
CREATE POLICY "Users can update own books" 
  ON public.books FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own books" ON public.books;
CREATE POLICY "Users can delete own books" 
  ON public.books FOR DELETE 
  USING (auth.uid() = user_id);

-- Friendships policies
DROP POLICY IF EXISTS "Users can view own friendships" ON public.friendships;
CREATE POLICY "Users can view own friendships" 
  ON public.friendships FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can create friendships" ON public.friendships;
CREATE POLICY "Users can create friendships" 
  ON public.friendships FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own friendship requests" ON public.friendships;
CREATE POLICY "Users can update own friendship requests" 
  ON public.friendships FOR UPDATE 
  USING (auth.uid() = friend_id);

-- Function to update book percentage
CREATE OR REPLACE FUNCTION update_book_percentage()
RETURNS TRIGGER AS $$
BEGIN
  NEW.percentage := ROUND((NEW.current_page::NUMERIC / NEW.total_pages::NUMERIC) * 100);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_book_percentage_trigger ON public.books;
CREATE TRIGGER update_book_percentage_trigger
  BEFORE INSERT OR UPDATE OF current_page, total_pages ON public.books
  FOR EACH ROW EXECUTE FUNCTION update_book_percentage();
