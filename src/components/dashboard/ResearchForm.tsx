import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ResearchForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");

  const handleGenerateReview = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsLoading(true);
    try {
      // First create the research request
      const { data: requestData, error: requestError } = await supabase
        .from("research_requests")
        .insert({
          user_id: session.user.id,
          description,
          status: "pending",
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Then call the Edge Function
      const { data, error } = await supabase.functions.invoke("generate-review", {
        body: {
          description,
          userId: session.user.id,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Research proposal generated successfully",
      });

      // Clear the description field
      setDescription("");

      // Force a reload of the page to show the new review
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-sky-900 mb-6">Research Description</h2>
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your research description here..."
          className="min-h-[400px] resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button 
          className="w-full bg-primary hover:bg-sky-700"
          onClick={handleGenerateReview}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Research Proposal"}
        </Button>
      </div>
    </Card>
  );
};