import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ApiKeyInput } from "./ApiKeyInput";

export const ApiKeysSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
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

  useEffect(() => {
    loadApiKeys();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">API Keys</h3>
      <ApiKeyInput
        label="OpenRouter API Key"
        value={apiKeys.openrouter_key}
        onChange={(value) => setApiKeys({ ...apiKeys, openrouter_key: value })}
      />
      <ApiKeyInput
        label="SERP API Key"
        value={apiKeys.serp_key}
        onChange={(value) => setApiKeys({ ...apiKeys, serp_key: value })}
      />
      <ApiKeyInput
        label="Serper API Key"
        value={apiKeys.serper_key}
        onChange={(value) => setApiKeys({ ...apiKeys, serper_key: value })}
      />
      <Button 
        className="w-full bg-primary hover:bg-sky-700"
        onClick={handleSaveApiKeys}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save API Keys"}
      </Button>
    </div>
  );
};