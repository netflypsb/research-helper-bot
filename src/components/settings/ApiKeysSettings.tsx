import { useEffect } from "react";
import { useApiKeys } from "@/hooks/use-api-keys";
import { ApiKeysForm } from "./ApiKeysForm";

export const ApiKeysSettings = () => {
  const { apiKeys, setApiKeys, loadApiKeys, saveApiKeys, isLoading } = useApiKeys();

  useEffect(() => {
    loadApiKeys();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">API Keys</h3>
      <ApiKeysForm
        apiKeys={apiKeys}
        onChange={setApiKeys}
        onSave={saveApiKeys}
        isLoading={isLoading}
      />
    </div>
  );
};