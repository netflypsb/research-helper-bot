import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ResearchProposal {
  id: string;
  description: string;
  created_at: string;
  components?: {
    id: string;
    component_type: string;
    content: string;
  }[];
}

export const useProposals = () => {
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);

  const loadProposals = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // First get all research requests
    const { data: requests } = await supabase
      .from("research_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order('created_at', { ascending: false });

    if (requests) {
      // For each request, get its components
      const proposalsWithComponents = await Promise.all(
        requests.map(async (request) => {
          const { data: components } = await supabase
            .from("research_proposal_components")
            .select("*")
            .eq("research_request_id", request.id)
            .order('created_at', { ascending: true });
          
          return {
            ...request,
            components: components || []
          };
        })
      );

      // Filter out any duplicate proposals based on description and timestamp
      const uniqueProposals = proposalsWithComponents.reduce((acc: ResearchProposal[], current) => {
        const isDuplicate = acc.find(
          item => item.description === current.description && 
          new Date(item.created_at).getTime() - new Date(current.created_at).getTime() < 1000
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setProposals(uniqueProposals);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  return { proposals, setProposals, loadProposals };
};