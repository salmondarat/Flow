"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Chrome, User, Building2 } from "lucide-react";

const baseRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
});

const adminRegisterSchema = baseRegisterSchema.extend({
  studio_name: z.string().optional(),
  business_type: z.string().optional(),
});

const clientRegisterSchema = baseRegisterSchema.extend({
  phone: z.string().optional(),
  address: z.string().optional(),
});

type AdminRegisterForm = z.infer<typeof adminRegisterSchema>;
type ClientRegisterForm = z.infer<typeof clientRegisterSchema>;

type AuthFunctions = {
  signInWithOAuth: typeof import("@/lib/auth/client").signInWithOAuth;
};

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"client" | "admin">("client");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authFunctions, setAuthFunctions] = useState<AuthFunctions | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation states
  const [formVisible, setFormVisible] = useState(false);

  const adminForm = useForm<AdminRegisterForm>({
    resolver: zodResolver(
      adminRegisterSchema.refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      })
    ),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      studio_name: "",
      business_type: "",
    },
  });

  const clientForm = useForm<ClientRegisterForm>({
    resolver: zodResolver(
      clientRegisterSchema.refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      })
    ),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setFormVisible(true), 100);

    // Load auth functions on mount
    const authPromise = import("@/lib/auth/client").then((m) => ({
      signInWithOAuth: m.signInWithOAuth,
    }));
    authPromise.then(setAuthFunctions).catch((err) => {
      console.error("Failed to load auth functions:", err);
    });
  }, []);

  const onSubmit = async (
    data: Omit<AdminRegisterForm | ClientRegisterForm, "confirmPassword">
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          role: activeTab,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("[DEBUG] Registration failed:", result);
        if (result.error) {
          toast.error(result.error);
        }
        if (result.details) {
          toast.error(`Details: ${result.details}`);
        }
        setIsLoading(false);
        return;
      }

      toast.success("Account created! Please sign in to continue.");

      setTimeout(() => {
        router.push(`/auth?role=${activeTab}`);
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!authFunctions?.signInWithOAuth) {
      toast.error("Google sign-up not available. Please try email registration.");
      return;
    }

    setIsGoogleLoading(true);

    try {
      const result = await authFunctions.signInWithOAuth("google", activeTab);

      if (!result.success) {
        toast.error(result.error || "Google sign-up failed. Please try again.");
      }
      // On success, user will be redirected by OAuth provider
    } catch (error) {
      console.error("Google sign-up error:", error);
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
          <div className="flex flex-col md:flex-row-reverse">
            {/* Right side - Statistics and Images Collage */}
            <div className="bg-neutral hidden w-full md:block md:w-3/5">
              <div className="grid h-full grid-cols-2 grid-rows-3 gap-4 overflow-hidden p-6">
                {/* Top left - Stat Card */}
                <div
                  className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white shadow-lg"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.2s",
                  }}
                >
                  <h2 className="mb-2 text-5xl font-bold drop-shadow-md">500+</h2>
                  <p className="text-center text-sm font-medium opacity-95">
                    studios already using our platform to manage their workflow.
                  </p>
                  <div className="mt-3 flex gap-1">
                    <div className="h-1.5 w-8 rounded-full bg-white"></div>
                    <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
                    <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
                  </div>
                </div>

                {/* Top right - Person working with overlay */}
                <div
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.3s",
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <img
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop&q=80"
                    alt="Team collaboration"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20 text-white">
                    <p className="text-xs font-medium opacity-80">Collaboration</p>
                    <p className="text-sm font-bold">Team Work</p>
                  </div>
                </div>

                {/* Middle left - Workshop with overlay */}
                <div
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.4s",
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <img
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop&q=80"
                    alt="Workshop"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20 text-white">
                    <p className="text-xs font-medium opacity-80">Creation</p>
                    <p className="text-sm font-bold">Build & Craft</p>
                  </div>
                </div>

                {/* Middle right - Stat Card */}
                <div
                  className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.5s",
                  }}
                >
                  <h2 className="mb-2 text-5xl font-bold drop-shadow-md">24/7</h2>
                  <p className="text-center text-sm font-medium opacity-95">
                    support available for all users on our platform.
                  </p>
                  <div className="mt-3 flex gap-1">
                    <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
                    <div className="h-1.5 w-8 rounded-full bg-white"></div>
                    <div className="h-1.5 w-8 rounded-full bg-white/40"></div>
                  </div>
                </div>

                {/* Bottom left - Creative workspace with overlay */}
                <div
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.6s",
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <img
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=400&fit=crop&q=80"
                    alt="Creative workspace"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20 text-white">
                    <p className="text-xs font-medium opacity-80">Innovation</p>
                    <p className="text-sm font-bold">Design Studio</p>
                  </div>
                </div>

                {/* Bottom right - Team meeting with overlay */}
                <div
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    transform: formVisible ? "translateY(0)" : "translateY(20px)",
                    opacity: formVisible ? 1 : 0,
                    transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
                    transitionDelay: "0.7s",
                  }}
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&q=80"
                    alt="Team meeting"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 z-20 text-white">
                    <p className="text-xs font-medium opacity-80">Community</p>
                    <p className="text-sm font-bold">Join Us</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left side - Registration form */}
            <div
              className="bg-card text-foreground w-full p-6 md:w-2/5 md:p-8"
              style={{
                transform: formVisible ? "translateX(0)" : "translateX(-20px)",
                opacity: formVisible ? 1 : 0,
                transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
              }}
            >
              {/* Logo */}
              <div className="mb-6 flex justify-center">
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
                <h1 className="text-foreground mb-1 text-2xl font-bold">Create Account</h1>
                <p className="text-muted-foreground text-sm">
                  Join us and start managing your builds today
                </p>
              </div>

              {/* Role Selection Tabs with Different Colors */}
              <Tabs
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value as "client" | "admin");
                  // Clear errors when switching tabs
                  adminForm.clearErrors();
                  clientForm.clearErrors();
                }}
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
                      Create a client account to track orders and communicate with builders.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="admin" className="mt-4">
                  <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
                    <p className="text-sm font-medium">
                      Create an admin account to manage your studio and clients.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Client Registration Form */}
              <form
                key="client-form"
                onSubmit={clientForm.handleSubmit(onSubmit)}
                className={`space-y-4 ${activeTab !== "client" ? "hidden" : ""}`}
              >
                <div className="space-y-2">
                  <Label htmlFor="client_full_name">Full Name *</Label>
                  <Input
                    id="client_full_name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    disabled={isLoading}
                    {...clientForm.register("full_name")}
                    className="h-10"
                  />
                  {clientForm.formState.errors.full_name && (
                    <p className="text-destructive text-sm">
                      {clientForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_email">Email Address *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    {...clientForm.register("email")}
                    className="h-10"
                  />
                  {clientForm.formState.errors.email && (
                    <p className="text-destructive text-sm">
                      {clientForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_phone">Phone Number</Label>
                  <Input
                    id="client_phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 (555) 123-4567"
                    disabled={isLoading}
                    {...clientForm.register("phone")}
                    className="h-10"
                  />
                  {clientForm.formState.errors.phone && (
                    <p className="text-destructive text-sm">
                      {clientForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_address">Address</Label>
                  <Textarea
                    id="client_address"
                    placeholder="123 Main St, City, State, ZIP"
                    disabled={isLoading}
                    {...clientForm.register("address")}
                    className="min-h-[60px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="client_password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...clientForm.register("password")}
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {clientForm.formState.errors.password && (
                    <p className="text-destructive text-sm">
                      {clientForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="client_confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...clientForm.register("confirmPassword")}
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {clientForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm">
                      {clientForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="h-10 w-full bg-cyan-500 text-white transition-all duration-300 hover:bg-cyan-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span>Create Client Account</span>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative flex items-center py-1">
                  <div className="border-border flex-grow border-t"></div>
                  <span className="text-muted-foreground mx-4 flex-shrink text-sm">OR</span>
                  <div className="border-border flex-grow border-t"></div>
                </div>

                {/* Google Sign Up */}
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full"
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

              {/* Admin Registration Form */}
              <form
                key="admin-form"
                onSubmit={adminForm.handleSubmit(onSubmit)}
                className={`space-y-4 ${activeTab !== "admin" ? "hidden" : ""}`}
              >
                <div className="space-y-2">
                  <Label htmlFor="admin_full_name">Full Name *</Label>
                  <Input
                    id="admin_full_name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    disabled={isLoading}
                    {...adminForm.register("full_name")}
                    className="h-10"
                  />
                  {adminForm.formState.errors.full_name && (
                    <p className="text-destructive text-sm">
                      {adminForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_email">Email Address *</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    {...adminForm.register("email")}
                    className="h-10"
                  />
                  {adminForm.formState.errors.email && (
                    <p className="text-destructive text-sm">
                      {adminForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_studio_name">Studio Name</Label>
                  <Input
                    id="admin_studio_name"
                    type="text"
                    placeholder="My Gunpla Studio"
                    disabled={isLoading}
                    {...adminForm.register("studio_name")}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_business_type">Business Type</Label>
                  <Input
                    id="admin_business_type"
                    type="text"
                    placeholder="Sole Proprietor, LLC, etc."
                    disabled={isLoading}
                    {...adminForm.register("business_type")}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="admin_password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...adminForm.register("password")}
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {adminForm.formState.errors.password && (
                    <p className="text-destructive text-sm">
                      {adminForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="admin_confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...adminForm.register("confirmPassword")}
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {adminForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm">
                      {adminForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="h-10 w-full bg-amber-500 text-white transition-all duration-300 hover:bg-amber-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span>Create Studio Account</span>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative flex items-center py-1">
                  <div className="border-border flex-grow border-t"></div>
                  <span className="text-muted-foreground mx-4 flex-shrink text-sm">OR</span>
                  <div className="border-border flex-grow border-t"></div>
                </div>

                {/* Google Sign Up */}
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full"
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

              <div className="mt-4 text-center">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link href="/auth" className="text-primary hover:text-primary/80 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              <p className="text-muted-foreground mt-4 text-center text-sm">
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
}
