import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Flow - The OS for Custom Model Studios",
    template: "%s | Flow",
  },
  description:
    "Streamline your custom model kit building business with Flow. Manage your custom Gunpla kit building projects, track builds, and grow your studio.",
  keywords: [
    "Flow",
    "custom model studio",
    "Gunpla",
    "Gundam",
    "model kit building",
    "custom builds",
    "plastic model",
    "gunpla management",
    "model kit tracking",
    "studio management",
  ],
  authors: [{ name: "Flow" }],
  creator: "Flow",
  publisher: "Flow",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flow.app",
    title: "Flow - The OS for Custom Model Studios",
    description:
      "Streamline your custom model kit building business with Flow. Manage your custom Gunpla kit building projects, track builds, and grow your studio.",
    siteName: "Flow",
    images: [
      {
        url: "/gundam-hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Flow - The OS for Custom Model Studios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow - The OS for Custom Model Studios",
    description:
      "Streamline your custom model kit building business with Flow. Manage your custom Gunpla kit building projects, track builds, and grow your studio.",
    images: ["/gundam-hero-bg.png"],
    creator: "@flow",
  },
  icons: {
    icon: "/icons/gunpla.svg",
    shortcut: "/icons/gunpla.svg",
    apple: "/icons/gunpla.svg",
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://flow.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} bg-background text-foreground font-sans`}
      >
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              {children}
              <Toaster />
              <Analytics />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
