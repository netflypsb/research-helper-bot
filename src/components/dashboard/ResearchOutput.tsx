import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProposalTabs } from "./ProposalTabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProposalComponent } from "./ProposalComponent";
import { useToast } from "@/hooks/use-toast";
import { ProposalComponent as IProposalComponent, ProposalComponentType } from "./types";

interface ResearchOutputProps {
  viewMode: "sections" | "preview";
  setViewMode: (mode: "sections" | "preview") => void;
}

export const ResearchOutput = ({ viewMode, setViewMode }: ResearchOutputProps) => {
  const { toast } = useToast();
  const [components, setComponents] = useState<IProposalComponent[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found");
        return;
      }

      const { data: requests, error: requestError } = await supabase
        .from("research_requests")
        .select("*")
        .eq("user_id", session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (requestError) {
        console.error("Error fetching requests:", requestError);
        throw requestError;
      }

      if (!requests || requests.length === 0) {
        console.log("No requests found");
        return;
      }

      console.log("Latest request:", requests[0]);

      const [componentsResult, referencesResult] = await Promise.all([
        supabase
          .from("research_proposal_components")
          .select("*")
          .eq("research_request_id", requests[0].id)
          .order('created_at', { ascending: true }),
        supabase
          .from("research_proposal_references")
          .select("*")
          .eq("research_request_id", requests[0].id)
          .maybeSingle()
      ]);

      if (componentsResult.error) {
        console.error("Error fetching components:", componentsResult.error);
        throw componentsResult.error;
      }

      if (referencesResult.error) {
        console.error("Error fetching references:", referencesResult.error);
        throw referencesResult.error;
      }

      const allComponents = [
        ...(componentsResult.data || []),
        referencesResult.data ? {
          id: 'references',
          component_type: 'references' as ProposalComponentType,
          reference_data: referencesResult.data.reference_data,
          status: 'completed'
        } : null
      ].filter(Boolean);

      console.log("All loaded components:", allComponents);
      setComponents(allComponents);

      // Verify each expected section
      const expectedSections: ProposalComponentType[] = [
        'title_and_objectives',
        'abstract',
        'introduction',
        'literature_review',
        'methodology',
        'ethical_considerations'
      ];

      expectedSections.forEach(section => {
        const found = allComponents.find(c => c.component_type === section);
        console.log(`Section ${section} status:`, found ? 'Found' : 'Missing', found);
      });

    } catch (error) {
      console.error("Error in loadLatestProposal:", error);
      toast({
        variant: "destructive",
        title: "Error loading proposal",
        description: "Failed to load the research proposal. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    const sections: ProposalComponentType[] = [
      'title_and_objectives',
      'abstract',
      'introduction',
      'literature_review',
      'methodology',
      'ethical_considerations'
    ];
    
    return (
      <div className="space-y-8">
        {sections.map((section) => {
          const component = components?.find(c => c.component_type === section);
          console.log(`Rendering section ${section}:`, component);
          
          if (!component) {
            console.log(`Section ${section} not found in components`);
            return null;
          }

          if (!component.content) {
            console.log(`Section ${section} has no content`);
            return null;
          }

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
      
      {loading ? (
        <div className="text-center py-4">Loading proposal...</div>
      ) : components.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No proposal data available</div>
      ) : viewMode === "sections" ? (
        <ProposalTabs components={components} />
      ) : (
        <div className="overflow-auto">
          {renderPreview()}
        </div>
      )}
    </Card>
  );
};