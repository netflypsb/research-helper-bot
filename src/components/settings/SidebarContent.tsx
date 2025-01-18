import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
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
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-lg border border-slate-700/50 shadow-lg backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        <SidebarNewChat onClick={onNewChat} />

        <SidebarHistory 
          onProposalClick={onProposalClick}
          onDelete={onProposalDelete}
        />

        <div className="space-y-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h3 className="text-sm font-medium">Use MedResearchAI Keys</h3>
              {!isLoading && usesRemaining !== null && usesRemaining < 3 && (
                <p className="text-xs text-slate-400">
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
          <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-medium">API Keys</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
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
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <Button
          variant="destructive"
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};