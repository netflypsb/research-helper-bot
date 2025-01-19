import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Subheader from "@/components/Subheader";
import { renderCanvas } from "@/components/ui/canvas";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSolutionSection } from "@/components/landing/ProblemSolutionSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

const Index = () => {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <Subheader />
      
      <div className="container mx-auto px-4 py-16 flex-grow relative">
        <HeroSection />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
      </div>

      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
      
      <Footer />
    </div>
  );
};

export default Index;