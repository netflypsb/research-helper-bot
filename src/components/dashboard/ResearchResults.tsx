import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ResearchResults = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("research_requests")
      .select("*")
      .eq("user_id", session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
      return;
    }

    setReviews(data || []);
    setIsLoading(false);
  };

  const handleDownload = (review: string) => {
    // Create a blob with the review content
    const blob = new Blob([review], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'literature-review.docx';
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
      <h2 className="text-xl font-semibold text-sky-900 mb-6">Generated Literature Reviews</h2>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews generated yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sky-800">Research #{reviews.length - index}</h3>
                  {review.result && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleDownload(review.result)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{review.description}</p>
                {review.result ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{review.result}</p>
                  </div>
                ) : (
                  <p className="text-sm text-amber-600">
                    {review.status === 'pending' ? 'Processing...' : 'No result available'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};