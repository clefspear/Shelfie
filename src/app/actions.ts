"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const phoneNumber = formData.get("phone_number")?.toString() || "";
  const supabase = await createClient();

  if (!email || !password || !phoneNumber) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email, phone number, and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    phone: phoneNumber,
    options: {
      data: {
        full_name: fullName,
        email: email,
        phone_number: phoneNumber,
      },
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    // Create profile record with phone number
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      display_name: fullName,
      phone_number: phoneNumber,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return encodedRedirect(
        "error",
        "/sign-up",
        "Account created but profile setup failed",
      );
    }

    return encodedRedirect(
      "success",
      "/sign-up",
      "🎉 You're on the waitlist! We'll email and text you when BookShelfie launches. Get ready to track your reading journey!",
    );
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "🎉 You're on the waitlist! We'll email and text you when BookShelfie launches. Get ready to track your reading journey!",
  );
};

export const signInAction = async (formData: FormData) => {
  const emailOrPhone = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  // Check if input is a phone number (starts with + or contains only digits and common phone characters)
  const isPhone = /^[\+]?[1-9][\d]{0,15}$/.test(
    emailOrPhone.replace(/[\s\-\(\)]/g, ""),
  );

  // For waitlist period, only allow specific email to sign in
  if (!isPhone) {
    const allowedEmails = ["peterazmy8991@gmail.com"];
    if (!allowedEmails.includes(emailOrPhone.toLowerCase())) {
      return encodedRedirect(
        "error",
        "/sign-in",
        "You're on the waitlist! We'll notify you when BookShelfie launches. Stay tuned! 🚀",
      );
    }
  }

  let error;

  if (isPhone) {
    // For phone numbers, we need to use OTP method
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: emailOrPhone,
    });
    error = otpError;

    if (!error) {
      // Redirect to OTP verification page with phone number pre-filled
      return redirect(`/verify-otp?phone=${encodeURIComponent(emailOrPhone)}`);
    }
  } else {
    // For email, use password authentication
    const { error: passwordError } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password,
    });
    error = passwordError;
  }

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/home");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {});

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const verifyOtpAction = async (formData: FormData) => {
  const phone = formData.get("phone")?.toString();
  const token = formData.get("token")?.toString();
  const supabase = await createClient();

  if (!phone || !token) {
    return encodedRedirect(
      "error",
      "/verify-otp",
      "Phone number and verification code are required",
    );
  }

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    return encodedRedirect("error", "/verify-otp", error.message);
  }

  return redirect("/home");
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) {
    return false;
  }

  return !!subscription;
};
