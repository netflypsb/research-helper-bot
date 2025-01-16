import { Button } from "@/components/ui/button";
import { Trash2, FileDown } from "lucide-react";

interface HistoryItemProps {
  id: string;
  description: string;
  onProposalClick: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const HistoryItem = ({
  id,
  description,
  onProposalClick,
  onDownload,
  onDelete,
  isDeleting,
}: HistoryItemProps) => {
  return (
    <div className="flex items-center justify-between group">
      <button
        onClick={() => onProposalClick(id)}
        className="text-sm text-left hover:text-primary truncate max-w-[60%]"
      >
        {description}
      </button>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDownload(id)}
          className="text-primary"
          disabled={isDeleting}
        >
          <FileDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="text-destructive"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};