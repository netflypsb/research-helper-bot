import { Button } from "@/components/ui/button";
import { Download, FileDown, FilePdf, Trash2 } from "lucide-react";
import { exportToPdf, exportToDoc } from "@/utils/documentExport";

interface ProposalActionsProps {
  hasContent: boolean;
  onDownload: () => void;
  onDelete: () => void;
  components: any[];
}

export const ProposalActions = ({ hasContent, onDownload, onDelete, components }: ProposalActionsProps) => (
  <div className="space-x-2">
    {hasContent && (
      <>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => exportToDoc(components)}
        >
          <FileDown className="h-4 w-4" />
          Export DOC
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => exportToPdf(components)}
        >
          <FilePdf className="h-4 w-4" />
          Export PDF
        </Button>
      </>
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