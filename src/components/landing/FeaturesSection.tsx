import { Card } from "@/components/ui/card";
import { GlowEffect } from "@/components/ui/glow-effect";

export const FeaturesSection = () => {
  const features = [
    {
      title: "Literature Review",
      description: "Comprehensive analysis of existing research and identification of gaps",
      colors: ['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4']
    },
    {
      title: "Research Methodology",
      description: "Detailed study design and methodology aligned with your objectives",
      colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']
    },
    {
      title: "Professional Format",
      description: "Export to Word format with proper academic formatting",
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-sky-900 text-center mb-12">
        Complete Research Proposal Package
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="relative">
            <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
              <GlowEffect
                colors={feature.colors}
                mode="breathe"
                blur="soft"
                scale={1.05}
                duration={4}
              />
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-sky-900 mb-4">{feature.title}</h3>
                <p className="text-sky-700">
                  {feature.description}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};