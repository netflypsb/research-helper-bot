import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalComponent } from "./ProposalComponent";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

interface ProposalTabsProps {
  components: any[];
}

export const ProposalTabs = ({ components }: ProposalTabsProps) => (
  <Tabs defaultValue="all" className="w-full">
    <ScrollArea className="w-full whitespace-nowrap mb-4">
      <TabsList className="inline-flex h-10 items-center justify-start">
        <TabsTrigger value="all">All Components</TabsTrigger>
        <TabsTrigger value="title">Title & Objectives</TabsTrigger>
        <TabsTrigger value="literature">Literature Review</TabsTrigger>
        <TabsTrigger value="methodology">Methodology</TabsTrigger>
        <TabsTrigger value="abstract">Abstract</TabsTrigger>
      </TabsList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

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
        <div className="prose max-w-none bg-gray-50 p-4 rounded-md">
          <ReactMarkdown>
            {components.find(c => c.component_type === 'title_and_objectives')?.content || ''}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-amber-600">No title and objectives available</p>
      )}
    </TabsContent>

    <TabsContent value="literature">
      {components?.find(c => c.component_type === 'literature_review')?.content ? (
        <div className="prose max-w-none bg-gray-50 p-4 rounded-md">
          <ReactMarkdown>
            {components.find(c => c.component_type === 'literature_review')?.content || ''}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-amber-600">No literature review available</p>
      )}
    </TabsContent>

    <TabsContent value="methodology">
      {components?.find(c => c.component_type === 'methodology')?.content ? (
        <div className="prose max-w-none bg-gray-50 p-4 rounded-md">
          <ReactMarkdown>
            {components.find(c => c.component_type === 'methodology')?.content || ''}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-amber-600">No methodology section available</p>
      )}
    </TabsContent>

    <TabsContent value="abstract">
      {components?.find(c => c.component_type === 'abstract')?.content ? (
        <div className="prose max-w-none bg-gray-50 p-4 rounded-md">
          <ReactMarkdown>
            {components.find(c => c.component_type === 'abstract')?.content || ''}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-amber-600">No abstract available</p>
      )}
    </TabsContent>
  </Tabs>
);