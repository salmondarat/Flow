"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SettingsNavigation } from "@/components/admin/settings/settings-navigation";
import { SettingsCard, ProfilePhotoUpload } from "@/components/admin/profile";
import { useAuth } from "@/lib/auth/auth-context";
import {
  User,
  Building,
  Bell,
  Download as DownloadIcon,
  Shield,
  Eye,
  EyeOff,
  Globe,
  ShieldCheck,
  Link2,
  Plus,
  Download,
  Settings,
  Layers,
} from "lucide-react";
import { ComplexitySettings } from "@/components/admin/settings/complexity-settings";
import { BusinessSettings } from "@/components/admin/settings/business-settings";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage your account and application settings
        </p>
      </div>

      <SettingsNavigation activeTab={activeTab} />

      <div className="max-w-5xl">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "business" && <BusinessSettings />}
        {activeTab === "notifications" && <NotificationsSettings />}
        {activeTab === "complexity" && <ComplexitySettings />}
        {activeTab === "danger" && <DangerZoneSettings />}
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { user, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bio, setBio] = useState("Gunpla custom build specialist");
  const [displayName, setDisplayName] = useState(user?.full_name ?? "");

  // Sync display name with user data when it loads
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user?.full_name && displayName !== user.full_name) {
      setDisplayName(user.full_name);
    }
  }, [user?.full_name, displayName]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Basic Information"
        description="Manage your personal information and preferences"
        icon={<User className="h-5 w-5" />}
        action={
          <Button type="submit" form="profile-form" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        }
      >
        <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
          <ProfilePhotoUpload
            currentImage="https://lh3.googleusercontent.com/aida-public/AB6AXuC9Xia8UTvQRkZILRRog998rPqODWDugqzdgMcrdwpmI8tgycZN3wIaqRZJTJ9UGFw8a80pgxNYSPug4VfJQjxCsleHJLT5gGMyO9C_R4BV_2oIKZ9YwVqyVf_ly_3-g6mEzsCyntjBnrCLgA5PEVmAfU681RmnLr9bv4jfwOlUGfXlNNvHBTGAaLOgNKokN-x6fwHb_R5rKr_zR2FSJWiWDZXcVpPRInCJHu0ttGna34JuMx30OvrV09zsxq0HlgGaH6myCPJtj9ng"
            onImageChange={setSelectedFile}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="@username" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={300}
              rows={3}
            />
            <p className="text-muted-foreground text-right text-xs">{bio.length}/300</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City, Country" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" placeholder="https://yourportfolio.com" />
            </div>
          </div>
        </form>
      </SettingsCard>

      <SecurityCard />
      <LanguageRegionCard />
      <PrivacyCard />
      <ConnectedAccountsCard />
      <AccountActionsCard />
    </div>
  );
}

function SecurityCard() {
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement password change API call
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return (
    <SettingsCard
      title="Security"
      description="Manage your password and authentication settings"
      icon={<Shield className="h-5 w-5" />}
      action={
        <Button type="submit" form="password-form" disabled={isSaving}>
          {isSaving ? "Updating..." : "Change Password"}
        </Button>
      }
    >
      <form id="password-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <div className="relative">
            <Input id="current-password" type={showCurrent ? "text" : "password"} required />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          Password must be at least 8 characters long.
        </p>
      </form>

      <Separator />

      {/* Two-Factor Auth Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-muted-foreground text-sm">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch />
        </div>
      </div>
    </SettingsCard>
  );
}

function LanguageRegionCard() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return (
    <SettingsCard
      title="Language & Region"
      description="Configure display preferences and regional settings"
      icon={<Globe className="h-5 w-5" />}
      action={
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      }
    >
      {/* Display Settings */}
      <div className="space-y-4">
        <h4 className="font-medium">Display Settings</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Interface Language</Label>
            <select
              id="language"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="en">English</option>
              <option value="id">Indonesian</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
              <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
              <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <select
              id="date-format"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-format">Time Format</Label>
            <select
              id="time-format"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="12">12-hour (AM/PM)</option>
              <option value="24">24-hour</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="first-day">First Day of Week</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="first-day" value="sunday" defaultChecked />
              <span className="text-sm">Sunday</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="first-day" value="monday" />
              <span className="text-sm">Monday</span>
            </label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Regional Settings */}
      <div className="space-y-4">
        <h4 className="font-medium">Number & Currency Formatting</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="decimal-separator">Decimal Separator</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="decimal" value="dot" defaultChecked />
                <span className="text-sm">Dot (.)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="decimal" value="comma" />
                <span className="text-sm">Comma (,)</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency-format">Currency Format</Label>
            <select
              id="currency-format"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="symbol-before">Rp 1.000.000,00</option>
              <option value="symbol-after">1.000.000,00 Rp</option>
              <option value="no-decimals">Rp 1.000.000</option>
            </select>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

function PrivacyCard() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  return (
    <SettingsCard
      title="Privacy Preferences"
      description="Manage who can see your information and how it's used"
      icon={<ShieldCheck className="h-5 w-5" />}
      action={
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      }
    >
      {/* Profile Visibility */}
      <div className="space-y-4">
        <h4 className="font-medium">Profile Visibility</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Public Profile</p>
              <p className="text-muted-foreground text-xs">
                Make your profile visible to other users
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Show Email</p>
              <p className="text-muted-foreground text-xs">Display your email on your profile</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Show Location</p>
              <p className="text-muted-foreground text-xs">Display your location on your profile</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <Separator />

      {/* Data & Communications */}
      <div className="space-y-4">
        <h4 className="font-medium">Data & Communications</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Marketing Emails</p>
              <p className="text-muted-foreground text-xs">
                Receive promotional content and offers
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Product Updates</p>
              <p className="text-muted-foreground text-xs">
                Receive news about new features and improvements
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Anonymous Usage Data</p>
              <p className="text-muted-foreground text-xs">
                Help improve the service by sharing anonymous data
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Findable by Email</p>
              <p className="text-muted-foreground text-xs">
                Allow others to find your profile via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <Separator />

      {/* Account Privacy */}
      <div className="space-y-4">
        <h4 className="font-medium">Account Privacy</h4>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="activity-visibility">Activity Visibility</Label>
            <select
              id="activity-visibility"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="admin-only">Admins Only</option>
              <option value="only-me">Only Me</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Comment Notifications</p>
              <p className="text-muted-foreground text-xs">
                Receive notifications for new comments
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Messages from Unknown Users</p>
              <p className="text-muted-foreground text-xs">
                Allow users you don&apos;t know to send you messages
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

function ConnectedAccountsCard() {
  const { user } = useAuth();

  return (
    <SettingsCard
      title="Connected Accounts"
      description="Manage third-party accounts linked to your profile"
      icon={<Link2 className="h-5 w-5" />}
    >
      <div className="space-y-3">
        {/* Google Account */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Google</p>
              <p className="text-muted-foreground text-xs">{user?.email || "Not connected"}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Unlink
          </Button>
        </div>

        {/* Link New Account */}
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Link New Account
        </Button>
      </div>
    </SettingsCard>
  );
}

function AccountActionsCard() {
  return (
    <SettingsCard
      title="Account Actions"
      description="Manage your data and account"
      icon={<Settings className="h-5 w-5" />}
      variant="default"
      defaultExpanded={false}
    >
      <div className="space-y-4">
        {/* Data Export */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">Export Profile Data</p>
            <p className="text-muted-foreground text-sm">Download all your profile information</p>
            <p className="text-muted-foreground mt-1 text-xs">Last exported: Never</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Account Deletion */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
          <h4 className="mb-2 font-medium text-red-900 dark:text-red-100">Delete Account</h4>
          <p className="text-muted-foreground mb-4 text-sm">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
          <Button variant="destructive" size="sm">
            Delete My Account
          </Button>
        </div>
      </div>
    </SettingsCard>
  );
}

function NotificationsSettings() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New Orders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified when new orders come in
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
            >
              On
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Status Updates</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Client notifications for status changes
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
            >
              On
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Messages</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Client inquiries and contact forms
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
            >
              On
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function DangerZoneSettings() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <DownloadIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Irreversible and destructive actions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Reset Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
