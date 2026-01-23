import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="BookShelfie" className="h-16 w-auto" />
          </div>
          <p className="font-inter text-gray-600">
            Welcome back to your reading journey
          </p>
        </div>

        <div className="rounded-2xl border border-coral/20 bg-white p-8 shadow-lg">
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="font-fraunces text-3xl font-light tracking-tight text-gray-900">
                Sign in
              </h2>
              <p className="text-sm font-inter text-gray-600">
                Don't have an account?{" "}
                <Link
                  className="text-coral font-medium hover:underline transition-all"
                  href="/sign-up"
                >
                  Join the Waitlist
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-inter font-medium"
                >
                  Email or Phone Number
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="you@example.com or +1 (555) 123-4567"
                  required
                  className="w-full h-12 border-coral/20 focus:border-coral"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-sm font-inter font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    className="text-xs font-inter text-gray-500 hover:text-coral hover:underline transition-all"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  required
                  className="w-full h-12 border-coral/20 focus:border-coral"
                />
              </div>
            </div>

            <SubmitButton
              className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-inter font-medium"
              pendingText="Signing in..."
              formAction={signInAction}
            >
              Sign in
            </SubmitButton>

            <FormMessage message={message} />
          </form>
        </div>
      </div>
    </div>
  );
}
