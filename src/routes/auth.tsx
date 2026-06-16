import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In — INFINA" },
      { name: "description", content: "Sign in or create your INFINA Beauty account." },
    ],
  }),
});

function AuthPage() {
  const { user, loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate({ to: "/account" });
    }
  }, [user, navigate]);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/account" });
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/user-not-found") toast.error("No account found with this email.");
      else if (code === "auth/wrong-password" || code === "auth/invalid-credential") toast.error("Incorrect password.");
      else if (code === "auth/invalid-email") toast.error("Invalid email address.");
      else if (code === "auth/too-many-requests") toast.error("Too many attempts. Try again later.");
      else toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    try {
      await registerWithEmail(email, password, name);
      toast.success("Account created successfully! Welcome to INFINA.");
      navigate({ to: "/account" });
    } catch (err: any) {
      console.error("Registration error:", err);
      const code = err?.code ?? "";
      if (code === "auth/email-already-in-use") toast.error("This email is already registered. Try logging in.");
      else if (code === "auth/weak-password") toast.error("Password is too weak.");
      else if (code === "auth/invalid-email") toast.error("Invalid email address.");
      else if (code === "auth/operation-not-allowed") toast.error("Email/Password accounts are not enabled in Firebase Console.");
      else toast.error(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome!");
      navigate({ to: "/account" });
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      toast.success("Password reset email sent! Check your inbox.");
      setMode("login");
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/user-not-found") toast.error("No account found with this email.");
      else toast.error("Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf2f0] via-background to-[#f5ebe8]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl shadow-elegant lg:grid-cols-2">
          {/* Left — Decorative Panel */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 lg:block">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center opacity-20" />
            <div className="relative flex h-full flex-col justify-between p-12">
              <Logo height="h-10" />
              <div>
                <h2 className="font-serif text-4xl leading-tight text-white">
                  Your Beauty Journey<br />Starts Here
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-white/80">
                  Join thousands of beauty enthusiasts. Get access to exclusive products,
                  personalized recommendations, and special offers.
                </p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">© INFINA Beauty 2026</p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div className="flex flex-col justify-center bg-white p-8 md:p-12">
            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo height="h-8" />
            </div>

            {/* Login Form */}
            {mode === "login" && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h1 className="font-serif text-3xl tracking-tight">Welcome Back</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to your INFINA account
                  </p>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-medium shadow-sm transition-all hover:bg-muted/50 hover:shadow-md disabled:opacity-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-muted-foreground tracking-widest">or</span>
                  </div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11 rounded-xl"
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-11 pr-11 rounded-xl"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl text-sm uppercase tracking-widest gap-2"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Sign In
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setMode("register"); setPassword(""); }}
                    className="font-semibold text-primary hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            )}

            {/* Register Form */}
            {mode === "register" && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h1 className="font-serif text-3xl tracking-tight">Create Account</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Join INFINA for exclusive beauty perks
                  </p>
                </div>

                {/* Google Sign Up */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-medium shadow-sm transition-all hover:bg-muted/50 hover:shadow-md disabled:opacity-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-muted-foreground tracking-widest">or</span>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 pl-11 rounded-xl"
                      autoComplete="name"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11 rounded-xl"
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-11 pr-11 rounded-xl"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 pl-11 rounded-xl"
                      autoComplete="new-password"
                    />
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <a href="/policies/terms" className="underline hover:text-primary">Terms</a> and{" "}
                    <a href="/policies/privacy" className="underline hover:text-primary">Privacy Policy</a>.
                  </p>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl text-sm uppercase tracking-widest gap-2"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Create Account
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("login"); setPassword(""); setConfirmPassword(""); }}
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}

            {/* Forgot Password Form */}
            {mode === "forgot" && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h1 className="font-serif text-3xl tracking-tight">Reset Password</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11 rounded-xl"
                      autoComplete="email"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl text-sm uppercase tracking-widest gap-2"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Send Reset Link
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="font-semibold text-primary hover:underline"
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
