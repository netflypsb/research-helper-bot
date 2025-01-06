import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openrouter_key: "",
    serp_key: "",
    serper_key: "",
  });
  const [description, setDescription] = useState("");

  useEffect(() => {
    checkAuth();
    loadApiKeys();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const loadApiKeys = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error loading API keys:", error);
      return;
    }

    if (data) {
      setApiKeys({
        openrouter_key: data.openrouter_key || "",
        serp_key: data.serp_key || "",
        serper_key: data.serper_key || "",
      });
    }
  };

  const handleSaveApiKeys = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("api_keys")
        .upsert({
          user_id: session.user.id,
          ...apiKeys,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API keys saved successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReview = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsLoading(true);
    try {
      // First create the research request
      const { data: requestData, error: requestError } = await supabase
        .from("research_requests")
        .insert({
          user_id: session.user.id,
          description,
          status: "pending",
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Then call the Edge Function
      const { data, error } = await supabase.functions.invoke("generate-review", {
        body: {
          description,
          userId: session.user.id,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Literature review generated successfully",
      });

      // Clear the description field
      setDescription("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-900">MedResearch AI</h1>
          <Button 
            variant="ghost" 
            className="text-sky-700 hover:text-sky-900"
            onClick={handleLogout}
          >
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
                <Input 
                  type="password" 
                  value={apiKeys.openrouter_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, openrouter_key: e.target.value })}
                  placeholder="Enter API key" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">
                  SERP API Key
                </label>
                <Input 
                  type="password" 
                  value={apiKeys.serp_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, serp_key: e.target.value })}
                  placeholder="Enter API key" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-700 mb-1">
                  Serper API Key
                </label>
                <Input 
                  type="password" 
                  value={apiKeys.serper_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, serper_key: e.target.value })}
                  placeholder="Enter API key" 
                />
              </div>
              <Button 
                className="w-full bg-primary hover:bg-sky-700"
                onClick={handleSaveApiKeys}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save API Keys"}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-sky-900 mb-6">Research Description</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your research description here..."
                className="min-h-[200px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button 
                className="w-full bg-primary hover:bg-sky-700"
                onClick={handleGenerateReview}
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Literature Review"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;