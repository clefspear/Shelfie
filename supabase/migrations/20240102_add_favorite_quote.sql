-- Add favorite quote and author fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS favorite_quote TEXT,
ADD COLUMN IF NOT EXISTS favorite_author TEXT;
