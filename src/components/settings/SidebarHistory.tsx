import { Button } from "@/components/ui/button";
import { Trash2, FileDown } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToDoc } from "@/utils/documentExport";

interface ResearchProposal {
  id: string;
  description: string;
  created_at: string;
}

interface SidebarHistoryProps {
  onProposalClick: (proposalId: string) => void;
  onDelete: (proposalId: string) => void;
}

export const SidebarHistory = ({ onProposalClick, onDelete }: SidebarHistoryProps) => {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);

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
      // Filter out duplicates based on description and created_at
      const uniqueProposals = data.reduce((acc: ResearchProposal[], current) => {
        const isDuplicate = acc.find(
          item => item.description === current.description && 
          new Date(item.created_at).getTime() - new Date(current.created_at).getTime() < 1000 // Within 1 second
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setProposals(uniqueProposals);
    }
  };

  const handleDelete = async (proposalId: string) => {
    try {
      const { error: componentsError } = await supabase
        .from("research_proposal_components")
        .delete()
        .eq("research_request_id", proposalId);

      if (componentsError) throw componentsError;

      const { error: requestError } = await supabase
        .from("research_requests")
        .delete()
        .eq("id", proposalId);

      if (requestError) throw requestError;

      setProposals(proposals.filter(p => p.id !== proposalId));
      onDelete(proposalId);

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

  const handleDownload = async (proposalId: string) => {
    try {
      const { data: components, error } = await supabase
        .from("research_proposal_components")
        .select("*")
        .eq("research_request_id", proposalId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (components && components.length > 0) {
        exportToDoc(components);
        toast({
          title: "Success",
          description: "Research proposal downloaded successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No content available for download",
        });
      }
    } catch (error: any) {
      console.error("Error downloading proposal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download research proposal",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">History</h3>
      <div className="space-y-2">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="flex items-center justify-between group"
          >
            <button
              onClick={() => onProposalClick(proposal.id)}
              className="text-sm text-left hover:text-primary truncate max-w-[60%]"
            >
              {proposal.description}
            </button>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(proposal.id)}
                className="text-primary"
              >
                <FileDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(proposal.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};