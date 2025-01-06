import { Button } from "@/components/ui/button";
import { ApiKeyInput } from "./ApiKeyInput";

interface ApiKeysFormProps {
  apiKeys: {
    openrouter_key: string;
    serp_key: string;
    serper_key: string;
  };
  onChange: (newApiKeys: any) => void;
  onSave: () => void;
  isLoading: boolean;
}

export const ApiKeysForm = ({ apiKeys, onChange, onSave, isLoading }: ApiKeysFormProps) => {
  return (
    <div className="space-y-4">
      <ApiKeyInput
        label="OpenRouter API Key"
        value={apiKeys.openrouter_key}
        onChange={(value) => onChange({ ...apiKeys, openrouter_key: value })}
        link="https://openrouter.ai/"
      />
      <ApiKeyInput
        label="SERP API Key"
        value={apiKeys.serp_key}
        onChange={(value) => onChange({ ...apiKeys, serp_key: value })}
        link="https://serpapi.com/"
      />
      <ApiKeyInput
        label="Serper API Key"
        value={apiKeys.serper_key}
        onChange={(value) => onChange({ ...apiKeys, serper_key: value })}
        link="https://serper.dev/"
      />
      <Button 
        className="w-full bg-primary hover:bg-sky-700"
        onClick={onSave}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save API Keys"}
      </Button>
    </div>
  );
};