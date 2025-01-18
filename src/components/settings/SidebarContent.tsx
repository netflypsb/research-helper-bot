import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SidebarHistory } from "./SidebarHistory";
import { SidebarNewChat } from "./SidebarNewChat";
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
  const { usesRemaining, isLoading } = useApiKeyUsage();
  const { toast } = useToast();

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
            <div>
              <h3 className="text-sm font-medium">MedResearch AI Credits</h3>
              {!isLoading && usesRemaining !== null && (
                <p className="text-xs text-slate-400">
                  {usesRemaining} free trials remaining
                </p>
              )}
            </div>
          </div>

          <div className="relative p-[1px] rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
            <div className="bg-slate-800/90 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-3">Premium Features</h3>
              <p className="text-sm text-slate-300 mb-4">
                Get unlimited access to MedResearch AI and premium features
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