import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProposalTabs } from "./ProposalTabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProposalComponent } from "./ProposalComponent";

interface ResearchOutputProps {
  viewMode: "sections" | "preview";
  setViewMode: (mode: "sections" | "preview") => void;
}

export const ResearchOutput = ({ viewMode, setViewMode }: ResearchOutputProps) => {
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    loadLatestProposal();
    
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
      const [components, references] = await Promise.all([
        supabase
          .from("research_proposal_components")
          .select("*")
          .eq("research_request_id", requests[0].id)
          .order('created_at', { ascending: true }),
        supabase
          .from("research_proposal_references")
          .select("*")
          .eq("research_request_id", requests[0].id)
          .maybeSingle() // Changed from .single() to .maybeSingle()
      ]);

      const allComponents = [
        ...(components.data || []),
        references.data ? {
          id: 'references',
          component_type: 'references',
          reference_data: references.data.reference_data,
          status: 'completed'
        } : null
      ].filter(Boolean);

      setComponents(allComponents);
    }
  };

  const renderPreview = () => {
    const sections = ['title_and_objectives', 'abstract', 'literature_review', 'methodology'];
    return (
      <div className="space-y-8">
        {sections.map((section) => {
          const component = components?.find(c => c.component_type === section);
          if (!component?.content) return null;
          return (
            <ProposalComponent
              key={section}
              type={section}
              content={component.content}
              status={component.status}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Research Proposal</h2>
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
        <div className="overflow-auto">
          {renderPreview()}
        </div>
      )}
    </Card>
  );
};