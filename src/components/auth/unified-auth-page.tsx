"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, Chrome, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/layout/header";

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

export function UnifiedAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authFunctions, setAuthFunctions] = useState<AuthFunctions | null>(null);
  const [activeTab, setActiveTab] = useState<"client" | "admin">("client");

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
      <>
        <Header />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <div className="bg-background h-screen w-full">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-8">
        <div
          className={`bg-card w-full max-w-6xl overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${
            formVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex h-full flex-col md:flex-row">
            {/* Left side - Statistics and Images Collage */}
            <div className="bg-neutral hidden w-full md:block md:w-3/5">
              <div className="grid h-full grid-cols-2 grid-rows-3 gap-4 overflow-hidden p-6">
                {/* Top left - Person working with overlay */}
                <div
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.1s",
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                  <Image
                    src="/images/20. .jpg"
                    alt="Person working"
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20 text-white">
                    <p className="text-xs font-medium opacity-80">Workflow</p>
                    <p className="text-sm font-bold">Efficient Process</p>
                  </div>
                </div>

                {/* Top right - Stat Card */}
                <div
                  className="flex flex-col items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 p-6 text-white shadow-lg"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.2s",
                  }}
                >
                  <h2 className="mb-2 text-5xl font-bold drop-shadow-md">85%</h2>
                  <p className="text-center text-sm font-medium opacity-95">
                    of orders completed on time with our streamlined workflow system.
                  </p>
                  <div className="mt-3 flex gap-1">
                    <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
                    <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
                    <div className="h-1.5 w-8 rounded-full bg-white"></div>
                  </div>
                </div>

                {/* Middle left - Person at computer with overlay */}
                <div
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.3s",
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                  <Image
                    src="/images/21. .jpg"
                    alt="Person at computer"
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20 text-white">
                    <p className="text-xs font-medium opacity-80">Technology</p>
                    <p className="text-sm font-bold">Modern Tools</p>
                  </div>
                </div>

                {/* Middle right - Office space with overlay */}
                <div
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.4s",
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                  <Image
                    src="/images/22. .jpg"
                    alt="Office space"
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20 text-white">
                    <p className="text-xs font-medium opacity-80">Workspace</p>
                    <p className="text-sm font-bold">Creative Studio</p>
                  </div>
                </div>

                {/* Bottom left - Stat Card */}
                <div
                  className="flex flex-col items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.5s",
                  }}
                >
                  <h2 className="mb-2 text-5xl font-bold drop-shadow-md">2.5k+</h2>
                  <p className="text-center text-sm font-medium opacity-95">
                    active builders and studios trust our platform for managing custom builds.
                  </p>
                  <div className="mt-3 flex gap-1">
                    <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
                    <div className="h-1.5 w-8 rounded-full bg-white"></div>
                    <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
                  </div>
                </div>

                {/* Bottom right - Desk setup with overlay */}
                <div
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.6s",
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                  <Image
                    src="/images/23. .jpg"
                    alt="Desk setup"
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20 text-white">
                    <p className="text-xs font-medium opacity-80">Development</p>
                    <p className="text-sm font-bold">Code & Create</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Sign in form */}
            <div className="bg-card text-foreground flex w-full flex-col md:w-2/5">
              <div
                className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8 lg:p-10"
                style={{
                  transform: formVisible ? "translateX(0)" : "translateX(20px)",
                  opacity: formVisible ? 1 : 0,
                  transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                  maxHeight: "calc(100vh - 8rem)",
                }}
              >
                {/* Custom scrollbar styling */}
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 6px;
                  }
                  div::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: hsl(var(--muted-foreground) / 0.3);
                    border-radius: 3px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--muted-foreground) / 0.5);
                  }
                `}</style>

                {/* Sticky Header - Title and Tabs */}
                <div className="bg-card sticky top-0 z-10 pb-4">
                  <div className="mb-6 text-center">
                    <h1 className="text-foreground mb-1 text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground text-sm">
                      Sign in to your account to continue
                    </p>
                  </div>

                  {/* Role Selection Tabs with Different Colors */}
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "client" | "admin")}
                    className="mb-6"
                  >
                    <TabsList className="bg-muted/50 grid w-full grid-cols-2 p-1">
                      <TabsTrigger
                        value="client"
                        className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                      >
                        <User className="h-4 w-4" />
                        <span>Client</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="admin"
                        className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                      >
                        <Building2 className="h-4 w-4" />
                        <span>Admin</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="client" className="mt-4">
                      <div className="flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500"></div>
                        <p className="text-sm font-medium">
                          Access your client portal to track orders and communicate with builders.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="admin" className="mt-4">
                      <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
                        <p className="text-sm font-medium">
                          Access your admin dashboard to manage orders and clients.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Login Form */}
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

                    <Button
                      type="submit"
                      className={`h-11 w-full text-white transition-all duration-300 ${
                        activeTab === "client"
                          ? "bg-cyan-500 hover:bg-cyan-600"
                          : "bg-amber-500 hover:bg-amber-600"
                      }`}
                      disabled={isLoading}
                    >
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
                      <div className="border-border grow border-t"></div>
                      <span className="text-muted-foreground mx-4 shrink text-sm">OR</span>
                      <div className="border-border grow border-t"></div>
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
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
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
    </div>
  );
}

export default UnifiedAuthPage;
