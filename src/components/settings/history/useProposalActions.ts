import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToDoc } from "@/utils/documentExport";

export const useProposalActions = (setProposals: (proposals: any[]) => void) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (proposalId: string) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const { error: literatureError } = await supabase
        .from("literature_required_schemas")
        .delete()
        .eq("research_request_id", proposalId);

      if (literatureError) throw literatureError;

      const { error: componentsError } = await supabase
        .from("research_proposal_components")
        .delete()
        .eq("research_request_id", proposalId);

      if (componentsError) throw componentsError;

      const { error: searchError } = await supabase
        .from("search_results")
        .delete()
        .eq("research_request_id", proposalId);

      if (searchError) throw searchError;

      const { error: requestError } = await supabase
        .from("research_requests")
        .delete()
        .eq("id", proposalId);

      if (requestError) throw requestError;

      setProposals(prev => prev.filter(p => p.id !== proposalId));

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
    } finally {
      setIsDeleting(false);
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

  return { handleDelete, handleDownload, isDeleting };
};