import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error: any) {
      console.error("Error checking auth state:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please try logging in again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (error.message.includes("session_not_found")) {
          // Handle case where session is already cleared
          setIsAuthenticated(false);
          navigate("/login");
          toast({
            title: "Signed out successfully",
          });
          return;
        }
        throw error;
      }

      setIsAuthenticated(false);
      navigate("/login");
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again or refresh the page",
      });
      // Force navigate to login anyway for safety
      navigate("/login");
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-sky-900 cursor-pointer hover:text-sky-700 transition-colors"
        >
          MedResearch AI
        </h1>
        <div className="space-x-4">
          {isAuthenticated ? (
            <div className="space-x-4">
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-primary hover:bg-sky-700"
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-sky-700 hover:text-sky-900"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-sky-700 hover:text-sky-900"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="bg-primary hover:bg-sky-700"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;