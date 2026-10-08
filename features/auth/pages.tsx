"use client";

import { useReducer, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/app/states";
import { useAuth } from "@/lib/auth-context";

function AuthFrame({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
        </CardContent>
      </Card>
    </main>
  );
}

function UnavailableAuth() {
  return (
    <AuthFrame title="Sign-in is unavailable" description="Account access is not enabled for this application.">
      <Button asChild className="w-full"><a href="/">Return home</a></Button>
    </AuthFrame>
  );
}

function LoadingAuth() {
  return <LoadingState className="min-h-screen rounded-none border-0" title="Loading your account…" />;
}

type EmailCodeState = { code: string; pending: "verify" | "resend" | null; message: string | null };
type EmailCodeEvent = { type: "code"; value: string } | { type: "start"; action: "verify" | "resend" } | { type: "error"; message: string } | { type: "sent" };

export function emailCodeReducer(state: EmailCodeState, event: EmailCodeEvent): EmailCodeState {
  switch (event.type) {
    case "code": return { ...state, code: event.value };
    case "start": return { ...state, pending: event.action, message: null };
    case "error": return { ...state, pending: null, message: event.message };
    case "sent": return { code: "", pending: null, message: "If your account can receive this email, a new message is on its way. Use the most recent code or link." };
  }
}

function EmailCodeForm({ email, purpose, onBack, redirectTo = "/" }: { email: string; purpose: "signup" | "login"; onBack(): void; redirectTo?: string }) {
  const auth = useAuth();
  const [state, dispatch] = useReducer(emailCodeReducer, { code: "", pending: null, message: null });
  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (state.pending) return;
    dispatch({ type: "start", action: "verify" });
    const result = await auth.verifyEmailCode(email, state.code);
    if (!result.ok) return dispatch({ type: "error", message: result.message ?? "Please try again." });
    window.location.replace(redirectTo);
  };
  const resend = async () => {
    if (state.pending) return;
    dispatch({ type: "start", action: "resend" });
    const result = await (purpose === "signup" ? auth.resendEmailConfirmation(email) : auth.requestEmailSignIn(email, redirectTo));
    dispatch(result.ok ? { type: "sent" } : { type: "error", message: result.message ?? "Please try again." });
  };
  return (
    <AuthFrame title="Check your email" description={`Enter the code sent to ${email}, or follow the link in the email.`}>
      <form className="space-y-4" onSubmit={(event) => void verify(event)}>
        <div className="space-y-2"><Label htmlFor="email-code">Email code</Label><Input id="email-code" autoFocus autoComplete="one-time-code" inputMode="numeric" required value={state.code} disabled={!!state.pending} onChange={(event) => dispatch({ type: "code", value: event.target.value })} /></div>
        {state.message && <p role="status" className="text-sm text-muted-foreground">{state.message}</p>}
        <Button className="w-full" type="submit" disabled={!!state.pending}>{state.pending === "verify" ? "Verifying…" : "Verify and continue"}</Button>
        <Button className="w-full" variant="outline" type="button" disabled={!!state.pending} onClick={() => void resend()}>{state.pending === "resend" ? "Sending…" : "Resend email"}</Button>
        <Button className="w-full" variant="ghost" type="button" disabled={!!state.pending} onClick={onBack}>Use another email</Button>
      </form>
    </AuthFrame>
  );
}

export function LoginPage({ allowEmailOtp = false, defaultEmailOtp = false, redirectTo = "/" }: { allowEmailOtp?: boolean; defaultEmailOtp?: boolean; redirectTo?: string } = {}) {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [emailOnly, setEmailOnly] = useState(defaultEmailOtp);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  if (auth.status === "loading") return <LoadingAuth />;
  if (auth.status === "unavailable") return <UnavailableAuth />;
  if (verificationEmail) return <EmailCodeForm email={verificationEmail} purpose="login" redirectTo={redirectTo} onBack={() => setVerificationEmail(null)} />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    const result = await (emailOnly ? auth.requestEmailSignIn(email.trim(), redirectTo) : auth.signIn(email.trim(), password));
    setPending(false);
    if (!result.ok) return toast.error(result.message);
    if (emailOnly) { setVerificationEmail(email.trim()); return; }
    window.location.replace(redirectTo);
  };

  return (
    <AuthFrame
      title="Welcome back"
      description="Continue with your account."
      footer={<>Need an account? <a className="text-primary underline-offset-4 hover:underline" href="/register">Create one</a></>}
    >
      <form className="space-y-4" onSubmit={(event) => void submit(event)}>
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        {!emailOnly && <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <a className="text-sm text-primary hover:underline" href="/forgot-password">Forgot password?</a>
          </div>
          <Input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>}
        <Button className="w-full" type="submit" disabled={pending}>{pending ? "Please wait…" : emailOnly ? "Send sign-in email" : "Sign in"}</Button>
        {allowEmailOtp && <Button className="w-full" type="button" variant="ghost" disabled={pending} onClick={() => { setEmailOnly(!emailOnly); setPassword(""); }}>{emailOnly ? "Use a password" : "Sign in with an email code"}</Button>}
      </form>
    </AuthFrame>
  );
}

export function RegisterPage() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  if (auth.status === "loading") return <LoadingAuth />;
  if (auth.status === "unavailable") return <UnavailableAuth />;
  if (verificationEmail) return <EmailCodeForm email={verificationEmail} purpose="signup" onBack={() => setVerificationEmail(null)} />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    const result = await auth.signUp(email.trim(), password);
    setPending(false);
    if (!result.ok) return toast.error(result.message);
    if (result.needsEmailConfirmation) {
      setPassword("");
      setVerificationEmail(email.trim());
      return;
    }
    window.location.replace("/");
  };

  return (
    <AuthFrame title="Create an account" description="Enter your email and password to get started." footer={<>Already have an account? <a className="text-primary hover:underline" href="/login">Sign in</a></>}>
      <form className="space-y-4" onSubmit={(event) => void submit(event)}>
        <div className="space-y-2"><Label htmlFor="register-email">Email</Label><Input id="register-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="register-password">Password</Label><Input id="register-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        <Button className="w-full" type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"}</Button>
      </form>
    </AuthFrame>
  );
}

export function ForgotPasswordPage() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  if (auth.status === "loading") return <LoadingAuth />;
  if (auth.status === "unavailable") return <UnavailableAuth />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    const result = await auth.requestPasswordReset(email);
    setPending(false);
    result.ok ? toast.success("If this email is registered, you will receive a reset message.") : toast.error(result.message);
  };

  return (
    <AuthFrame title="Reset password" description="We will send a reset link to your email." footer={<a className="text-primary hover:underline" href="/login">Back to sign in</a>}>
      <form className="space-y-4" onSubmit={(event) => void submit(event)}>
        <div className="space-y-2"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
        <Button className="w-full" type="submit" disabled={pending}>{pending ? "Sending…" : "Send reset email"}</Button>
      </form>
    </AuthFrame>
  );
}

export function ResetPasswordPage() {
  const auth = useAuth();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  if (auth.status === "loading") return <LoadingAuth />;
  if (auth.status === "unavailable") return <UnavailableAuth />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    const result = await auth.updatePassword(password);
    setPending(false);
    if (!result.ok) return toast.error(result.message);
    toast.success("Password updated.");
    window.location.replace("/login");
  };

  return (
    <AuthFrame title="Set a new password" description="Enter a new password for your account.">
      <form className="space-y-4" onSubmit={(event) => void submit(event)}>
        <div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        <Button className="w-full" type="submit" disabled={pending}>{pending ? "Saving…" : "Save new password"}</Button>
      </form>
    </AuthFrame>
  );
}
