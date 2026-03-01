"use client";


import { unstable_noStore } from "next/cache";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Check, AlertCircle, Loader2 } from "lucide-react";
import { logout } from "@/lib/auth/client";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default function ClientProfilePage() {
  unstable_noStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth");
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const result = await response.json();

      // Set email separately (display only, not part of form)
      setEmail(result.user.email || "");

      form.reset({
        full_name: result.user.full_name || "",
        phone: result.user.phone || "",
        address: result.user.address || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage(null);

    try {
      const payload = {
        full_name: data.full_name,
        phone: data.phone || null,
        address: data.address || null,
      };

      console.log("Submitting profile update:", payload);

      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => null);
      console.log("API response:", { status: response.status, data: responseData });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to update profile");
      }

      setSaveStatus("success");
      toast.success("Profile updated successfully");
      // Refresh profile data
      await fetchProfile();
      // Reset success state after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      const message = error instanceof Error ? error.message : "Failed to update profile";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb/Back Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/client/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Profile Card */}
      <Card variant="nextadmin" className="mx-auto max-w-2xl">
        <CardHeader className="px-7.5 pt-7.5">
          <CardTitle className="text-heading-6">My Profile</CardTitle>
          <CardDescription>Update your personal information and contact details</CardDescription>
        </CardHeader>
        <CardContent className="px-7.5 pb-7.5">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" disabled={isSaving} {...form.register("full_name")} />
                {form.formState.errors.full_name && (
                  <p className="text-destructive mt-1 text-sm">
                    {form.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" disabled value={email} />
                <p className="text-muted-foreground mt-1 text-sm">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  disabled={isSaving}
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <p className="text-destructive mt-1 text-sm">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main St, City, State, ZIP"
                  disabled={isSaving}
                  {...form.register("address")}
                />
                {form.formState.errors.address && (
                  <p className="text-destructive mt-1 text-sm">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/client/dashboard">
                <Button type="button" variant="outline" disabled={isSaving} asChild>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSaving}
                variant={
                  saveStatus === "error"
                    ? "destructive"
                    : saveStatus === "success"
                      ? "default"
                      : "default"
                }
                className={saveStatus === "success" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Save Failed
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
            {saveStatus === "error" && errorMessage && (
              <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                <p className="font-medium">Error saving changes:</p>
                <p className="mt-1">{errorMessage}</p>
              </div>
            )}
            {saveStatus === "success" && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                <p className="flex items-center gap-2 font-medium">
                  <Check className="h-4 w-4" />
                  Changes saved successfully
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
