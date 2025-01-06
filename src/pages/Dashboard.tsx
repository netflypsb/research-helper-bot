import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResearchForm } from "@/components/dashboard/ResearchForm";
import { ResearchResults } from "@/components/dashboard/ResearchResults";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-end mb-4">
          <SettingsSidebar />
        </div>
        <div className="grid gap-8">
          <ResearchForm />
          <ResearchResults />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;