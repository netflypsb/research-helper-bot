import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApiKeys {
  openrouter_key: string;
  serp_key: string;
  serper_key: string;
}

export const ApiKeysForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openrouter_key: "",
    serp_key: "",
    serper_key: "",
  });

  const loadApiKeys = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();

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

  // Load API keys when component mounts
  useEffect(() => {
    loadApiKeys();
  }, []);

  return (
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
  );
};