import { Card } from "@/components/ui/card";
import { GlowEffect } from "@/components/ui/glow-effect";

export const ProblemSolutionSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
      <div className="relative">
        <Card className="p-8 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
          <GlowEffect
            colors={['#9333ea', '#a855f7', '#c084fc', '#e9d5ff']}
            mode="breathe"
            blur="soft"
            scale={1.05}
            duration={4}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold text-sky-900 mb-4">The Problem</h2>
            <p className="text-sky-700">
              Creating research proposals is time-consuming and complex. Researchers spend months on literature reviews, methodology development, and proposal formatting - time better spent on actual research.
            </p>
          </div>
        </Card>
      </div>
      <div className="relative">
        <Card className="p-8 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
          <GlowEffect
            colors={['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd']}
            mode="breathe"
            blur="soft"
            scale={1.05}
            duration={4}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold text-sky-900 mb-4">Our Solution</h2>
            <p className="text-sky-700">
              MedResearch AI automates the entire proposal creation process, from literature search to final formatting. Get a complete, well-structured research proposal in minutes, ready for review and submission.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};