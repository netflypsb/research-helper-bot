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

      // Use a Map to track unique proposals by ID
      const uniqueProposals = Array.from(
        new Map(proposalsWithComponents.map(item => [item.id, item])).values()
      );
      
      setProposals(uniqueProposals);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  return { proposals, setProposals, loadProposals };
};