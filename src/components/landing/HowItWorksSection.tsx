import { Card } from "@/components/ui/card";
import { FileText, Search, BookOpen, FileCheck } from "lucide-react";
import { GlowEffect } from "@/components/ui/glow-effect";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: FileText,
      title: "1. Input Your Idea",
      description: "Describe your research concept in simple terms",
      colors: ['#22c55e', '#4ade80', '#86efac', '#bbf7d0']
    },
    {
      icon: Search,
      title: "2. AI Analysis",
      description: "Our AI searches and analyzes relevant medical literature",
      colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a']
    },
    {
      icon: BookOpen,
      title: "3. Generation",
      description: "AI generates a complete research proposal",
      colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8']
    },
    {
      icon: FileCheck,
      title: "4. Review & Export",
      description: "Review, refine, and export your proposal",
      colors: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto mb-16">
      <h2 className="text-3xl font-bold text-sky-900 text-center mb-12">
        How MedResearch AI Works
      </h2>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
              <GlowEffect
                colors={step.colors}
                mode="breathe"
                blur="soft"
                scale={1.05}
                duration={4}
              />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-sky-900 mb-2">{step.title}</h3>
                <p className="text-sky-700">
                  {step.description}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};