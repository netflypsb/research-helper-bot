import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useApiKeyUsage } from "@/hooks/use-api-key-usage";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const { usesRemaining, isLoading: isLoadingUsage } = useApiKeyUsage();

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

  const checkQueuePosition = async (queueId: string) => {
    const { count } = await supabase
      .from('request_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('created_at', (await supabase
        .from('request_queue')
        .select('created_at')
        .eq('id', queueId)
        .single()).data?.created_at);

    return count;
  };

  const handleGenerateReview = async () => {
    if (isSubmitting) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to generate a research proposal.",
      });
      return;
    }

    if (!usesRemaining || usesRemaining <= 0) {
      toast({
        title: "Thank you for trying MedResearch AI",
        description: "Please subscribe to continue using our services.",
        className: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white",
      });
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-review", {
        body: {
          description,
          userId: session.user.id,
          useMedResearchKeys: true,
        },
      });

      if (error) {
        if (error.message.includes("rate limit")) {
          throw new Error("The search service is currently busy. Please try again in a few minutes.");
        }
        throw error;
      }

      if (data.status === 'queued') {
        const position = await checkQueuePosition(data.queueId);
        setQueuePosition(position);
        toast({
          title: "Request Queued",
          description: `Your request is in queue position ${position + 1}. Please wait...`,
        });
      } else {
        toast({
          title: "Success",
          description: "Research proposal generation started",
        });
        setDescription("");
        setWordCount(0);
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate research proposal. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
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
            disabled={isSubmitting}
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {wordCount}/{WORD_LIMIT} words
          </div>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-sky-700"
          onClick={handleGenerateReview}
          disabled={isLoading || wordCount === 0 || isSubmitting || isLoadingUsage || !usesRemaining || usesRemaining <= 0}
        >
          {queuePosition !== null 
            ? `Queued (Position ${queuePosition + 1})`
            : isLoading 
              ? LOADING_MESSAGES[loadingMessageIndex] 
              : !usesRemaining || usesRemaining <= 0
                ? "Subscribe to Generate More Proposals"
                : "Generate Research Proposal"}
        </Button>
      </div>
    </Card>
  );
};