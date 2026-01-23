import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Check if this is a static asset request
  if (
    request.nextUrl.pathname.startsWith("/favicon.ico") ||
    request.nextUrl.pathname.startsWith("/logo.png") ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    // Serve static assets without authentication check
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect authenticated users from landing page to home
  if (request.nextUrl.pathname === "/" && user && !error) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return response;
};
