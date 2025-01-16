import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Subheader from "@/components/Subheader";
import { ArrowRight, FileText, Search, BookOpen, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <Subheader />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-6">
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

        {/* Value Proposition */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
            <h2 className="text-2xl font-semibold text-sky-900 mb-4">The Problem</h2>
            <p className="text-sky-700">
              Creating research proposals is time-consuming and complex. Researchers spend months on literature reviews, methodology development, and proposal formatting - time better spent on actual research.
            </p>
          </Card>
          <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
            <h2 className="text-2xl font-semibold text-sky-900 mb-4">Our Solution</h2>
            <p className="text-sky-700">
              MedResearch AI automates the entire proposal creation process, from literature search to final formatting. Get a complete, well-structured research proposal in minutes, ready for review and submission.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-sky-900 text-center mb-12">
            How MedResearch AI Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-2">1. Input Your Idea</h3>
              <p className="text-sky-700">
                Describe your research concept in simple terms
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-2">2. AI Analysis</h3>
              <p className="text-sky-700">
                Our AI searches and analyzes relevant medical literature
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-2">3. Generation</h3>
              <p className="text-sky-700">
                AI generates a complete research proposal
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-2">4. Review & Export</h3>
              <p className="text-sky-700">
                Review, refine, and export your proposal
              </p>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-sky-900 text-center mb-12">
            Complete Research Proposal Package
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-sky-900 mb-4">Literature Review</h3>
              <p className="text-sky-700">
                Comprehensive analysis of existing research and identification of gaps
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-sky-900 mb-4">Research Methodology</h3>
              <p className="text-sky-700">
                Detailed study design and methodology aligned with your objectives
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-sky-900 mb-4">Professional Format</h3>
              <p className="text-sky-700">
                Export to Word format with proper academic formatting
              </p>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;