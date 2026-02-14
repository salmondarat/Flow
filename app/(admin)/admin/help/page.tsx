import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Help Center | Flow Admin",
};

export default function HelpPage() {
  const faqs = [
    {
      id: 1,
      question: "How do I update an order status?",
      answer:
        "Go to Orders page, click on the order ID, and use the status dropdown to update. The client will be able to see the new status on their tracking page.",
      category: "Orders",
    },
    {
      id: 2,
      question: "How are prices calculated?",
      answer:
        "Prices are based on the service type (Full Build, Repair, Repaint) and complexity level (Low, Medium, High). The system automatically calculates this when an order is placed.",
      category: "Pricing",
    },
    {
      id: 3,
      question: "How do I add progress photos?",
      answer:
        "Progress photos can be added through the progress logs section on the order details page. Each log can include a message and optional photo URL.",
      category: "Orders",
    },
    {
      id: 4,
      question: "What's the difference between draft and estimated status?",
      answer:
        "Draft means the order was just created. Estimated means you've reviewed it and confirmed the pricing. Move orders to estimated after reviewing.",
      category: "Workflow",
    },
    {
      id: 5,
      question: "How do clients track their orders?",
      answer:
        "Clients receive their order ID after placing an order. They can visit /track and enter their ID to see progress updates, photos, and order details.",
      category: "Client",
    },
    {
      id: 6,
      question: "Can I modify an order after it's placed?",
      answer:
        "Yes, you can update the status and add progress logs. For significant changes that affect pricing, you should communicate directly with the client.",
      category: "Orders",
    },
  ];

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">
          Frequently asked questions and guides for using the admin panel
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <a
              href="/admin/orders"
              className="hover:bg-accent/50 rounded-lg border p-4 transition-colors"
            >
              <h3 className="mb-1 font-medium">Manage Orders</h3>
              <p className="text-muted-foreground text-sm">View and update order statuses</p>
            </a>
            <a
              href="/admin/dashboard"
              className="hover:bg-accent/50 rounded-lg border p-4 transition-colors"
            >
              <h3 className="mb-1 font-medium">Dashboard</h3>
              <p className="text-muted-foreground text-sm">Overview of business metrics</p>
            </a>
            <a
              href="/admin/clients"
              className="hover:bg-accent/50 rounded-lg border p-4 transition-colors"
            >
              <h3 className="mb-1 font-medium">View Clients</h3>
              <p className="text-muted-foreground text-sm">Client information and history</p>
            </a>
          </CardContent>
        </Card>

        {categories.map((category) => (
          <Card key={category} className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{category}</CardTitle>
                <Badge variant="outline">
                  {faqs.filter((f) => f.category === category).length} articles
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs
                  .filter((f) => f.category === category)
                  .map((faq) => (
                    <div key={faq.id} className="border-b pb-4 last:border-0">
                      <h4 className="mb-2 font-medium">{faq.question}</h4>
                      <p className="text-muted-foreground text-sm">{faq.answer}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Contact the development team or check the documentation for more detailed guides.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
