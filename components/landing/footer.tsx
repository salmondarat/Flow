"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Facebook, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com/flowapp", icon: Facebook },
    { name: "Instagram", href: "https://instagram.com/flowapp", icon: Instagram },
    { name: "Linkedin", href: "https://linkedin.com/company/flowapp", icon: Linkedin },
    { name: "Twitter", href: "https://twitter.com/flowapp", icon: Twitter },
    { name: "GitHub", href: "https://github.com/flowapp", icon: Github },
  ];

  const productLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Integrations", href: "/integrations" },
    { name: "Changelog", href: "/changelog" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-16 md:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Link href="/" className="flex items-center gap-2 text-xl font-medium transition-opacity hover:opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9c0 .46-.04.92-.1 1.36-.05 2.2.2 2.2H12c-.46 0-.92.04-1.36.1-2.2-.2-.2-.2-.2-.79-.2-1.2H12c-1.66 0-3 1.34-3 3s1.34 3 3 3c.46 0 .92-.04 1.36-.1 2.2.2 2.2H21c.46 0 .92-.04 1.36-.1 2.2-.2.2.2.2.79-.2 1.2H12c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.46 0-.92.04-1.36.1-2.2-.2-.2-.2-.2-.79-.2-1.2H13.5z" />
              </svg>
              Flow
            </Link>
            <p className="text-muted-foreground text-sm">
              Built for Model Kit Builders
            </p>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-semibold">Newsletter</h4>
            <p className="text-muted-foreground mb-3 text-sm">
              Stay ahead with design & marketing tips and strategies that drive results.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-10"
              />
              <Button size="sm" className="h-10">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-border pt-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-3"
            >
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-muted/50"
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
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6 text-sm"
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-muted-foreground"
            >
              © {year} Flow
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
