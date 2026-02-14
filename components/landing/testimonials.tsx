"use client";
import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Solo Builder",
      avatar: "https://i.pravatar.cc/150?img=1",
      content:
        "Flow has completely transformed how I manage my custom build commissions. The progress tracking and client portal have saved me countless hours and my clients love being able to see real-time updates.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Studio Owner, Scale Model Works",
      avatar: "https://i.pravatar.cc/150?img=3",
      content:
        "Since switching to Flow, our studio's efficiency has improved dramatically. The automated pricing and order management tools have reduced our administrative work by 70%. We can focus more on building.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Professional Builder",
      avatar: "https://i.pravatar.cc/150?img=5",
      content:
        "The reference image upload feature is a game-changer. Clients can share inspiration directly through the platform, which eliminates miscommunications and ensures we're always aligned on their vision.",
      rating: 5,
    },
    {
      name: "Robert Taylor",
      role: "Commission Artist",
      avatar: "https://i.pravatar.cc/150?img=15",
      content:
        "I've tried multiple project management tools, but Flow is the first one that actually understands the custom model kit workflow. The form templates and service configurability are exactly what I needed.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Studio Manager, Custom Kits International",
      avatar: "https://i.pravatar.cc/150?img=17",
      content:
        "The change request system has solved one of our biggest pain points. Clients can request modifications, and we can approve or reject them with full visibility into price and timeline impact.",
      rating: 5,
    },
    {
      name: "Kevin Lee",
      role: "Independent Builder",
      avatar: "https://i.pravatar.cc/150?img=19",
      content:
        "Flow's multi-kit support is perfect for my Gundam diorama projects. I can manage multiple orders in one dashboard, track each separately, and keep all my client communications organized.",
      rating: 5,
    },
    {
      name: "Sophie Anderson",
      role: "Collector & Builder",
      avatar: "https://i.pravatar.cc/150?img=21",
      content:
        "The public tracking feature is brilliant. I can share my order link with anyone, and they can check progress without needing to create an account. Perfect for custom build communities.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Studio Co-Owner",
      avatar: "https://i.pravatar.cc/150?img=23",
      content:
        "Migrating to Flow was seamless. The team was productive from day one. The complexity-based pricing system perfectly matches how we've always estimated builds, but now it's automated.",
      rating: 5,
    },
    {
      name: "Elena Petrov",
      role: "Full-Time Builder",
      avatar: "https://i.pravatar.cc/150?img=25",
      content:
        "I've been using Flow for 8 months and it's become indispensable. From solo builder to scaling with a partner, Flow has grown with my business. The feature set just keeps getting better.",
      rating: 5,
    },
    {
      name: "Michael Chang",
      role: "Studio Lead, HG Custom",
      avatar: "https://i.pravatar.cc/150?img=27",
      content:
        "The admin dashboard gives us complete visibility into our studio operations. Workload distribution, revenue tracking, and performance metrics all in one place. It's like having a business analyst built in.",
      rating: 5,
    },
  ];

  const StarIcon = () => (
    <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <section id="testimonials" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20 flex flex-col gap-3 text-center"
        >
          <h2 className="from-foreground to-muted-foreground bg-linear-to-b bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
            Loved by Model Kit Builders Worldwide
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-center">
            Join hundreds of solo builders and studios using Flow to manage custom builds.
          </p>
        </motion.div>

        <div className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="mb-8 break-inside-avoid"
            >
              <div className="bg-card border-border rounded-xl border p-6 transition-colors duration-300">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="from-primary/20 to-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-full border bg-linear-to-br text-sm font-medium">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
