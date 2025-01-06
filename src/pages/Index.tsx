import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-sky-900">MedResearch AI</h1>
          <div className="space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-sky-700 hover:text-sky-900"
            >
              Login
            </Button>
            <Button onClick={() => navigate("/signup")} className="bg-primary hover:bg-sky-700">
              Sign Up
            </Button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-sky-900 mb-6">
            Accelerate Your Medical Research with AI
          </h2>
          <p className="text-lg text-sky-700 mb-8">
            Generate comprehensive literature reviews in minutes, not months.
            Powered by advanced AI to help medical researchers focus on what matters most.
          </p>
          <Button onClick={() => navigate("/signup")} size="lg" className="bg-primary hover:bg-sky-700">
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-sky-900 mb-4">Smart Analysis</h3>
            <p className="text-sky-700">
              AI-powered analysis of medical literature for comprehensive insights
            </p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-sky-900 mb-4">Time Saving</h3>
            <p className="text-sky-700">
              Reduce research time from months to minutes with automated reviews
            </p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-sky-900 mb-4">Evidence Based</h3>
            <p className="text-sky-700">
              Access the latest research papers and clinical studies
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;