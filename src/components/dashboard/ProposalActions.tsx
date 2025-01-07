import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

interface ProposalActionsProps {
  hasContent: boolean;
  onDownload: () => void;
  onDelete: () => void;
}

export const ProposalActions = ({ hasContent, onDownload, onDelete }: ProposalActionsProps) => (
  <div className="space-x-2">
    {hasContent && (
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onDownload}
      >
        <Download className="h-4 w-4" />
        Download All
      </Button>
    )}
    <Button
      variant="destructive"
      size="sm"
      className="flex items-center gap-2"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  </div>
);