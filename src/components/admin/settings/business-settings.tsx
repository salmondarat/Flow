"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingsCard } from "@/components/admin/profile";
import { Building, Globe, Mail, Phone, MapPin } from "lucide-react";

export function BusinessSettings() {
  const [isSaving, setIsSaving] = useState(false);

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
        title="Business Information"
        description="Manage your business details and contact information"
        icon={<Building className="h-5 w-5" />}
        action={
          <Button type="submit" form="business-form" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        }
      >
        <form id="business-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" placeholder="Your Business Name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                id="website"
                type="url"
                placeholder="https://yourbusiness.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@business.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="text-muted-foreground absolute left-3 top-8 h-4 w-4" />
              <Textarea
                id="address"
                placeholder="123 Business St, City, Country"
                className="min-h-[80px] pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your business and services"
              maxLength={500}
              rows={3}
            />
          </div>
        </form>
      </SettingsCard>
    </div>
  );
}
