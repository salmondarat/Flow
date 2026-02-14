"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

/**
 * RegisterForm - Reusable registration form component for client portal
 *
 * Collects:
 * - Full name (required)
 * - Email (required)
 * - Phone (optional)
 * - Address (optional)
 * - Password (required, min 8 chars)
 * - Confirm password (required)
 *
 * Redirects to /auth after successful registration
 */
export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/client/dashboard";

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: Omit<RegisterForm, "confirmPassword">) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          phone: data.phone || undefined,
          address: data.address || undefined,
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
        if (result.code) {
          console.error("[DEBUG] Error code:", result.code);
        }
        if (!result.error && !result.details) {
          toast.error("Registration failed. Please try again.");
        }
        return;
      }

      toast.success("Account created! Please sign in to continue.");

      // Redirect to unified auth page after a short delay
      setTimeout(() => {
        router.push(`/auth?redirect=${encodeURIComponent(redirect)}`);
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Mobile Logo - Hidden on Desktop */}
      <div className="mb-8 flex w-full max-w-md flex-col lg:hidden">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">token</span>
          <span className="text-xl font-bold tracking-widest uppercase">Flow.sys</span>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to start placing orders</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                disabled={isLoading}
                {...form.register("full_name")}
              />
              {form.formState.errors.full_name && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                disabled={isLoading}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Main St, City, State, ZIP"
                disabled={isLoading}
                {...form.register("address")}
              />
              {form.formState.errors.address && (
                <p className="text-destructive text-sm">{form.formState.errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isLoading}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-destructive text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isLoading}
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link
                  href={`/auth?redirect=${encodeURIComponent(redirect)}`}
                  className="text-primary font-medium transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Back to Home */}
      <p className="text-muted-foreground mt-6 text-center text-sm">
        <Link href="/" className="hover:text-primary transition-colors hover:underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
