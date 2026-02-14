import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function IntegrationsPage() {
  const integrations = [
    {
      category: "Payment Processing",
      tools: [
        { name: "Stripe", status: "Available", description: "Accept payments globally" },
        { name: "PayPal", status: "Available", description: "Popular payment option" },
      ],
    },
    {
      category: "Communication",
      tools: [
        { name: "Email Notifications", status: "Built-in", description: "Automated updates" },
        { name: "SMS Alerts", status: "Coming Soon", description: "SMS notifications" },
      ],
    },
    {
      category: "Analytics",
      tools: [
        { name: "Google Analytics", status: "Available", description: "Track your site" },
        { name: "Custom Reports", status: "Built-in", description: "Export detailed data" },
      ],
    },
    {
      category: "Storage",
      tools: [
        { name: "Supabase Storage", status: "Built-in", description: "Image hosting" },
        { name: "Cloudinary", status: "Coming Soon", description: "Enhanced media delivery" },
      ],
    },
  ];

  return (
    <div className="text-foreground bg-background flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 border-border border-b py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-gundam-cyan mb-4 text-5xl font-bold tracking-tight uppercase md:text-6xl">
              Integrations
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Connect Flow with the tools you already use
            </p>
          </div>
        </section>

        {/* Integrations List */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {integrations.map((category, i) => (
                <div key={category.category}>
                  <h2 className="text-gundam-cyan mb-6 text-2xl font-bold tracking-wider uppercase">
                    {category.category}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {category.tools.map((tool) => (
                      <div
                        key={tool.name}
                        className="bg-muted dark:bg-card border-border rounded-lg border p-6 hover:border-gundam-cyan/30 transition-colors"
                      >
                        <div className="mb-4">
                          <h3 className="text-foreground text-lg font-bold">{tool.name}</h3>
                          <span
                            className={`ml-2 text-xs px-2 py-1 rounded-full ${
                              tool.status === "Available"
                                ? "bg-green-500/20 text-green-500"
                                : tool.status === "Built-in"
                                  ? "bg-gundam-cyan/20 text-gundam-cyan"
                                  : "bg-muted-foreground text-muted-foreground"
                            }`}
                          >
                            {tool.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/30 border-border border-y py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-foreground mb-6 text-3xl font-bold uppercase">
              Need a Custom Integration?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
              Let's talk about how we can integrate with your existing workflow.
            </p>
            <a
              href="mailto:integrations@flow.sys"
              className="text-gundam-cyan hover:text-gundam-cyan/80 transition-colors font-bold text-lg underline"
            >
              Contact Our Team
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
