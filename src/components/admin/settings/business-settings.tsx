"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { SettingsCard } from "@/components/admin/profile";
import { useBusinessSettings } from "@/lib/hooks/use-business-settings";
import type { BusinessSettingsUpdate } from "@/types";
import {
  Building,
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Briefcase,
  Clock,
  CreditCard,
  Receipt,
  Palette,
  Shield,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react";

const TIME_OPTIONS = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "e_wallet", label: "E-Wallet (GoPay, OVO, etc.)" },
  { value: "paypal", label: "PayPal" },
];

export function BusinessSettings() {
  const { settings, isLoading, isSaving, updateSettings, uploadLogo } = useBusinessSettings();
  const [localSettings, setLocalSettings] = useState<BusinessSettingsUpdate>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("core");

  const handleInputChange = useCallback(
    (field: string, value: string | number | boolean | string[]) => {
      setLocalSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (logoFile) {
        await uploadLogo(logoFile);
      }
      await updateSettings(localSettings);
      setLocalSettings({});
      setLogoFile(null);
      setLogoPreview(null);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }, [localSettings, logoFile, updateSettings, uploadLogo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        Failed to load business settings. Please try again.
      </div>
    );
  }

  const hasChanges = Object.keys(localSettings).length > 0 || logoFile !== null;

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "core", label: "Core Info", icon: Building },
          { id: "contact", label: "Contact", icon: Mail },
          { id: "hours", label: "Hours", icon: Clock },
          { id: "financial", label: "Financial", icon: CreditCard },
          { id: "service", label: "Services", icon: Briefcase },
          { id: "branding", label: "Branding", icon: Palette },
          { id: "legal", label: "Legal", icon: Shield },
        ].map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection(section.id)}
          >
            <section.icon className="mr-2 h-4 w-4" />
            {section.label}
          </Button>
        ))}
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save All Changes
          </Button>
        </div>
      )}

      {/* Core Business Info */}
      {activeSection === "core" && (
        <SettingsCard
          title="Core Business Information"
          description="Basic information about your business"
          icon={<Building className="h-5 w-5" />}
        >
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Business Logo</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  {logoPreview || settings.logo_url ? (
                    <Image
                      src={logoPreview || settings.logo_url || ""}
                      alt="Business Logo"
                      width={96}
                      height={96}
                      className="object-contain p-2"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-auto"
                  />
                  <p className="text-xs text-gray-500">Max 5MB. Recommended: 400x400px</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={localSettings.business_name ?? settings.business_name}
                onChange={(e) => handleInputChange("business_name", e.target.value)}
                placeholder="Your Business Name"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={localSettings.tagline ?? settings.tagline ?? ""}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                placeholder="A short description of your business"
              />
              <p className="text-xs text-gray-500">
                This will appear on invoices and the client portal
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={localSettings.description ?? settings.description ?? ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Tell clients about your business"
                rows={3}
              />
            </div>

            {/* Registration Number */}
            <div className="space-y-2">
              <Label htmlFor="registration-number">Business Registration Number / Tax ID</Label>
              <Input
                id="registration-number"
                value={localSettings.registration_number ?? settings.registration_number ?? ""}
                onChange={(e) => handleInputChange("registration_number", e.target.value)}
                placeholder="e.g., NPWP or business license number"
              />
            </div>

            {/* Established Date */}
            <div className="space-y-2">
              <Label htmlFor="established-date">Established Date</Label>
              <Input
                id="established-date"
                type="date"
                value={localSettings.established_date ?? settings.established_date ?? ""}
                onChange={(e) => handleInputChange("established_date", e.target.value)}
              />
            </div>
          </div>
        </SettingsCard>
      )}

      {/* Contact Information */}
      {activeSection === "contact" && (
        <>
          <SettingsCard
            title="Contact Information"
            description="How clients can reach you"
            icon={<Mail className="h-5 w-5" />}
          >
            <div className="space-y-6">
              {/* Business Email */}
              <div className="space-y-2">
                <Label htmlFor="business-email">Business Email</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="business-email"
                    type="email"
                    value={localSettings.business_email ?? settings.business_email ?? ""}
                    onChange={(e) => handleInputChange("business_email", e.target.value)}
                    placeholder="contact@yourbusiness.com"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Business Phone */}
              <div className="space-y-2">
                <Label htmlFor="business-phone">Business Phone</Label>
                <div className="relative">
                  <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="business-phone"
                    type="tel"
                    value={localSettings.business_phone ?? settings.business_phone ?? ""}
                    onChange={(e) => handleInputChange("business_phone", e.target.value)}
                    placeholder="+62 xxx xxxx xxxx"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website-url">Website</Label>
                <div className="relative">
                  <Globe className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="website-url"
                    type="url"
                    value={localSettings.website_url ?? settings.website_url ?? ""}
                    onChange={(e) => handleInputChange("website_url", e.target.value)}
                    placeholder="https://yourbusiness.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Business Address"
            description="Your physical business location"
            icon={<MapPin className="h-5 w-5" />}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address-line1">Address Line 1</Label>
                <Input
                  id="address-line1"
                  value={localSettings.address_line1 ?? settings.address_line1 ?? ""}
                  onChange={(e) => handleInputChange("address_line1", e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address-line2">Address Line 2 (Optional)</Label>
                <Input
                  id="address-line2"
                  value={localSettings.address_line2 ?? settings.address_line2 ?? ""}
                  onChange={(e) => handleInputChange("address_line2", e.target.value)}
                  placeholder="Unit, building, floor, etc."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={localSettings.city ?? settings.city ?? ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={localSettings.state_province ?? settings.state_province ?? ""}
                    onChange={(e) => handleInputChange("state_province", e.target.value)}
                    placeholder="State or Province"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input
                    id="postal-code"
                    value={localSettings.postal_code ?? settings.postal_code ?? ""}
                    onChange={(e) => handleInputChange("postal_code", e.target.value)}
                    placeholder="Postal Code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={localSettings.country ?? settings.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Social Media Links"
            description="Connect your social media profiles"
            icon={<Globe className="h-5 w-5" />}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={localSettings.instagram_url ?? settings.instagram_url ?? ""}
                  onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/yourbusiness"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={localSettings.facebook_url ?? settings.facebook_url ?? ""}
                  onChange={(e) => handleInputChange("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/yourbusiness"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={localSettings.twitter_url ?? settings.twitter_url ?? ""}
                  onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                  placeholder="https://twitter.com/yourbusiness"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube
                </Label>
                <Input
                  id="youtube"
                  value={localSettings.youtube_url ?? settings.youtube_url ?? ""}
                  onChange={(e) => handleInputChange("youtube_url", e.target.value)}
                  placeholder="https://youtube.com/yourbusiness"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Portfolio/Other
                </Label>
                <Input
                  id="portfolio"
                  value={localSettings.portfolio_url ?? settings.portfolio_url ?? ""}
                  onChange={(e) => handleInputChange("portfolio_url", e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </SettingsCard>
        </>
      )}

      {/* Operating Hours */}
      {activeSection === "hours" && (
        <SettingsCard
          title="Operating Hours"
          description="Set your business hours and availability"
          icon={<Clock className="h-5 w-5" />}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                value={localSettings.timezone ?? settings.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
            </div>

            <Separator />

            {DAYS.map((day) => {
              const enabledKey = `${day.key}_enabled` as keyof BusinessSettingsUpdate;
              const openKey = `${day.key}_open` as keyof BusinessSettingsUpdate;
              const closeKey = `${day.key}_close` as keyof BusinessSettingsUpdate;
              const isEnabled = (localSettings[enabledKey] ??
                settings[enabledKey as keyof typeof settings]) as boolean;
              const openTime = (localSettings[openKey] ??
                settings[openKey as keyof typeof settings]) as string;
              const closeTime = (localSettings[closeKey] ??
                settings[closeKey as keyof typeof settings]) as string;

              return (
                <div key={day.key} className="flex items-center gap-4">
                  <div className="w-24">
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(checked) =>
                        handleInputChange(enabledKey as string, checked)
                      }
                    />
                    <span className="ml-2 text-sm font-medium">{day.label}</span>
                  </div>
                  {isEnabled && (
                    <div className="flex items-center gap-2">
                      <select
                        className="border-input bg-background h-10 rounded-md border px-3 py-2 text-sm"
                        value={openTime || "09:00"}
                        onChange={(e) => handleInputChange(openKey as string, e.target.value)}
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500">to</span>
                      <select
                        className="border-input bg-background h-10 rounded-md border px-3 py-2 text-sm"
                        value={closeTime || "17:00"}
                        onChange={(e) => handleInputChange(closeKey as string, e.target.value)}
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SettingsCard>
      )}

      {/* Financial Settings */}
      {activeSection === "financial" && (
        <>
          <SettingsCard
            title="Financial Settings"
            description="Configure tax, deposits, and payment options"
            icon={<CreditCard className="h-5 w-5" />}
          >
            <div className="space-y-6">
              {/* Tax Settings */}
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Tax/VAT</h4>
                    <p className="text-sm text-gray-500">Apply tax to orders</p>
                  </div>
                  <Switch
                    checked={localSettings.tax_enabled ?? settings.tax_enabled}
                    onCheckedChange={(checked) => handleInputChange("tax_enabled", checked)}
                  />
                </div>
                {(localSettings.tax_enabled ?? settings.tax_enabled) && (
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={localSettings.tax_rate ?? settings.tax_rate}
                      onChange={(e) => handleInputChange("tax_rate", parseFloat(e.target.value))}
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Deposit */}
              <div className="space-y-2">
                <Label htmlFor="deposit-percentage">Deposit Required (%)</Label>
                <Input
                  id="deposit-percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={localSettings.deposit_percentage ?? settings.deposit_percentage}
                  onChange={(e) =>
                    handleInputChange("deposit_percentage", parseInt(e.target.value))
                  }
                />
                <p className="text-xs text-gray-500">
                  Percentage of total order value required as upfront deposit
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <Label>Accepted Payment Methods</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {PAYMENT_METHODS.map((method) => {
                    const currentMethods = (localSettings.payment_methods ??
                      settings.payment_methods) as string[];
                    const isSelected = currentMethods.includes(method.value);

                    return (
                      <label
                        key={method.value}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const newMethods = e.target.checked
                              ? [...currentMethods, method.value]
                              : currentMethods.filter((m) => m !== method.value);
                            handleInputChange("payment_methods", newMethods);
                          }}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{method.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Invoice Settings"
            description="Configure invoice numbering and payment terms"
            icon={<Receipt className="h-5 w-5" />}
          >
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                  <Input
                    id="invoice-prefix"
                    value={localSettings.invoice_prefix ?? settings.invoice_prefix}
                    onChange={(e) => handleInputChange("invoice_prefix", e.target.value)}
                    placeholder="INV"
                  />
                  <p className="text-xs text-gray-500">e.g., INV-001</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice-starting">Starting Number</Label>
                  <Input
                    id="invoice-starting"
                    type="number"
                    min="1"
                    value={
                      localSettings.invoice_starting_number ?? settings.invoice_starting_number
                    }
                    onChange={(e) =>
                      handleInputChange("invoice_starting_number", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-terms">Payment Terms (Days)</Label>
                <Input
                  id="payment-terms"
                  type="number"
                  min="0"
                  value={localSettings.payment_terms_days ?? settings.payment_terms_days}
                  onChange={(e) =>
                    handleInputChange("payment_terms_days", parseInt(e.target.value))
                  }
                />
                <p className="text-xs text-gray-500">
                  Number of days clients have to pay the invoice
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="late-fee">Late Payment Fee (%)</Label>
                <Input
                  id="late-fee"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={
                    localSettings.late_payment_fee_percentage ??
                    settings.late_payment_fee_percentage
                  }
                  onChange={(e) =>
                    handleInputChange("late_payment_fee_percentage", parseFloat(e.target.value))
                  }
                />
              </div>
            </div>
          </SettingsCard>
        </>
      )}

      {/* Service Defaults */}
      {activeSection === "service" && (
        <SettingsCard
          title="Service Defaults"
          description="Default settings for orders and services"
          icon={<Briefcase className="h-5 w-5" />}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Input
                id="currency"
                value={localSettings.currency_code ?? settings.currency_code}
                onChange={(e) => handleInputChange("currency_code", e.target.value)}
                disabled
              />
              <p className="text-xs text-gray-500">
                Currency is set based on your pricing configuration
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-time">Default Lead Time (Days)</Label>
              <Input
                id="lead-time"
                type="number"
                min="1"
                value={localSettings.default_lead_time_days ?? settings.default_lead_time_days}
                onChange={(e) =>
                  handleInputChange("default_lead_time_days", parseInt(e.target.value))
                }
              />
              <p className="text-xs text-gray-500">Default turnaround time for new orders</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rush-fee">Rush Order Fee (%)</Label>
              <Input
                id="rush-fee"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={
                  localSettings.rush_order_fee_percentage ?? settings.rush_order_fee_percentage
                }
                onChange={(e) =>
                  handleInputChange("rush_order_fee_percentage", parseFloat(e.target.value))
                }
              />
              <p className="text-xs text-gray-500">Additional fee for expedited orders</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-revisions">Max Revisions Included</Label>
              <Input
                id="max-revisions"
                type="number"
                min="0"
                value={localSettings.max_revisions ?? settings.max_revisions}
                onChange={(e) => handleInputChange("max_revisions", parseInt(e.target.value))}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="cancellation">Cancellation Policy</Label>
              <Textarea
                id="cancellation"
                value={localSettings.cancellation_policy ?? settings.cancellation_policy ?? ""}
                onChange={(e) => handleInputChange("cancellation_policy", e.target.value)}
                placeholder="Describe your cancellation and refund policy"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="revision">Revision Policy</Label>
              <Textarea
                id="revision"
                value={localSettings.revision_policy ?? settings.revision_policy ?? ""}
                onChange={(e) => handleInputChange("revision_policy", e.target.value)}
                placeholder="Describe what is included in revisions"
                rows={3}
              />
            </div>
          </div>
        </SettingsCard>
      )}

      {/* Branding */}
      {activeSection === "branding" && (
        <SettingsCard
          title="Branding & Communication"
          description="Customize your brand appearance and communication"
          icon={<Palette className="h-5 w-5" />}
        >
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={localSettings.primary_color ?? settings.primary_color}
                    onChange={(e) => handleInputChange("primary_color", e.target.value)}
                    className="h-10 w-20"
                  />
                  <Input
                    value={localSettings.primary_color ?? settings.primary_color}
                    onChange={(e) => handleInputChange("primary_color", e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={localSettings.secondary_color ?? settings.secondary_color}
                    onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                    className="h-10 w-20"
                  />
                  <Input
                    value={localSettings.secondary_color ?? settings.secondary_color}
                    onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                    placeholder="#10B981"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="email-signature">Email Signature</Label>
              <Textarea
                id="email-signature"
                value={localSettings.email_signature ?? settings.email_signature ?? ""}
                onChange={(e) => handleInputChange("email_signature", e.target.value)}
                placeholder="Your email signature that will be appended to all emails"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                This signature will be added to the end of all emails sent to clients
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auto-reply">Auto-Reply Message</Label>
              <Textarea
                id="auto-reply"
                value={localSettings.auto_reply_message ?? settings.auto_reply_message ?? ""}
                onChange={(e) => handleInputChange("auto_reply_message", e.target.value)}
                placeholder="Message sent automatically when a new inquiry is received"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                This message will be sent automatically when someone submits a contact form
              </p>
            </div>
          </div>
        </SettingsCard>
      )}

      {/* Legal */}
      {activeSection === "legal" && (
        <SettingsCard
          title="Legal & Compliance"
          description="Terms, privacy policy, and warranty information"
          icon={<Shield className="h-5 w-5" />}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="terms-url" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Terms of Service URL
              </Label>
              <Input
                id="terms-url"
                type="url"
                value={localSettings.terms_of_service_url ?? settings.terms_of_service_url ?? ""}
                onChange={(e) => handleInputChange("terms_of_service_url", e.target.value)}
                placeholder="https://yourbusiness.com/terms"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy-url" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy Policy URL
              </Label>
              <Input
                id="privacy-url"
                type="url"
                value={localSettings.privacy_policy_url ?? settings.privacy_policy_url ?? ""}
                onChange={(e) => handleInputChange("privacy_policy_url", e.target.value)}
                placeholder="https://yourbusiness.com/privacy"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty Terms</Label>
              <Textarea
                id="warranty"
                value={localSettings.warranty_terms ?? settings.warranty_terms ?? ""}
                onChange={(e) => handleInputChange("warranty_terms", e.target.value)}
                placeholder="Describe your warranty or guarantee terms for completed work"
                rows={5}
              />
              <p className="text-xs text-gray-500">
                This will be displayed on invoices and order confirmations
              </p>
            </div>
          </div>
        </SettingsCard>
      )}
    </div>
  );
}
