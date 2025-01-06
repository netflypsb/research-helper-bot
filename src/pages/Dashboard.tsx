import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-900">MedResearch AI</h1>
          <Button variant="ghost" className="text-sky-700 hover:text-sky-900">
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-sky-900 mb-6">API Keys</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">
                  OpenRouter API Key
                </label>
                <Input type="password" placeholder="Enter API key" />
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">
                  SERP API Key
                </label>
                <Input type="password" placeholder="Enter API key" />
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">
                  Serper API Key
                </label>
                <Input type="password" placeholder="Enter API key" />
              </div>
              <Button className="w-full bg-primary hover:bg-sky-700">
                Save API Keys
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-sky-900 mb-6">Research Description</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your research description here..."
                className="min-h-[200px]"
              />
              <Button className="w-full bg-primary hover:bg-sky-700">
                Generate Literature Review
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;