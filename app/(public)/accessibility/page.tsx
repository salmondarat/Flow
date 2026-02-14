import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AccessibilityPage() {
  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight uppercase">
            Accessibility Statement
          </h1>
          <div className="bg-muted dark:bg-card border-border rounded-xl border p-8">
            <p className="text-muted-foreground text-sm mb-6">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">Our Commitment</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Flow is committed to ensuring digital accessibility for all users. We strive to follow the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">Accessibility Features</h2>
              <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                <p>We have implemented the following accessibility features:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Keyboard Navigation:</strong> All functionality is accessible via keyboard
                  </li>
                  <li>
                    <strong>Screen Reader Support:</strong> Proper semantic HTML and ARIA labels
                  </li>
                  <li>
                    <strong>Color Contrast:</strong> Text meets minimum contrast ratios for readability
                  </li>
                  <li>
                    <strong>Responsive Design:</strong> Works across desktop, tablet, and mobile devices
                  </li>
                  <li>
                    <strong>Focus Indicators:</strong> Clear visual indicators for keyboard focus
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-foreground mb-4 text-xl font-bold">Ongoing Efforts</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We continuously test and improve our platform's accessibility through:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                <li>Regular accessibility audits with both automated tools and manual testing</li>
                <li>User testing with individuals who use assistive technologies</li>
                <li>Training our development team on accessibility best practices</li>
                <li>Monitoring industry standards and guidelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-foreground mb-4 text-xl font-bold">Feedback</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We welcome feedback on the accessibility of our site. If you encounter any accessibility barriers, please contact us at{" "}
                <a href="mailto:accessibility@flow.sys" className="text-gundam-cyan hover:underline">
                  accessibility@flow.sys
                </a>
                {" "}
                and we will address your concern.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
