import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  ClipboardList,
  Calculator,
  TrendingUp,
  BarChart2,
  MessageSquare,
  Users,
  Shield,
  Zap,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: ClipboardList,
      title: "Smart Order Intake",
      description: "Customizable intake forms that capture every detail—scale, grade, paint preferences—filtering out noise and saving you time.",
      color: "gundam-cyan",
    },
    {
      icon: Calculator,
      title: "AI Estimation",
      description: "Stop guessing prices. Our AI suggests quotes based on kit complexity and historical battle data.",
      color: "gundam-yellow",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Keep clients updated with a dedicated uplink portal. Upload WIP photos and mark milestones effortlessly.",
      color: "gundam-red",
    },
    {
      icon: BarChart2,
      title: "Analytics Dashboard",
      description: "Track revenue, turnaround times, and team productivity with beautiful visualizations.",
      color: "gundam-cyan",
    },
    {
      icon: MessageSquare,
      title: "Client Communication",
      description: "Built-in messaging keeps everyone aligned. Share updates, answer questions, and build trust.",
      color: "gundam-yellow",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Scale from solo builder to multi-operator studio. Assign roles and track performance.",
      color: "gundam-red",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Professional invoicing and secure payment processing. Get paid on time, every time.",
      color: "gundam-cyan",
    },
    {
      icon: Zap,
      title: "Inventory Tracking",
      description: "Never run out of supplies. Track paints, tools, and kit inventory in one unified system.",
      color: "gundam-yellow",
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
              Features
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Everything you need to manage your custom build studio
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group hover:border-gundam-cyan/30 border-border bg-background dark:bg-card rounded-xl border p-8 transition-all duration-300 hover:shadow-lg"
                >
                  <div
                    className={`bg-${feature.color}/10 text-${feature.color} mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-${feature.color}/30 transition-colors group-hover:scale-110`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/30 border-border border-y py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-foreground mb-6 text-3xl font-bold uppercase">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
              Join hundreds of builders who have already transformed their workflow.
            </p>
            <Link
              href="/register"
              className="bg-gundam-yellow text-accent-content hover:bg-background border-gundam-yellow inline-flex items-center gap-2 border px-8 py-4 text-lg font-bold tracking-wide uppercase transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
