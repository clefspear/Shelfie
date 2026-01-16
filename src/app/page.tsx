import { createClient } from "../../supabase/server";
import { redirect } from 'next/navigation';
import { BookOpen, Users, Share2, Crown } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect to home
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      redirect('/home');
    } else {
      redirect('/onboarding');
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="font-fraunces text-6xl sm:text-7xl font-light tracking-wide text-gray-900 mb-6">
              Your Reading Life,
              <br />
              <span className="text-coral">Beautifully Simple</span>
            </h1>
            <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Track your reading progress, share with friends, and celebrate every page turned.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 text-white bg-coral rounded-xl hover:bg-coral/90 transition-all font-inter font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Reading
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center px-8 py-4 text-gray-900 bg-white rounded-xl hover:bg-gray-50 transition-all font-inter font-medium text-lg border border-coral/20"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-3xl">
              <div className="bg-gradient-to-br from-cream to-[#FFF5ED] rounded-2xl p-8 border border-coral/10 shadow-2xl">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
                    'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&q=80',
                    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80'
                  ].map((img, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                        <img src={img} alt="Book cover" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-coral rounded-full" style={{ width: `${(idx + 1) * 25}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-fraunces text-5xl font-light text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="font-inter text-gray-600 text-lg">
              A beautiful reading companion that grows with you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Track Your Progress",
                description: "Beautiful visual progress bars and reading statistics that motivate you to keep going."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Connect With Friends",
                description: "See what your friends are reading and get inspired by their book choices."
              },
              {
                icon: <Share2 className="w-8 h-8" />,
                title: "Share Your Journey",
                description: "Create stunning share cards to celebrate your reading milestones on social media."
              }
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-6 text-coral">
                  {feature.icon}
                </div>
                <h3 className="font-fraunces text-2xl font-light text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="font-inter text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-24 bg-gradient-to-br from-coral to-coral-light">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <Crown className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="font-fraunces text-5xl font-light mb-6">
            Go Premium
          </h2>
          <p className="font-inter text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Unlock unlimited books, advanced stats, and custom share themes for just $4.99/month
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-coral rounded-xl hover:bg-gray-50 transition-all font-inter font-medium text-lg shadow-xl"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-cream border-t border-coral/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-fraunces text-3xl font-light text-gray-900 mb-4">
            Shelfie
          </p>
          <p className="font-inter text-gray-600">
            Your reading companion
          </p>
        </div>
      </footer>
    </div>
  );
}
