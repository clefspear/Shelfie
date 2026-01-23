import { verifyOtpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function VerifyOTP(props: {
  searchParams: Promise<Message & { phone?: string }>;
}) {
  const searchParams = await props.searchParams;
  const phoneFromUrl = searchParams.phone;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="BookShelfie" className="h-16 w-auto" />
          </div>
          <p className="font-inter text-gray-600">Verify your phone number</p>
        </div>

        <div className="rounded-2xl border border-coral/20 bg-white p-8 shadow-lg">
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="font-fraunces text-3xl font-light tracking-tight text-gray-900">
                Enter Verification Code
              </h2>
              <p className="text-sm font-inter text-gray-600">
                We sent a 6-digit code to your phone number
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-inter font-medium"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  defaultValue={phoneFromUrl || ""}
                  required
                  className="w-full h-12 border-coral/20 focus:border-coral"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="token"
                  className="text-sm font-inter font-medium"
                >
                  Verification Code
                </Label>
                <Input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full h-12 border-coral/20 focus:border-coral text-center text-lg font-mono"
                />
              </div>
            </div>

            <SubmitButton
              formAction={verifyOtpAction}
              pendingText="Verifying..."
              className="w-full h-12 bg-coral hover:bg-coral/90 text-white font-inter font-medium"
            >
              Verify & Sign In
            </SubmitButton>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Didn't receive a code?{" "}
                <button
                  type="button"
                  className="text-coral hover:underline transition-all"
                  onClick={() => window.location.reload()}
                >
                  Resend code
                </button>
              </p>
              <Link
                className="text-sm text-gray-500 hover:text-coral hover:underline transition-all block"
                href="/sign-in"
              >
                Back to Sign In
              </Link>
            </div>

            <FormMessage message={searchParams} />
          </form>
        </div>
      </div>
    </div>
  );
}
