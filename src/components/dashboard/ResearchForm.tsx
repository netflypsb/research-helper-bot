import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LOADING_MESSAGES = [
  "Generating...",
  "Our Agents are working...",
  "Creating your Research Proposal...",
  "Analyzing your request...",
  "Almost there..."
];

const WORD_LIMIT = 500;

export const ResearchForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length <= WORD_LIMIT) {
      setDescription(text);
      setWordCount(words.length);
    } else {
      const truncatedText = words.slice(0, WORD_LIMIT).join(" ");
      setDescription(truncatedText);
      setWordCount(WORD_LIMIT);
      
      toast({
        title: "Word limit reached",
        description: "The description is limited to 500 words",
      });
    }
  };

  const handleGenerateReview = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to generate a research proposal.",
      });
      return;
    }

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

      // Get the useMedResearchKeys value from localStorage
      const useMedResearchKeys = localStorage.getItem("useMedResearchKeys") === "true";

      // Then call the Edge Function
      const { data, error } = await supabase.functions.invoke("generate-review", {
        body: {
          description,
          userId: session.user.id,
          useMedResearchKeys,
        },
      });

      if (error) {
        // Check for specific error messages
        if (error.message.includes("rate limit")) {
          throw new Error("The search service is currently busy. Please try again in a few minutes.");
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Research proposal generated successfully",
      });

      // Clear the description field
      setDescription("");
      setWordCount(0);

      // Force a reload of the page to show the new review
      window.location.reload();
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate research proposal. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessageIndex(0);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-sky-900 mb-6">Research Description</h2>
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Enter your research description here..."
            className="min-h-[400px] resize-none"
            value={description}
            onChange={handleTextChange}
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {wordCount}/{WORD_LIMIT} words
          </div>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-sky-700"
          onClick={handleGenerateReview}
          disabled={isLoading || wordCount === 0}
        >
          {isLoading ? LOADING_MESSAGES[loadingMessageIndex] : "Generate Research Proposal"}
        </Button>
      </div>
    </Card>
  );
};