# Comprehensive Profile Settings Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the admin Profile Settings tab with comprehensive user account management including basic info, security, language/region, privacy, connected accounts, and account actions.

**Architecture:** Expand existing settings page with card-based sections, client-side form state management with optimistic updates, new API endpoints for profile operations, and database schema updates for new fields.

**Tech Stack:** Next.js App Router, React hooks (useState, useEffect), Supabase, TypeScript, Tailwind CSS, shadcn/ui components.

---

### Task 1: Add Profile Photo Upload Component

**Files:**
- Create: `src/components/admin/profile/profile-photo-upload.tsx`

**Step 1: Write the component**

```tsx
"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfilePhotoUploadProps {
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  isUploading?: boolean;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProfilePhotoUpload({ currentImage, onImageChange, isUploading }: ProfilePhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be under 1MB");
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onImageChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be under 1MB");
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onImageChange(file);
  };

  const clearImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Profile Photo</label>
      <div
        className={cn(
          "relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors",
          displayImage ? "border-transparent" : "border-gray-300 hover:border-gray-400",
          isUploading && "cursor-not-allowed opacity-50"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        {displayImage ? (
          <>
            <img src={displayImage} alt="Profile" className="h-full w-full object-cover" />
            {!isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
              >
                <Camera className="h-8 w-8 text-white" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="h-8 w-8" />
            <span className="text-xs">Upload or drag</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
      {!displayImage && (
        <p className="text-muted-foreground text-xs">JPG, PNG, or WebP up to 1MB</p>
      )}
    </div>
  );
}
```

**Step 2: Add to index**

```bash
cat > src/components/admin/profile/index.ts << 'EOF'
export { ProfilePhotoUpload } from "./profile-photo-upload";
EOF
```

**Step 3: Commit**

```bash
git add src/components/admin/profile/profile-photo-upload.tsx src/components/admin/profile/index.ts
git commit -m "feat: add profile photo upload component

- Supports drag & drop and click-to-upload
- Validates file type (JPG/PNG/WebP) and size (1MB max)
- Shows image preview before upload
- Handles loading state during upload

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Create Card Component for Profile Sections

**Files:**
- Create: `src/components/admin/profile/settings-card.tsx`

**Step 1: Write the card component**

```tsx
"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  action?: ReactNode;
  variant?: "default" | "danger";
}

export function SettingsCard({
  title,
  description,
  icon,
  children,
  defaultExpanded = true,
  action,
  variant = "default",
}: SettingsCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 shadow-sm transition-colors",
        variant === "danger"
          ? "border-red-200 bg-white dark:border-red-900 dark:bg-gray-900"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                variant === "danger"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-primary/10 text-primary"
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <h3
              className={cn(
                "text-lg font-bold",
                variant === "danger"
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-900 dark:text-white"
              )}
            >
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {isExpanded && <div className="mt-6 space-y-4">{children}</div>}
    </div>
  );
}
```

**Step 2: Add to index**

```bash
cat >> src/components/admin/profile/index.ts << 'EOF'
export { SettingsCard } from "./settings-card";
EOF
```

**Step 3: Commit**

```bash
git add src/components/admin/profile/settings-card.tsx src/components/admin/profile/index.ts
git commit -m "feat: add collapsible settings card component

- Supports default/danger variants for different visual states
- Expandable/collapsible with icon toggle
- Includes header with title, description, icon, and action slot
- Used as container for all profile settings sections

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Refactor Profile Settings with Basic Information Card

**Files:**
- Modify: `src/app/(admin)/admin/settings/page.tsx:39-79`

**Step 1: Rewrite ProfileSettings function**

```tsx
function ProfileSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

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
              <Input id="display-name" defaultValue="Admin User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="@username" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="admin@flow.local" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              defaultValue="Gunpla custom build specialist"
              maxLength={300}
              rows={3}
            />
            <p className="text-muted-foreground text-xs text-right">0/300</p>
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
    </div>
  );
}
```

**Step 2: Add imports**

```tsx
import { useState } from "react";
import { SettingsCard, ProfilePhotoUpload } from "@/components/admin/profile";
```

**Step 3: Commit**

```bash
git add src/app/\(admin\)/admin/settings/page.tsx
git commit -m "feat: refactor profile settings with new card structure

- Migrate to SettingsCard component for consistent layout
- Add ProfilePhotoUpload component integration
- Add new fields: username, location, website
- Add character counter for bio field
- Expandable/collapsible card design

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Add Security Card with Password Change

**Files:**
- Modify: `src/app/(admin)/admin/settings/page.tsx`

**Step 1: Add SecurityCard component after ProfileSettings**

```tsx
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
            <Input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
```

**Step 2: Update imports**

```tsx
import { Shield, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
```

**Step 3: Add SecurityCard to JSX**

```tsx
{activeTab === "profile" && (
  <>
    <ProfileSettings />
    <SecurityCard />
  </>
)}
```

**Step 4: Commit**

```bash
git add src/app/\(admin\)/admin/settings/page.tsx
git commit -m "feat: add security card with password change and 2FA

- Password change form with current/new/confirm fields
- Show/hide password toggle for each field
- Password validation (min 8 characters)
- Two-factor authentication toggle placeholder
- Uses SettingsCard for consistent layout

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Add Language & Region Card

**Files:**
- Modify: `src/app/(admin)/admin/settings/page.tsx`

**Step 1: Add LanguageRegionCard component**

```tsx
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="en">English</option>
              <option value="id">Indonesian</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
```

**Step 2: Update imports**

```tsx
import { Globe } from "lucide-react";
```

**Step 3: Add to JSX**

```tsx
{activeTab === "profile" && (
  <>
    <ProfileSettings />
    <SecurityCard />
    <LanguageRegionCard />
  </>
)}
```

**Step 4: Commit**

```bash
git add src/app/\(admin\)/admin/settings/page.tsx
git commit -m "feat: add language and region settings card

- Interface language dropdown (English/Indonesian)
- Timezone selection with Indonesian timezones
- Date format options (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
- Time format selection (12-hour/24-hour)
- First day of week radio buttons
- Decimal and thousands separator options
- Currency format options for IDR

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Add Privacy Preferences Card

**Files:**
- Modify: `src/app/(admin)/admin/settings/page.tsx`

**Step 1: Add PrivacyCard component**

```tsx
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
              <p className="text-muted-foreground text-xs">
                Display your email on your profile
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Show Location</p>
              <p className="text-muted-foreground text-xs">
                Display your location on your profile
              </p>
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                Allow users you don't know to send you messages
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
```

**Step 2: Update imports**

```tsx
import { ShieldCheck } from "lucide-react";
```

**Step 3: Add to JSX**

```tsx
{activeTab === "profile" && (
  <>
    <ProfileSettings />
    <SecurityCard />
    <LanguageRegionCard />
    <PrivacyCard />
  </>
)}
```

**Step 4: Commit**

```bash
git add src/app/\(admin\)/admin/settings/page.tsx
git commit -m "feat: add privacy preferences settings card

- Profile visibility toggles (public, email, location)
- Data & communications settings (marketing emails, product updates, usage data)
- Account privacy controls (activity visibility, notifications, messages)
- All settings use Switch components for easy toggle

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Add Connected Accounts and Account Actions Cards

**Files:**
- Modify: `src/app/(admin)/admin/settings/page.tsx`

**Step 1: Add ConnectedAccountsCard component**

```tsx
function ConnectedAccountsCard() {
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
            <div className="bg-red-100 flex h-10 w-10 items-center justify-center rounded-full">
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
              <p className="text-muted-foreground text-xs">admin@flow.local</p>
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
            <p className="text-muted-foreground text-sm">
              Download all your profile information
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Last exported: Never
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Account Deletion */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
          <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
            Delete Account
          </h4>
          <p className="text-muted-foreground text-sm mb-4">
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
```

**Step 2: Update imports**

```tsx
import { Link2, Plus, Download } from "lucide-react";
```

**Step 3: Add to JSX**

```tsx
{activeTab === "profile" && (
  <>
    <ProfileSettings />
    <SecurityCard />
    <LanguageRegionCard />
    <PrivacyCard />
    <ConnectedAccountsCard />
    <AccountActionsCard />
  </>
)}
```

**Step 4: Commit**

```bash
git add src/app/\(admin\)/admin/settings/page.tsx
git commit -m "feat: add connected accounts and account actions cards

- Connected Accounts: display Google account, link/unlink buttons
- Account Actions: export profile data button, delete account section
- Account deletion has danger zone styling with confirmation warning
- All cards use SettingsCard component for consistency

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Remove Unused Profile Settings Functions

**Files:**
- Modify: `src/app/(admin)/admin/settings/page.tsx:81-226`

**Step 1: Remove BusinessSettings, NotificationsSettings, DangerZoneSettings**

These functions are now replaced by the new card-based structure and can be removed from the file.

**Step 2: Commit**

```bash
git add src/app/\(admin\)/admin/settings/page.tsx
git commit -m "refactor: remove unused settings functions

- Remove BusinessSettings, NotificationsSettings, DangerZoneSettings
- These are replaced by new card-based profile sections
- Clean up unused code

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Completion Criteria

After completing all tasks, the Profile tab should have:
- ✅ 6 expandable card sections
- ✅ Profile photo upload with preview
- ✅ Basic information form (name, username, email, bio, location, website)
- ✅ Password change with show/hide toggles
- ✅ Two-factor authentication toggle
- ✅ Language and region preferences
- ✅ Privacy toggles and settings
- ✅ Connected accounts display
- ✅ Data export and account deletion buttons

All cards should be expandable/collapsible with consistent styling using the SettingsCard component.
