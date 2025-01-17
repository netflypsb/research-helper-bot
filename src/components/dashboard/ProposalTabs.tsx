import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalComponent } from "./ProposalComponent";
import { ProposalReferences } from "./ProposalReferences";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ProposalTabsProps {
  components: any[];
}

export const ProposalTabs = ({ components }: ProposalTabsProps) => (
  <Tabs defaultValue="all" className="w-full">
    <ScrollArea className="w-full whitespace-nowrap mb-4">
      <TabsList className="inline-flex h-10 items-center justify-start p-1 bg-gray-50">
        <TabsTrigger value="all" className="px-4">All Components</TabsTrigger>
        <TabsTrigger value="title" className="px-4">Title & Objectives</TabsTrigger>
        <TabsTrigger value="introduction" className="px-4">Introduction</TabsTrigger>
        <TabsTrigger value="literature" className="px-4">Literature Review</TabsTrigger>
        <TabsTrigger value="methodology" className="px-4">Methodology</TabsTrigger>
        <TabsTrigger value="ethical" className="px-4">Ethical Considerations</TabsTrigger>
        <TabsTrigger value="abstract" className="px-4">Abstract</TabsTrigger>
        <TabsTrigger value="references" className="px-4">References</TabsTrigger>
      </TabsList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

    <TabsContent value="all" className="mt-6">
      <div className="space-y-8">
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
        <ProposalComponent
          type="title_and_objectives"
          content={components.find(c => c.component_type === 'title_and_objectives')?.content}
          status="completed"
        />
      ) : (
        <p className="text-sm text-amber-600">No title and objectives available</p>
      )}
    </TabsContent>

    <TabsContent value="introduction">
      {components?.find(c => c.component_type === 'introduction')?.content ? (
        <ProposalComponent
          type="introduction"
          content={components.find(c => c.component_type === 'introduction')?.content}
          status="completed"
        />
      ) : (
        <p className="text-sm text-amber-600">No introduction available</p>
      )}
    </TabsContent>

    <TabsContent value="literature">
      {components?.find(c => c.component_type === 'literature_review')?.content ? (
        <ProposalComponent
          type="literature_review"
          content={components.find(c => c.component_type === 'literature_review')?.content}
          status="completed"
        />
      ) : (
        <p className="text-sm text-amber-600">No literature review available</p>
      )}
    </TabsContent>

    <TabsContent value="methodology">
      {components?.find(c => c.component_type === 'methodology')?.content ? (
        <ProposalComponent
          type="methodology"
          content={components.find(c => c.component_type === 'methodology')?.content}
          status="completed"
        />
      ) : (
        <p className="text-sm text-amber-600">No methodology section available</p>
      )}
    </TabsContent>

    <TabsContent value="ethical">
      {components?.find(c => c.component_type === 'ethical_considerations')?.content ? (
        <ProposalComponent
          type="ethical_considerations"
          content={components.find(c => c.component_type === 'ethical_considerations')?.content}
          status="completed"
        />
      ) : (
        <p className="text-sm text-amber-600">No ethical considerations available</p>
      )}
    </TabsContent>

    <TabsContent value="abstract">
      {components?.find(c => c.component_type === 'abstract')?.content ? (
        <ProposalComponent
          type="abstract"
          content={components.find(c => c.component_type === 'abstract')?.content}
          status="completed"
        />
      ) : (
        <p className="text-sm text-amber-600">No abstract available</p>
      )}
    </TabsContent>

    <TabsContent value="references">
      <ProposalReferences
        references={components?.find(c => c.component_type === 'references')?.reference_data}
        status={components?.find(c => c.component_type === 'references')?.status}
      />
    </TabsContent>
  </Tabs>
);
