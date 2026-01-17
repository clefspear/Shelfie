import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  try {
    // Get user's currently reading books
    const { data: books } = await supabase
      .from("books")
      .select("title, author, cover_url, current_page, total_pages, percentage")
      .eq("user_id", userId)
      .eq("status", "reading")
      .order("updated_at", { ascending: false })
      .limit(5);

    // Get user info
    const { data: user } = await supabase
      .from("profiles")
      .select("display_name, avatar_config")
      .eq("id", userId)
      .single();

    // Get friends' currently reading
    const { data: friendships } = await supabase
      .from("friendships")
      .select("user_id, friend_id")
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq("status", "accepted");

    const friendIds =
      friendships?.map((f) =>
        f.user_id === userId ? f.friend_id : f.user_id,
      ) || [];

    let friendsReading: any[] = [];
    if (friendIds.length > 0) {
      const { data } = await supabase
        .from("books")
        .select(
          "title, author, cover_url, current_page, total_pages, percentage, profiles!inner(display_name, avatar_config)",
        )
        .in("user_id", friendIds)
        .eq("status", "reading")
        .order("updated_at", { ascending: false })
        .limit(4);

      friendsReading =
        data?.map((book) => ({
          friend_name: (book as any).profiles?.display_name,
          friend_avatar: (book as any).profiles?.avatar_config,
          title: book.title,
          cover_url: book.cover_url,
          current_page: book.current_page,
          total_pages: book.total_pages,
          progress_percent:
            book.percentage ||
            Math.round((book.current_page / book.total_pages) * 100),
        })) || [];
    }

    return NextResponse.json({
      user: {
        display_name: user?.display_name,
        avatar_config: user?.avatar_config,
      },
      currently_reading:
        books?.map((book) => ({
          ...book,
          progress_percent:
            book.percentage ||
            Math.round((book.current_page / book.total_pages) * 100),
        })) || [],
      friends_reading: friendsReading,
    });
  } catch (error: any) {
    console.error("Widget data error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
