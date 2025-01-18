import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SidebarContent } from "./SidebarContent";

export const SettingsSidebar = () => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleProposalClick = async (proposalId: string) => {
    const { data: components } = await supabase
      .from("research_proposal_components")
      .select("*")
      .eq("research_request_id", proposalId)
      .order('created_at', { ascending: true });

    if (components) {
      setIsSheetOpen(false);
      window.dispatchEvent(new CustomEvent('loadProposal', { 
        detail: { components } 
      }));
    }
  };

  const handleNewChat = () => {
    window.dispatchEvent(new CustomEvent('clearProposal'));
    setIsSheetOpen(false);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 shadow-lg hover:shadow-slate-700/20"
        >
          <Settings className="h-4 w-4 text-slate-300" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 border-slate-800 bg-transparent backdrop-blur-xl w-[400px]">
        <SheetHeader className="p-6 bg-slate-900/90 border-b border-slate-800">
          <SheetTitle className="text-white">Settings</SheetTitle>
        </SheetHeader>
        <SidebarContent
          onProposalClick={handleProposalClick}
          onProposalDelete={() => {}}
          onNewChat={handleNewChat}
          onLogout={handleLogout}
        />
      </SheetContent>
    </Sheet>
  );
};