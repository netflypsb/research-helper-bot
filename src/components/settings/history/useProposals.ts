import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ResearchProposal {
  id: string;
  description: string;
  created_at: string;
}

export const useProposals = () => {
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);

  const loadProposals = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("research_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order('created_at', { ascending: false });

    if (data) {
      const uniqueProposals = data.reduce((acc: ResearchProposal[], current) => {
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