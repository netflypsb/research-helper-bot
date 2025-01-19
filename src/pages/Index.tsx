import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Subheader from "@/components/Subheader";
import { ArrowRight, FileText, Search, BookOpen, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GridBackground } from "@/components/ui/glowing-card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Subheader />
      
      <AuroraBackground className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <GridBackground
            title="Transform Your Medical Research Ideas into Complete Proposals"
            description="MedResearch AI converts your research concept into a comprehensive, publication-ready proposal in minutes, not months."
            showAvailability={false}
            className="mb-16"
          />

          {/* Value Proposition */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <div className="p-8 backdrop-blur-sm bg-white/10 rounded-lg border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">The Problem</h2>
              <p className="text-gray-200">
                Creating research proposals is time-consuming and complex. Researchers spend months on literature reviews, methodology development, and proposal formatting - time better spent on actual research.
              </p>
            </div>
            <div className="p-8 backdrop-blur-sm bg-white/10 rounded-lg border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Solution</h2>
              <p className="text-gray-200">
                MedResearch AI automates the entire proposal creation process, from literature search to final formatting. Get a complete, well-structured research proposal in minutes, ready for review and submission.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              How MedResearch AI Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: <FileText className="w-8 h-8 text-sky-300" />,
                  title: "1. Input Your Idea",
                  description: "Describe your research concept in simple terms"
                },
                {
                  icon: <Search className="w-8 h-8 text-sky-300" />,
                  title: "2. AI Analysis",
                  description: "Our AI searches and analyzes relevant medical literature"
                },
                {
                  icon: <BookOpen className="w-8 h-8 text-sky-300" />,
                  title: "3. Generation",
                  description: "AI generates a complete research proposal"
                },
                {
                  icon: <FileCheck className="w-8 h-8 text-sky-300" />,
                  title: "4. Review & Export",
                  description: "Review, refine, and export your proposal"
                }
              ].map((step, index) => (
                <div key={index} className="p-6 backdrop-blur-sm bg-white/10 rounded-lg border border-white/20 text-center">
                  <div className="w-16 h-16 bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-200">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Button 
              className="bg-primary hover:bg-sky-700 text-lg px-8 py-6"
              onClick={() => navigate("/signup")}
            >
              Start Your Research Proposal
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </AuroraBackground>
      
      <Footer />
    </div>
  );
};

export default Index;