import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface ProposalComponent {
  id: string;
  component_type: string;
  content: string | null;
  status: string;
}

export const ResearchResults = () => {
  const [components, setComponents] = useState<ProposalComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: requests, error: requestsError } = await supabase
      .from("research_requests")
      .select("id")
      .eq("user_id", session.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (requestsError || !requests.length) {
      setIsLoading(false);
      return;
    }

    const { data: components, error: componentsError } = await supabase
      .from("research_proposal_components")
      .select("*")
      .eq("research_request_id", requests[0].id)
      .order('component_type', { ascending: true });

    if (componentsError) {
      console.error("Error loading components:", componentsError);
      return;
    }

    setComponents(components || []);
    setIsLoading(false);
  };

  const renderComponent = (component: ProposalComponent) => {
    if (component.status === 'pending') {
      return <p className="text-amber-600">Generating {component.component_type}...</p>;
    }

    return (
      <div className="prose prose-sky max-w-none">
        <div className="whitespace-pre-wrap">{component.content}</div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6 h-full">
      <h2 className="text-xl font-semibold text-sky-900 mb-6">Research Proposal</h2>
      <ScrollArea className="h-[calc(100vh-12rem)] w-full rounded-md border p-4">
        {components.length === 0 ? (
          <p className="text-gray-500">No proposal generated yet.</p>
        ) : (
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="space-y-8">
              {components.map((component) => (
                <div key={component.id} className="space-y-2">
                  <h3 className="text-lg font-semibold text-sky-800 capitalize">
                    {component.component_type.replace(/_/g, ' ')}
                  </h3>
                  {renderComponent(component)}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="sections">
              {components.map((component) => (
                <div key={component.id} className="mb-6 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold text-sky-800 capitalize mb-2">
                    {component.component_type.replace(/_/g, ' ')}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Status: <span className="capitalize">{component.status}</span>
                  </div>
                  {component.status === 'completed' && (
                    <div className="mt-4 prose prose-sm max-w-none">
                      {renderComponent(component)}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </ScrollArea>
    </Card>
  );
};