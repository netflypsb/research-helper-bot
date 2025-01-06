import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ApiKeys {
  openrouter_key: string;
  serp_key: string;
  serper_key: string;
}

export const useApiKeys = () => {
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

  const saveApiKeys = async () => {
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

  return {
    apiKeys,
    setApiKeys,
    loadApiKeys,
    saveApiKeys,
    isLoading,
  };
};