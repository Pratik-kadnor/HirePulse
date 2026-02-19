import React from "react";
import { motion } from "framer-motion";
import { Cloud, Network, Smartphone, Lock, Calendar, Rocket, Inbox, Search } from "lucide-react";
// Note: using lucide-react icons where possible for consistency

const features = [
  {
    icon: "☁️",
    title: "Built for speed",
    description: "Instantly sync your notes across devices",
  },
  {
    icon: "🕸️",
    title: "Networked notes",
    description: "Form a graph of ideas with backlinked notes",
  },
  {
    icon: "📱",
    title: "iOS app",
    description: "Capture ideas on the go, online or offline",
  },
  {
    icon: "🔒",
    title: "End-to-end encryption",
    description: "Only you can access your notes",
  },
  {
    icon: "📅",
    title: "Calendar integration",
    description: "Keep track of meetings and agendas",
  },
  {
    icon: "🚀",
    title: "Publishing",
    description: "Share anything you write with one click",
  },
  {
    icon: "📥",
    title: "Instant capture",
    description: "Save snippets from your browser and Kindle",
  },
  {
    icon: "🔍",
    title: "Frictionless search",
    description: "Easily recall and index past notes and ideas",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
            Everything you need to <span className="text-primary">succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features tailored to streamline your placement journey and interview preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 group"
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px -15px rgba(124, 58, 237, 0.1)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.05,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <div className="text-4xl mb-4 p-3 bg-secondary rounded-xl inline-block group-hover:bg-primary/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 font-heading">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
