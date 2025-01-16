import { HistoryItem } from "./history/HistoryItem";
import { useProposals } from "./history/useProposals";
import { useProposalActions } from "./history/useProposalActions";

interface SidebarHistoryProps {
  onProposalClick: (proposalId: string) => void;
  onDelete: (proposalId: string) => void;
}

export const SidebarHistory = ({ onProposalClick, onDelete }: SidebarHistoryProps) => {
  const { proposals, setProposals } = useProposals();
  const { handleDelete, handleDownload, isDeleting } = useProposalActions(setProposals);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">History</h3>
      <div className="space-y-2">
        {proposals.map((proposal) => (
          <HistoryItem
            key={proposal.id}
            id={proposal.id}
            description={proposal.description}
            onProposalClick={onProposalClick}
            onDownload={handleDownload}
            onDelete={(id) => {
              handleDelete(id);
              onDelete(id);
            }}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    </div>
  );
};