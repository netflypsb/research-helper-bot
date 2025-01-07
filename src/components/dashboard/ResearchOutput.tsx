import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProposalTabs } from "./ProposalTabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ResearchOutputProps {
  viewMode: "sections" | "preview";
  setViewMode: (mode: "sections" | "preview") => void;
}

export const ResearchOutput = ({ viewMode, setViewMode }: ResearchOutputProps) => {
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    loadLatestProposal();
    
    // Add event listeners for loading and clearing proposals
    const handleLoadProposal = (event: any) => {
      setComponents(event.detail.components);
    };
    
    const handleClearProposal = () => {
      setComponents([]);
    };
    
    window.addEventListener('loadProposal', handleLoadProposal);
    window.addEventListener('clearProposal', handleClearProposal);
    
    return () => {
      window.removeEventListener('loadProposal', handleLoadProposal);
      window.removeEventListener('clearProposal', handleClearProposal);
    };
  }, []);

  const loadLatestProposal = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: requests } = await supabase
      .from("research_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (requests && requests.length > 0) {
      const { data: components } = await supabase
        .from("research_proposal_components")
        .select("*")
        .eq("research_request_id", requests[0].id)
        .order('created_at', { ascending: true });

      setComponents(components || []);
    }
  };

  const renderPreview = () => {
    const sections = ['title_and_objectives', 'literature_review', 'abstract'];
    return (
      <div className="space-y-8">
        {sections.map((section) => {
          const component = components?.find(c => c.component_type === section);
          return component?.content ? (
            <div key={section} className="prose max-w-none">
              <h3 className="text-lg font-semibold text-sky-900 mb-2">
                {section === 'title_and_objectives' ? 'Title & Objectives' :
                 section === 'literature_review' ? 'Literature Review' : 'Abstract'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{component.content}</p>
              </div>
            </div>
          ) : null;
        })}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-sky-900">Research Proposal</h2>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "sections" | "preview")}>
          <ToggleGroupItem value="sections" aria-label="Sections view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="preview" aria-label="Preview">
            <Eye className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {viewMode === "sections" ? (
        <ProposalTabs components={components} />
      ) : (
        renderPreview()
      )}
    </Card>
  );
};