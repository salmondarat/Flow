import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight uppercase">
            Privacy Policy
          </h1>
          <div className="bg-muted dark:bg-card border-border rounded-xl border p-8">
            <p className="text-muted-foreground text-sm mb-6">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">1. Information We Collect</h2>
              <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                <p>
                  Flow collects information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information (phone, address, studio name for admin accounts)</li>
                  <li>Order and payment information</li>
                  <li>Communication data (messages, support requests)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">2. How We Use Your Information</h2>
              <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                <p>We use the collected information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process orders and manage client relationships</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to improve our platform</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">3. Data Security</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">4. Data Sharing</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We do not sell your personal data. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                <li>Service providers who assist in operating our platform</li>
                <li>Business partners, with your consent</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">5. Your Rights</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time.
              </p>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-xl font-bold">6. Contact Us</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                For privacy-related inquiries, contact us at{" "}
                <a href="mailto:privacy@flow.sys" className="text-gundam-cyan hover:underline">
                  privacy@flow.sys
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
