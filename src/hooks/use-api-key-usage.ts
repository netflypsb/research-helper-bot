import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useApiKeyUsage = () => {
  const [usesRemaining, setUsesRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsage = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("api_key_usage")
      .select("uses_count")
      .eq("user_id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading API key usage:", error);
      return;
    }

    if (!data) {
      // Create initial usage record
      const { data: newData, error: insertError } = await supabase
        .from("api_key_usage")
        .insert({
          user_id: session.user.id,
          uses_count: 0
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating API key usage:", insertError);
        return;
      }

      setUsesRemaining(3 - (newData?.uses_count || 0));
    } else {
      setUsesRemaining(3 - (data.uses_count || 0));
    }
    
    setIsLoading(false);
  };

  const incrementUsage = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.rpc('increment_api_key_usage', {
      user_id_param: session.user.id
    });

    if (error) {
      console.error("Error incrementing API key usage:", error);
      return;
    }

    await loadUsage();
  };

  useEffect(() => {
    loadUsage();
  }, []);

  return {
    usesRemaining,
    incrementUsage,
    isLoading
  };
};