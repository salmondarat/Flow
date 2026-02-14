"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/flowapp",
      icon: Twitter,
    },
    {
      name: "GitHub",
      href: "https://github.com/flowapp",
      icon: Github,
    },
  ];

  return (
    <footer className="bg-card w-full">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center space-y-6 text-center"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-medium transition-opacity hover:opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9zm9.5 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 3-1.34 3-3-1.66-3-3-3H12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3 1.66zm0 4c-2.76 0-5 2.24-5 5s2.24 5 5 5c.59 0 1.23-.08 1.62-.27l.27-.28h.79l1.59 1.59c.63.63 1.59 1.59 2.41 0 1.78-1.2 2.78-2.79 2.78H17c-1.1 0-2-.9-2-2s.9-2 2-2h-2.59c.59-.59 1.59-1.59 2.78-2.79l.28-.27c-.63-.63-.63-1.59 0-2.18-.27-1.62-.63-1.62H13.5z" />
            </svg>
            Flow
          </Link>
          <div className="flex space-x-3">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                asChild
                variant="ghost"
                size="icon"
                className="hover:bg-muted/50 h-8 w-8 rounded-full"
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
          <div className="text-muted-foreground flex flex-col items-center gap-2 text-sm sm:flex-row">
            <span>© {year} Flow</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-medium">Built for Model Kit Builders</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
