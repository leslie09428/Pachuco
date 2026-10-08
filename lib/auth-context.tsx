"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { getSupabase, requireSupabase } from "@/lib/supabase";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "anonymous"
  | "unavailable";

export interface AuthActionResult {
  ok: boolean;
  message?: string;
  needsEmailConfirmation?: boolean;
}

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  signIn(email: string, password: string): Promise<AuthActionResult>;
  signUp(email: string, password: string): Promise<AuthActionResult>;
  verifyEmailCode(email: string, token: string): Promise<AuthActionResult>;
  resendEmailConfirmation(email: string): Promise<AuthActionResult>;
  requestEmailSignIn(email: string, redirectTo?: string): Promise<AuthActionResult>;
  signOut(): Promise<AuthActionResult>;
  requestPasswordReset(email: string): Promise<AuthActionResult>;
  updatePassword(password: string): Promise<AuthActionResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function publicAuthError(error: unknown): string {
  if (!(error instanceof Error)) return "The operation could not be completed. Please try again.";
  const message = error.message.toLowerCase();
  if (message.includes("expired") || message.includes("invalid otp")) return "This code is invalid or has expired. Request a new email and try again.";
  if (message.includes("rate limit") || message.includes("too many") || message.includes("after")) return "Please wait before requesting another email, then try again.";
  if (message.includes("invalid login credentials")) return "The email or password is incorrect.";
  if (message.includes("email not confirmed")) return "Verify your email before signing in.";
  if (message.includes("already registered")) return "This email is already registered.";
  if (message.includes("password")) return "The password does not meet the requirements.";
  if (message.includes("not enabled")) return error.message;
  return "The operation could not be completed. Please try again.";
}

function failed(error: unknown): AuthActionResult {
  return { ok: false, message: publicAuthError(error) };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    // beforeInteractive finishes before hydration; both initial renders stay loading.
    const supabase = getSupabase();
    if (!supabase) {
      setStatus("unavailable");
      return;
    }
    let active = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setSession(error ? null : data.session);
      setStatus(!error && data.session ? "authenticated" : "anonymous");
    }).catch(() => {
      if (!active) return;
      setSession(null);
      setStatus("anonymous");
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setStatus(nextSession ? "authenticated" : "anonymous");
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await requireSupabase().auth.signInWithPassword({
        email,
        password,
      });
      return error ? failed(error) : { ok: true };
    } catch (error) {
      return failed(error);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await requireSupabase().auth.signUp({
        email,
        password,
      });
      return error
        ? failed(error)
        : { ok: true, needsEmailConfirmation: !data.session };
    } catch (error) {
      return failed(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await requireSupabase().auth.signOut();
      return error ? failed(error) : { ok: true };
    } catch (error) {
      return failed(error);
    }
  }, []);

  const verifyEmailCode = useCallback(async (email: string, token: string) => {
    try {
      const { data, error } = await requireSupabase().auth.verifyOtp({ email, token: token.trim(), type: "email" });
      if (error) return failed(error);
      return data.session ? { ok: true } : { ok: false, message: "Sign-in could not be completed. Request a new email and try again." };
    } catch (error) {
      return failed(error);
    }
  }, []);

  const resendEmailConfirmation = useCallback(async (email: string) => {
    try {
      const { error } = await requireSupabase().auth.resend({ type: "signup", email });
      return error ? failed(error) : { ok: true };
    } catch (error) {
      return failed(error);
    }
  }, []);

  const requestEmailSignIn = useCallback(async (email: string, redirectTo = "/") => {
    try {
      const { error } = await requireSupabase().auth.signInWithOtp({
        email, options: { shouldCreateUser: false, emailRedirectTo: new URL(redirectTo, window.location.origin).href },
      });
      return error ? failed(error) : { ok: true };
    } catch (error) {
      return failed(error);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const redirectTo = new URL("/reset-password", window.location.origin).href;
      const { error } = await requireSupabase().auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      return error ? failed(error) : { ok: true };
    } catch (error) {
      return failed(error);
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await requireSupabase().auth.updateUser({ password });
      return error ? failed(error) : { ok: true };
    } catch (error) {
      return failed(error);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    session,
    user: session?.user ?? null,
    signIn,
    signUp,
    verifyEmailCode,
    resendEmailConfirmation,
    requestEmailSignIn,
    signOut,
    requestPasswordReset,
    updatePassword,
  }), [
    requestPasswordReset,
    verifyEmailCode,
    resendEmailConfirmation,
    requestEmailSignIn,
    session,
    signIn,
    signOut,
    signUp,
    status,
    updatePassword,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
