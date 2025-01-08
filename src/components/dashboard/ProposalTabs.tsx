import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalComponent } from "./ProposalComponent";
import { ReferenceOrganizer } from "./ReferenceOrganizer";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProposalTabsProps {
  components: any[];
}

export const ProposalTabs = ({ components }: ProposalTabsProps) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (components && components.length > 0) {
      loadSearchResults(components[0].research_request_id);
    }
  }, [components]);

  const loadSearchResults = async (requestId: string) => {
    const { data, error } = await supabase
      .from("search_results")
      .select("*")
      .eq("research_request_id", requestId);
    
    if (!error && data) {
      setSearchResults(data);
    }
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Components</TabsTrigger>
        <TabsTrigger value="title">Title & Objectives</TabsTrigger>
        <TabsTrigger value="literature">Literature Review</TabsTrigger>
        <TabsTrigger value="abstract">Abstract</TabsTrigger>
        <TabsTrigger value="references" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          References
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="space-y-6">
          {components?.map((component) => (
            <ProposalComponent
              key={component.id}
              type={component.component_type}
              content={component.content}
              status={component.status}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="title">
        {components?.find(c => c.component_type === 'title_and_objectives')?.content ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm whitespace-pre-wrap">
              {components.find(c => c.component_type === 'title_and_objectives')?.content}
            </p>
          </div>
        ) : (
          <p className="text-sm text-amber-600">No title and objectives available</p>
        )}
      </TabsContent>

      <TabsContent value="literature">
        {components?.find(c => c.component_type === 'literature_review')?.content ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm whitespace-pre-wrap">
              {components.find(c => c.component_type === 'literature_review')?.content}
            </p>
          </div>
        ) : (
          <p className="text-sm text-amber-600">No literature review available</p>
        )}
      </TabsContent>

      <TabsContent value="abstract">
        {components?.find(c => c.component_type === 'abstract')?.content ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm whitespace-pre-wrap">
              {components.find(c => c.component_type === 'abstract')?.content}
            </p>
          </div>
        ) : (
          <p className="text-sm text-amber-600">No abstract available</p>
        )}
      </TabsContent>

      <TabsContent value="references">
        <ReferenceOrganizer searchResults={searchResults} />
      </TabsContent>
    </Tabs>
  );
};