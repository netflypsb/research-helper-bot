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
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
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