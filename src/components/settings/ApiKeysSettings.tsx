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
      // Load MedResearch API keys from Edge Function
      const loadMedResearchKeys = async () => {
        const { data, error } = await supabase.functions.invoke('get-medresearch-keys');
        if (!error && data) {
          setApiKeys({
            openrouter_key: data.openrouter_key || '',
            serp_key: data.serp_key || '',
            serper_key: data.serper_key || '',
          });
        }
      };
      loadMedResearchKeys();
    } else {
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