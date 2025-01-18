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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [useMedResearchKeys, setUseMedResearchKeys] = useState(() => {
    // Only allow MedResearch keys if there are uses remaining
    const savedValue = localStorage.getItem("useMedResearchKeys") === "true";
    return savedValue && (!usesRemaining || usesRemaining > 0);
  });

  const handleToggleMedResearch = (checked: boolean) => {
    // Only allow enabling if there are uses remaining
    if (checked && (!usesRemaining || usesRemaining <= 0)) {
      toast({
        title: "No uses remaining",
        description: "You have used all your free MedResearchAI credits. Please subscribe or use your own API keys.",
        variant: "destructive",
      });
      return;
    }
    setUseMedResearchKeys(checked);
    localStorage.setItem("useMedResearchKeys", checked.toString());
  };

  const handleSubscribe = () => {
    toast({
      title: "Coming Soon",
      description: "Subscription features will be available soon!",
      className: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-lg border border-slate-700/50 shadow-lg backdrop-blur-sm">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        <SidebarNewChat onClick={onNewChat} />

        <SidebarHistory 
          onProposalClick={onProposalClick}
          onDelete={onProposalDelete}
        />

        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <h3 className="text-sm font-medium">Use MedResearchAI Keys</h3>
                {!isLoading && usesRemaining !== null && (
                  <p className="text-xs text-slate-400">
                    {usesRemaining} uses remaining
                  </p>
                )}
              </div>
              <Switch
                checked={useMedResearchKeys}
                onCheckedChange={handleToggleMedResearch}
                disabled={useMedResearchKeys && (!usesRemaining || usesRemaining <= 0)}
              />
            </div>
          </div>

          <div className="relative p-[1px] rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
            <div className="bg-slate-800/90 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-3">Premium Features</h3>
              <p className="text-sm text-slate-300 mb-4">
                Get unlimited access to MedResearchAI and premium features
              </p>
              <Button 
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-300 transform hover:scale-105"
              >
                Subscribe
              </Button>
            </div>
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