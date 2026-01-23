"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Users,
  Share2,
  Crown,
  Smartphone,
  Palette,
  FileText,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Intersection Observer hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Animated Section Component
function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Staggered children animation
function StaggeredContainer({
  children,
  className,
}: {
  children: React.ReactNode[];
  className?: string;
}) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div ref={ref} className={className}>
      {children.map((child, idx) => (
        <div
          key={idx}
          className={cn(
            "transition-all duration-500 ease-out",
            isInView
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95",
          )}
          style={{ transitionDelay: `${idx * 100}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentScrollY;
      setScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream overflow-hidden">
      {/* Floating Navigation */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrollY > 50
            ? "bg-cream/80 backdrop-blur-lg shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/logo.png" alt="BookShelfie" className="h-8 w-auto" />
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 font-inter text-sm text-white bg-coral rounded-lg hover:bg-coral/90  hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 bg-coral/10 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-coral/5 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-coral/10 rounded-full text-coral font-inter text-sm mb-6">
                <Zap className="w-4 h-4" />
                Track any Book — Physical, Kindle, or PDF
              </span>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h1 className="font-fraunces text-5xl sm:text-6xl md:text-7xl font-light tracking-wide text-gray-900 mb-6">
                Your Reading Life,
                <br />
                <span className="text-coral relative">
                  Beautifully Simple
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-coral/30"
                    viewBox="0 0 200 12"
                    fill="currentColor"
                  >
                    <path
                      d="M0,8 Q50,0 100,8 T200,8"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                Track your reading progress with a beautiful iOS widget. Share
                with friends and celebrate every page turned.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="flex justify-center">
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center justify-center px-8 py-4 text-white bg-coral rounded-xl hover:bg-coral/90 transition-all font-inter font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Join the Waitlist
                  <BookOpen className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </div>

          {/* Hero Image with Parallax */}
          <AnimatedSection delay={400} className="mt-16">
            <div
              className="relative w-full max-w-3xl mx-auto"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
              <div className="bg-gradient-to-br from-cream to-[#FFF5ED] rounded-3xl p-8 border border-coral/10 shadow-2xl">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    {
                      img: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
                      title: "Pride and Prejudice",
                      progress: 25,
                    },
                    {
                      img: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
                      title: "1984",
                      progress: 50,
                    },
                    {
                      img: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
                      title: "The Great Gatsby",
                      progress: 75,
                    },
                  ].map((book, idx) => (
                    <div
                      key={idx}
                      className="space-y-3 transition-transform duration-300 hover:-translate-y-2"
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={book.img}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-coral to-[#FF8E8E] rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-coral/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-coral rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-fraunces text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="font-inter text-gray-600 text-lg">
              A beautiful reading companion that grows with you
            </p>
          </AnimatedSection>

          <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Smartphone className="w-7 h-7" />,
                title: "iOS Widget",
                description:
                  "Glanceable reading progress right on your home screen",
              },
              {
                icon: <BookOpen className="w-7 h-7" />,
                title: "Auto Page Count",
                description:
                  "We automatically find page counts from Open Library",
              },
              {
                icon: <Zap className="w-7 h-7" />,
                title: "Find Any Book",
                description: "Search for any book — physical, Kindle, or PDF",
              },
              {
                icon: <Share2 className="w-7 h-7" />,
                title: "Share Everywhere",
                description: "Instagram, Snapchat, X, TikTok, WhatsApp & more",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-4 text-coral group-hover:scale-110 group-hover:bg-coral group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="font-fraunces text-xl font-light text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="font-inter text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </StaggeredContainer>
        </div>
      </section>

      {/* Book Discovery Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-coral/10 rounded-full mb-4">
                <BookOpen className="w-4 h-4 text-coral" />
                <span className="text-sm font-inter text-coral font-medium">
                  Universal Search
                </span>
              </span>
              <h2 className="font-fraunces text-4xl font-light text-gray-900 mb-4">
                Find Any Book You're Reading
              </h2>
              <p className="font-inter text-gray-600 mb-6">
                Whether you're reading a physical book, Kindle ebook, or a PDF —
                just search and we'll find it. We automatically detect page
                counts so you can start tracking immediately.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: <BookOpen className="w-5 h-5" />,
                    text: "Physical books from any store",
                  },
                  {
                    icon: <Zap className="w-5 h-5" />,
                    text: "Kindle & ebook editions",
                  },
                  {
                    icon: <FileText className="w-5 h-5" />,
                    text: "PDF books and documents",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 font-inter text-gray-600"
                  >
                    <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center text-coral">
                      {item.icon}
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-coral/10">
                  <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-gray-50 rounded-xl">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="font-inter text-gray-400">
                      Search by title, author, or ISBN...
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        title: "The Great Gatsby",
                        author: "F. Scott Fitzgerald",
                        pages: 180,
                        cover:
                          "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg",
                      },
                      {
                        title: "1984",
                        author: "George Orwell",
                        pages: 328,
                        cover:
                          "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
                      },
                      {
                        title: "Pride and Prejudice",
                        author: "Jane Austen",
                        pages: 432,
                        cover:
                          "https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg",
                      },
                    ].map((book, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded-md shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="font-inter text-sm font-medium text-gray-900">
                            {book.title}
                          </p>
                          <p className="font-inter text-xs text-gray-500">
                            {book.author} • {book.pages} pages
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-coral/10 rounded-2xl" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* iOS Widget Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <AnimatedSection className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-coral/10 rounded-full mb-4">
                <Smartphone className="w-4 h-4 text-coral" />
                <span className="text-sm font-inter text-coral font-medium">
                  Coming to iOS
                </span>
              </span>
              <h2 className="font-fraunces text-4xl font-light text-gray-900 mb-4">
                Your Shelf, Always Visible
              </h2>
              <p className="font-inter text-gray-600 mb-6">
                The BookShelfie iOS widget brings your currently reading books
                to your home screen. See your progress at a glance, and stay
                motivated without opening an app.
              </p>
              <ul className="space-y-3 font-inter text-gray-600">
                {[
                  "Small, medium & large widget sizes",
                  "Real-time sync with web app",
                  "Friends activity in large widget",
                ].map((text, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-coral/20 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-coral"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={200} className="flex-1">
              <div className="bg-gradient-to-br from-cream to-[#FFF5ED] rounded-[32px] p-6 border border-coral/10 shadow-xl max-w-sm mx-auto hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="w-4 h-4 text-coral" />
                  <span className="text-xs font-inter text-gray-500">
                    iOS Widget Preview
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      name: "Sarah",
                      avatar: "🧑‍🦰",
                      avatarBg: "bg-pink-100",
                      book: "The Great Gatsby",
                      progress: 65,
                    },
                    {
                      name: "Marcus",
                      avatar: "👨🏽",
                      avatarBg: "bg-amber-100",
                      book: "Atomic Habits",
                      progress: 42,
                    },
                    {
                      name: "Emma",
                      avatar: "👩🏻",
                      avatarBg: "bg-purple-100",
                      book: "1984",
                      progress: 88,
                    },
                    {
                      name: "Jordan",
                      avatar: "🧑🏿",
                      avatarBg: "bg-green-100",
                      book: "Dune",
                      progress: 23,
                    },
                  ].map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/60"
                    >
                      <div
                        className={`w-8 h-8 rounded-full ${user.avatarBg} flex items-center justify-center text-base`}
                      >
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-inter font-medium text-gray-800 truncate">
                            {user.name}
                          </span>
                          <span className="text-xs font-mono text-coral ml-2">
                            {user.progress}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-coral to-[#FF8E8E] rounded-full transition-all"
                              style={{ width: `${user.progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[10px] font-inter text-gray-500 truncate block">
                          {user.book}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Social Sharing Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-fraunces text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Share Your Reading Journey
            </h2>
            <p className="font-inter text-gray-600 text-lg max-w-2xl mx-auto">
              Generate beautiful share cards for all your favorite platforms
            </p>
          </AnimatedSection>

          <div className="relative overflow-hidden">
            {/* Scrolling Platform Badges */}
            <div
              className="flex gap-4 whitespace-nowrap"
              style={{
                transform:
                  scrollDirection === "down"
                    ? `translateX(-${(scrollY / 10) % 100}px)`
                    : `translateX(-${(scrollY / 10) % 100}px)`,
              }}
            >
              {[
                {
                  name: "Instagram",
                  color: "from-purple-500 via-pink-500 to-orange-500",
                },
                { name: "Snapchat", color: "from-yellow-400 to-yellow-500" },
                { name: "X", color: "from-gray-800 to-black" },
                {
                  name: "TikTok",
                  color: "from-gray-900 via-pink-500 to-cyan-400",
                },
                { name: "WhatsApp", color: "from-green-500 to-green-600" },
                { name: "Threads", color: "from-gray-900 to-black" },
                // Duplicate for seamless scroll
                {
                  name: "Instagram",
                  color: "from-purple-500 via-pink-500 to-orange-500",
                },
                { name: "Snapchat", color: "from-yellow-400 to-yellow-500" },
                { name: "X", color: "from-gray-800 to-black" },
                {
                  name: "TikTok",
                  color: "from-gray-900 via-pink-500 to-cyan-400",
                },
                { name: "WhatsApp", color: "from-green-500 to-green-600" },
                { name: "Threads", color: "from-gray-900 to-black" },
              ].map((platform, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "inline-flex px-6 py-3 rounded-full text-white font-inter font-medium text-sm bg-gradient-to-r shadow-lg",
                    platform.color,
                  )}
                >
                  {platform.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-24 bg-gradient-to-br from-coral to-coral-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>

        <AnimatedSection className="max-w-4xl mx-auto px-6 text-center text-white relative z-10">
          <Crown className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="font-fraunces text-4xl md:text-5xl font-light mb-6">
            Go Premium
          </h2>
          <p className="font-inter text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Unlock unlimited books, advanced stats, and custom share themes for
            just $4.99/month
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-coral rounded-xl hover:bg-gray-50 transition-all font-inter font-medium text-lg shadow-xl hover:scale-105"
          >
            Join Waitlist for Early Access
          </Link>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-cream border-t border-coral/10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <p className="font-fraunces text-3xl font-light text-gray-900">
            BookShelfie
          </p>
          <p className="font-inter text-gray-600">Reading with Friends</p>
          <div className="pt-4">
            <a
              href="https://github.com/clefspear"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-inter text-sm transition-colors hover:bg-white rounded-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              Created by Peter Azmy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
