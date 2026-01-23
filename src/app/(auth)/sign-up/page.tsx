import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
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
            Join the waitlist for early access
          </p>
        </div>

        <div className="rounded-2xl border border-coral/20 bg-white p-8 shadow-lg">
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="font-fraunces text-3xl font-light tracking-tight text-gray-900">
                Join the Waitlist
              </h2>
              <p className="text-sm font-inter text-gray-600">
                Already have an account?{" "}
                <Link
                  className="text-coral font-medium hover:underline transition-all"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="full_name"
                  className="text-sm font-inter font-medium"
                >
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full h-12 border-coral/20 focus:border-coral"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-inter font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full h-12 border-coral/20 focus:border-coral"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone_number"
                  className="text-sm font-inter font-medium"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                  className="w-full h-12 border-coral/20 focus:border-coral"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-inter font-medium"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  className="w-full h-12 border-coral/20 focus:border-coral"
                />
              </div>
            </div>

            <SubmitButton
              formAction={signUpAction}
              pendingText="Joining waitlist..."
              className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-inter font-medium"
            >
              Join the Waitlist
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </div>
        <SmtpMessage />
      </div>
    </div>
  );
}
