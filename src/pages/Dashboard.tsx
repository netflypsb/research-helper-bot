import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-end mb-4">
          <SettingsSidebar />
        </div>
        <DashboardLayout />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;