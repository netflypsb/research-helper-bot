import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import { ApiKeysSettings } from "./ApiKeysSettings";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const SettingsSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <ApiKeysSettings />
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};