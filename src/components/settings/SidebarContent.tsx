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

  return (
    <div className="space-y-6 py-6">
      <SidebarNewChat onClick={onNewChat} />

      <SidebarHistory 
        onProposalClick={onProposalClick}
        onDelete={onProposalDelete}
      />

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
            <ApiKeysSettings />
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