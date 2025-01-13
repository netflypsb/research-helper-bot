import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalComponent } from "./ProposalComponent";

interface ProposalTabsProps {
  components: any[];
}

export const ProposalTabs = ({ components }: ProposalTabsProps) => (
  <Tabs defaultValue="all" className="w-full">
    <TabsList className="mb-4">
      <TabsTrigger value="all">All Components</TabsTrigger>
      <TabsTrigger value="title">Title & Objectives</TabsTrigger>
      <TabsTrigger value="literature">Literature Review</TabsTrigger>
      <TabsTrigger value="methodology">Methodology</TabsTrigger>
      <TabsTrigger value="abstract">Abstract</TabsTrigger>
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

    <TabsContent value="methodology">
      {components?.find(c => c.component_type === 'methodology')?.content ? (
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm whitespace-pre-wrap">
            {components.find(c => c.component_type === 'methodology')?.content}
          </p>
        </div>
      ) : (
        <p className="text-sm text-amber-600">No methodology section available</p>
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
  </Tabs>
);