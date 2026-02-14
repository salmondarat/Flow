"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Chrome, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

type AuthFunctions = {
  login: typeof import("@/lib/auth/client").login;
  getCurrentUserClient: typeof import("@/lib/auth/client").getCurrentUserClient;
  signInWithOAuth: typeof import("@/lib/auth/client").signInWithOAuth;
};

interface AnimatedSignInProps {
  defaultRole?: "client" | "admin";
}

const AnimatedSignIn: React.FC<AnimatedSignInProps> = ({ defaultRole = "client" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authFunctions, setAuthFunctions] = useState<AuthFunctions | null>(null);
  const [activeTab, setActiveTab] = useState<"client" | "admin">(defaultRole);

  // Animation states
  const [formVisible, setFormVisible] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setFormVisible(true), 100);

    // Load auth functions on mount
    const authPromise = import("@/lib/auth/client").then((m) => ({
      login: m.login,
      getCurrentUserClient: m.getCurrentUserClient,
      signInWithOAuth: m.signInWithOAuth,
    }));
    authPromise.then(setAuthFunctions).catch((err) => {
      console.error("Failed to load auth functions:", err);
      toast.error("Failed to load authentication. Please refresh the page.");
    });
  }, []);

  const onSubmit = async (data: LoginForm) => {
    if (!authFunctions) {
      toast.error("Authentication not loaded. Please refresh the page.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authFunctions.login(data);

      if (result.success) {
        // Verify role matches selection
        const user = await authFunctions.getCurrentUserClient();

        if (activeTab === "client" && user?.role !== "client") {
          toast.error("This account is not a client account. Please use the Admin login.");
          setIsLoading(false);
          return;
        }

        if (activeTab === "admin" && user?.role !== "admin") {
          toast.error("This account is not an admin account. Please use the Client login.");
          setIsLoading(false);
          return;
        }

        // Redirect based on role
        const dashboardPath = activeTab === "admin" ? "/admin/dashboard" : "/client/dashboard";
        const finalRedirect = redirect || dashboardPath;

        toast.success(`Login successful! Redirecting to ${activeTab} dashboard...`);

        setTimeout(() => {
          router.push(finalRedirect);
          router.refresh();
        }, 500);
      } else {
        toast.error(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!authFunctions?.signInWithOAuth) {
      toast.error("Google sign-in not available. Please try email login.");
      return;
    }

    setIsGoogleLoading(true);

    try {
      const result = await authFunctions.signInWithOAuth("google", activeTab);

      if (!result.success) {
        toast.error(result.error || "Google sign-in failed. Please try again.");
      }
      // On success, user will be redirected by OAuth provider
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Only show the component once mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen w-full">
      <div className="flex min-h-screen items-center justify-center p-4 md:p-0">
        <div
          className={`bg-card w-full max-w-6xl overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${
            formVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex flex-col md:flex-row">
            {/* Left side - Statistics and Images Collage */}
            <div className="bg-neutral hidden w-full md:block md:w-3/5">
              <div className="grid h-full grid-cols-2 grid-rows-3 gap-4 overflow-hidden p-6">
                {/* Top left - Person working */}
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop"
                    alt="Person working"
                    className="h-full w-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>

                {/* Top right - Orange stat */}
                <div
                  className="bg-secondary flex flex-col items-center justify-center rounded-xl p-6 text-white"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.2s",
                  }}
                >
                  <h2 className="mb-2 text-5xl font-bold">85%</h2>
                  <p className="text-center text-sm">
                    of orders completed on time with our streamlined workflow system.
                  </p>
                </div>

                {/* Middle left - Person at computer */}
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                    alt="Person at computer"
                    className="h-full w-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>

                {/* Middle right - Office space */}
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop"
                    alt="Office space"
                    className="h-full w-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>

                {/* Bottom left - Green stat */}
                <div
                  className="bg-accent text-accent-content flex flex-col items-center justify-center rounded-xl p-6"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.4s",
                  }}
                >
                  <h2 className="mb-2 text-5xl font-bold">2.5k+</h2>
                  <p className="text-center text-sm">
                    active builders and studios trust our platform for managing custom builds.
                  </p>
                </div>

                {/* Bottom right - Library */}
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop"
                    alt="Desk setup"
                    className="h-full w-full object-cover"
                    style={{ opacity: 0.9 }}
                  />
                </div>
              </div>
            </div>

            {/* Right side - Sign in form */}
            <div
              className="bg-card text-foreground w-full p-6 md:w-2/5 md:p-10"
              style={{
                transform: formVisible ? "translateX(0)" : "translateX(20px)",
                opacity: formVisible ? 1 : 0,
                transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
              }}
            >
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <Link href="/" className="inline-flex items-center gap-3">
                  <div className="bg-primary flex h-10 w-10 items-center justify-center text-lg font-bold text-white">
                    F
                  </div>
                  <span className="text-foreground text-2xl font-bold tracking-tight uppercase">
                    Flow<span className="text-primary">.sys</span>
                  </span>
                </Link>
              </div>

              <div className="mb-6 text-center">
                <h1 className="text-foreground mb-1 text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
              </div>

              {/* Role Selection Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "client" | "admin")}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Client</span>
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Admin</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="client" className="mt-4">
                  <p className="text-muted-foreground mb-4 text-center text-sm">
                    Access your client portal to track orders and communicate with builders.
                  </p>
                </TabsContent>

                <TabsContent value="admin" className="mt-4">
                  <p className="text-muted-foreground mb-4 text-center text-sm">
                    Access your admin dashboard to manage orders and clients.
                  </p>
                </TabsContent>
              </Tabs>

              {!authFunctions ? (
                <div className="py-8 text-center">
                  <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
                  <p className="text-muted-foreground mt-2 text-sm">Loading authentication...</p>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        {...form.register("email")}
                        className="h-11"
                      />
                    </div>
                    {form.formState.errors.email && (
                      <p className="text-destructive text-sm">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        {...form.register("password")}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="text-destructive text-sm">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href="#"
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="h-11 w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="border-border flex-grow border-t"></div>
                    <span className="text-muted-foreground mx-4 flex-shrink text-sm">OR</span>
                    <div className="border-border flex-grow border-t"></div>
                  </div>

                  {/* Google Sign In */}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Chrome className="mr-2 h-5 w-5" />
                    )}
                    Continue with Google
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>

              <p className="text-muted-foreground mt-6 text-center text-sm">
                <Link href="/" className="hover:text-foreground transition-colors">
                  ← Back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AnimatedSignIn };
export default AnimatedSignIn;
