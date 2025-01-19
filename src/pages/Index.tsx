import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Subheader from "@/components/Subheader";
import { ArrowRight, FileText, Search, BookOpen, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { renderCanvas } from "@/components/ui/canvas";
import { GlowEffect } from "@/components/ui/glow-effect";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <Subheader />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 flex-grow relative">
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

        {/* How It Works */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-sky-900 text-center mb-12">
            How MedResearch AI Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative">
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                <GlowEffect
                  colors={['#22c55e', '#4ade80', '#86efac', '#bbf7d0']}
                  mode="breathe"
                  blur="soft"
                  scale={1.05}
                  duration={4}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-sky-900 mb-2">1. Input Your Idea</h3>
                  <p className="text-sky-700">
                    Describe your research concept in simple terms
                  </p>
                </div>
              </Card>
            </div>
            
            <div className="relative">
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                <GlowEffect
                  colors={['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a']}
                  mode="breathe"
                  blur="soft"
                  scale={1.05}
                  duration={4}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-sky-900 mb-2">2. AI Analysis</h3>
                  <p className="text-sky-700">
                    Our AI searches and analyzes relevant medical literature
                  </p>
                </div>
              </Card>
            </div>
            
            <div className="relative">
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                <GlowEffect
                  colors={['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8']}
                  mode="breathe"
                  blur="soft"
                  scale={1.05}
                  duration={4}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-sky-900 mb-2">3. Generation</h3>
                  <p className="text-sky-700">
                    AI generates a complete research proposal
                  </p>
                </div>
              </Card>
            </div>
            
            <div className="relative">
              <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                <GlowEffect
                  colors={['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']}
                  mode="breathe"
                  blur="soft"
                  scale={1.05}
                  duration={4}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-sky-900 mb-2">4. Review & Export</h3>
                  <p className="text-sky-700">
                    Review, refine, and export your proposal
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-sky-900 text-center mb-12">
            Complete Research Proposal Package
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
                <GlowEffect
                  colors={['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4']}
                  mode="breathe"
                  blur="soft"
                  scale={1.05}
                  duration={4}
                />
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-sky-900 mb-4">Literature Review</h3>
                  <p className="text-sky-700">
                    Comprehensive analysis of existing research and identification of gaps
                  </p>
                </div>
              </Card>
            </div>
            <div className="relative">
              <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
                <GlowEffect
                  colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']}
                  mode="breathe"
                  blur="soft"
                  scale={1.05}
                  duration={4}
                />
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-sky-900 mb-4">Research Methodology</h3>
                  <p className="text-sky-700">
                    Detailed study design and methodology aligned with your objectives
                  </p>
                </div>
              </Card>
            </div>
            <div className="relative">
              <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
                <GlowEffect
                  colors={['#f43f5e', '#fb7185', '#fda4af', '#fecdd3']}
                  mode="breathe"
                  blur="soft"
                  scale={1.05}
                  duration={4}
                />
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-sky-900 mb-4">Professional Format</h3>
                  <p className="text-sky-700">
                    Export to Word format with proper academic formatting
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
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