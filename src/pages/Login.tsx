import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      navigate("/dashboard");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-sky-900 mb-6 text-center">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full"
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-sky-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sky-700">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-sky-900 hover:underline"
              type="button"
            >
              Sign up
            </button>
          </p>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;