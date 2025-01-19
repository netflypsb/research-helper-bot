import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlowEffect } from "@/components/ui/glow-effect";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
      <div className="relative mx-auto h-full max-w-7xl border border-sky-200/50 p-6 bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <GlowEffect
          colors={['#0284c7', '#38bdf8', '#7dd3fc', '#e0f2fe']}
          mode="breathe"
          blur="soft"
          scale={1.05}
          duration={3}
        />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-6 leading-tight">
            Transform Your Medical Research Ideas into Complete Proposals
          </h1>
          <p className="text-xl text-sky-700 mb-8">
            MedResearch AI converts your research concept into a comprehensive, publication-ready proposal in minutes, not months.
          </p>
          <Button 
            className="bg-primary hover:bg-sky-700 text-lg px-8 py-6"
            onClick={() => navigate("/signup")}
          >
            Start Your Research Proposal
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};