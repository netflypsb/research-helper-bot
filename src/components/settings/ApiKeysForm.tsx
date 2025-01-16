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
  disabled?: boolean;
}

export const ApiKeysForm = ({ apiKeys, onChange, onSave, isLoading, disabled }: ApiKeysFormProps) => {
  return (
    <div className="space-y-4">
      <ApiKeyInput
        label="OpenRouter API Key"
        value={apiKeys.openrouter_key}
        onChange={(value) => onChange({ ...apiKeys, openrouter_key: value })}
        link="https://openrouter.ai/"
        disabled={disabled}
      />
      <ApiKeyInput
        label="SERP API Key"
        value={apiKeys.serp_key}
        onChange={(value) => onChange({ ...apiKeys, serp_key: value })}
        link="https://serpapi.com/"
        disabled={disabled}
      />
      <ApiKeyInput
        label="Serper API Key"
        value={apiKeys.serper_key}
        onChange={(value) => onChange({ ...apiKeys, serper_key: value })}
        link="https://serper.dev/"
        disabled={disabled}
      />
      <Button 
        className="w-full bg-primary hover:bg-sky-700"
        onClick={onSave}
        disabled={isLoading || disabled}
      >
        {isLoading ? "Saving..." : "Save API Keys"}
      </Button>
      {disabled && (
        <p className="text-sm text-muted-foreground text-center">
          Using MedResearch AI Keys. Your saved API keys will be preserved.
        </p>
      )}
    </div>
  );
};