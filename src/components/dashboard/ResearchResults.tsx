import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export const ResearchResults = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: requests, error: requestsError } = await supabase
      .from("research_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error("Error loading requests:", requestsError);
      return;
    }

    const reviewsWithComponents = await Promise.all(
      (requests || []).map(async (request) => {
        const { data: components, error: componentsError } = await supabase
          .from("research_proposal_components")
          .select("*")
          .eq("research_request_id", request.id)
          .order('created_at', { ascending: true });

        if (componentsError) {
          console.error("Error loading components:", componentsError);
          return { ...request, components: [] };
        }

        return { ...request, components: components || [] };
      })
    );

    setReviews(reviewsWithComponents);
    setIsLoading(false);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      // First delete all related components
      const { error: componentsError } = await supabase
        .from("research_proposal_components")
        .delete()
        .eq("research_request_id", reviewId);

      if (componentsError) throw componentsError;

      // Then delete the research request
      const { error: requestError } = await supabase
        .from("research_requests")
        .delete()
        .eq("id", reviewId);

      if (requestError) throw requestError;

      // Update the UI
      setReviews(reviews.filter(review => review.id !== reviewId));

      toast({
        title: "Success",
        description: "Research proposal deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting research proposal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete research proposal",
      });
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-sky-900 mb-6">Research Proposal Components</h2>
      <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No research proposals generated yet.</p>
        ) : (
          <div className="space-y-8">
            {reviews.map((review, index) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-sky-800">Research Proposal #{reviews.length - index}</h3>
                  <div className="space-x-2">
                    {review.components?.some(c => c.content) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleDownload(
                          review.components.map(c => c.content).join('\n\n'),
                          'research-proposal.docx'
                        )}
                      >
                        <Download className="h-4 w-4" />
                        Download All
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{review.description}</p>
                
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Components</TabsTrigger>
                    <TabsTrigger value="title">Title & Objectives</TabsTrigger>
                    <TabsTrigger value="literature">Literature Review</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <div className="space-y-6">
                      {review.components?.map((component) => (
                        <div key={component.id} className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium text-sky-700 mb-2">
                            {component.component_type === 'literature_review' 
                              ? 'Literature Review' 
                              : 'Title & Objectives'}
                          </h4>
                          {component.content ? (
                            <div className="prose max-w-none">
                              <p className="text-sm whitespace-pre-wrap">{component.content}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-amber-600">
                              {component.status === 'pending' ? 'Processing...' : 'No content available'}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="title">
                    {review.components?.find(c => c.component_type === 'title_and_objectives')?.content ? (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">
                          {review.components.find(c => c.component_type === 'title_and_objectives')?.content}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600">No title and objectives available</p>
                    )}
                  </TabsContent>

                  <TabsContent value="literature">
                    {review.components?.find(c => c.component_type === 'literature_review')?.content ? (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">
                          {review.components.find(c => c.component_type === 'literature_review')?.content}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600">No literature review available</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};