import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { ApiKeysSettings } from "./ApiKeysSettings";
import { SidebarHistory } from "./SidebarHistory";
import { SidebarNewChat } from "./SidebarNewChat";
import { Switch } from "@/components/ui/switch";
import { useApiKeyUsage } from "@/hooks/use-api-key-usage";

interface SidebarContentProps {
  onProposalClick: (proposalId: string) => void;
  onProposalDelete: (proposalId: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
}

export const SidebarContent = ({ 
  onProposalClick, 
  onProposalDelete, 
  onNewChat, 
  onLogout 
}: SidebarContentProps) => {
  const [isApiKeysOpen, setIsApiKeysOpen] = useState(true);
  const { usesRemaining, isLoading } = useApiKeyUsage();
  const [useMedResearchKeys, setUseMedResearchKeys] = useState(() => {
    return localStorage.getItem("useMedResearchKeys") === "true";
  });

  const handleToggleMedResearch = (checked: boolean) => {
    setUseMedResearchKeys(checked);
    localStorage.setItem("useMedResearchKeys", checked.toString());
  };

  return (
    <div className="space-y-6 py-6">
      <SidebarNewChat onClick={onNewChat} />

      <SidebarHistory 
        onProposalClick={onProposalClick}
        onDelete={onProposalDelete}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <div>
            <h3 className="text-sm font-medium">Use MedResearchAI Keys</h3>
            {!isLoading && usesRemaining !== null && usesRemaining < 3 && (
              <p className="text-xs text-muted-foreground">
                {usesRemaining} uses remaining
              </p>
            )}
          </div>
          <Switch
            checked={useMedResearchKeys}
            onCheckedChange={handleToggleMedResearch}
            disabled={!isLoading && (usesRemaining !== null && usesRemaining <= 0)}
          />
        </div>
      </div>

      <Collapsible open={isApiKeysOpen} onOpenChange={setIsApiKeysOpen}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">API Keys</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isApiKeysOpen ? 'transform rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="pt-4">
            <ApiKeysSettings useMedResearchKeys={useMedResearchKeys} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button
        variant="destructive"
        className="w-full"
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  );
};