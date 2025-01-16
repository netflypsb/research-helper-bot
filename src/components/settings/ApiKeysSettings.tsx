import { useEffect } from "react";
import { useApiKeys } from "@/hooks/use-api-keys";
import { ApiKeysForm } from "./ApiKeysForm";
import { supabase } from "@/integrations/supabase/client";

interface ApiKeysSettingsProps {
  useMedResearchKeys: boolean;
}

export const ApiKeysSettings = ({ useMedResearchKeys }: ApiKeysSettingsProps) => {
  const { apiKeys, setApiKeys, loadApiKeys, saveApiKeys, isLoading } = useApiKeys();

  useEffect(() => {
    if (useMedResearchKeys) {
      // When switching to MedResearch keys, reset the form
      setApiKeys({
        openrouter_key: "",
        serp_key: "",
        serper_key: "",
      });
    } else {
      // Load user's personal API keys
      loadApiKeys();
    }
  }, [useMedResearchKeys]);

  return (
    <div className="space-y-4">
      <ApiKeysForm
        apiKeys={apiKeys}
        onChange={setApiKeys}
        onSave={saveApiKeys}
        isLoading={isLoading}
        disabled={useMedResearchKeys}
      />
    </div>
  );
};