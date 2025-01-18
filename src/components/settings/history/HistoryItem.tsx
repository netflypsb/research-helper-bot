import { Button } from "@/components/ui/button";
import { Trash2, FileDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface HistoryItemProps {
  id: string;
  description: string;
  components?: {
    id: string;
    component_type: string;
    content: string;
  }[];
  onProposalClick: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const HistoryItem = ({
  id,
  description,
  components,
  onProposalClick,
  onDownload,
  onDelete,
  isDeleting,
}: HistoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between group w-full min-w-0">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onProposalClick(id)}
            className="text-sm text-left hover:text-primary truncate"
          >
            {description}
          </button>
        </div>
        <div className="flex space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload(id)}
            className="text-primary h-8 w-8"
            disabled={isDeleting}
          >
            <FileDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="text-destructive h-8 w-8"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isExpanded && components && components.length > 0 && (
        <div className="pl-8 space-y-1">
          {components.map((component) => (
            <div key={component.id} className="text-sm text-gray-600">
              {component.component_type.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};