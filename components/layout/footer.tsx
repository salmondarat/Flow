"use client";

import Link from "next/link";
import { Play, BarChart2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-neutral-200 mt-auto border-t pt-16 pb-8 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-brand-500 text-white flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold">
                F
              </div>
              <span className="text-text-high text-xl font-semibold tracking-tight">
                flow
              </span>
            </div>
            <p className="text-text-muted mb-6 max-w-xs text-sm leading-relaxed">
              The management platform for custom model kit studios.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <span className="text-lg font-bold">X</span>
              </Link>
              <Link
                href="#"
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <Play className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <BarChart2 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-text-high mb-4 text-sm font-medium">Product</h4>
            <ul className="text-text-muted space-y-2 text-sm">
              <li>
                <Link
                  href="/features"
                  className="hover:text-text-high transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-text-high transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="hover:text-text-high transition-colors"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="hover:text-text-high transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-high mb-4 text-sm font-medium">Company</h4>
            <ul className="text-text-muted space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-text-high transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-text-high transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-text-high transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-text-high transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-high mb-4 text-sm font-medium">Legal</h4>
            <ul className="text-text-muted space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-text-high transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-text-high transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="hover:text-text-high transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-neutral-200 text-text-muted flex flex-col items-center justify-between border-t pt-8 text-sm md:flex-row dark:border-neutral-800">
          <p>© {new Date().getFullYear()} Flow Analytics Inc.</p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <Link
              href="/sitemap"
              className="hover:text-text-high transition-colors"
            >
              Sitemap
            </Link>
            <Link
              href="/privacy"
              className="hover:text-text-high transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-text-high transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
