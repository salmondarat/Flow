"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SettingsNavigation } from "@/components/admin/settings/settings-navigation";
import { User, Building, Bell, Download as DownloadIcon } from "lucide-react";

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

      <div className="max-w-3xl">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "business" && <BusinessSettings />}
        {activeTab === "notifications" && <NotificationsSettings />}
        {activeTab === "danger" && <DangerZoneSettings />}
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue="Admin User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@flow.local" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              placeholder="Tell us about yourself"
              defaultValue="Gunpla custom build specialist"
            />
          </div>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

function BusinessSettings() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Business Info</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure your business details and preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" defaultValue="Flow Gunpla Service" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" defaultValue="Indonesian Rupiah (IDR)" disabled />
            <p className="text-muted-foreground text-xs">
              Currency is set based on your pricing configuration
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" defaultValue="Asia/Jakarta (WIB)" />
          </div>
          <Button>Update</Button>
        </div>
      </div>
    </div>
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
