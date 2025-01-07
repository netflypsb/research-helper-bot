import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface SidebarNewChatProps {
  onClick: () => void;
}

export const SidebarNewChat = ({ onClick }: SidebarNewChatProps) => {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={onClick}
    >
      <PlusCircle className="h-4 w-4" />
      New Chat
    </Button>
  );
};