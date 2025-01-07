import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings, ChevronDown, Trash2 } from "lucide-react";
import { ApiKeysSettings } from "./ApiKeysSettings";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ResearchProposal {
  id: string;
  description: string;
  created_at: string;
}

export const SettingsSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("research_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setProposals(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleDelete = async (proposalId: string) => {
    try {
      // Delete related components first
      const { error: componentsError } = await supabase
        .from("research_proposal_components")
        .delete()
        .eq("research_request_id", proposalId);

      if (componentsError) throw componentsError;

      // Then delete the main request
      const { error: requestError } = await supabase
        .from("research_requests")
        .delete()
        .eq("id", proposalId);

      if (requestError) throw requestError;

      // Update local state
      setProposals(proposals.filter(p => p.id !== proposalId));

      toast({
        title: "Success",
        description: "Research proposal deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting proposal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete research proposal",
      });
    }
  };

  const handleProposalClick = async (proposalId: string) => {
    const { data: components } = await supabase
      .from("research_proposal_components")
      .select("*")
      .eq("research_request_id", proposalId)
      .order('created_at', { ascending: true });

    if (components) {
      // Close the sidebar sheet
      setIsSheetOpen(false);
      
      // Trigger a custom event to update the ResearchOutput component
      window.dispatchEvent(new CustomEvent('loadProposal', { 
        detail: { components } 
      }));
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          {/* History Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">History</h3>
            <div className="space-y-2">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between group"
                >
                  <button
                    onClick={() => handleProposalClick(proposal.id)}
                    className="text-sm text-left hover:text-primary truncate max-w-[80%]"
                  >
                    {proposal.description}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(proposal.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* API Keys Section */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">API Keys</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
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
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};