import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Reference {
  citation: string;
  doi?: string;
  year: number;
  authors: string[];
  journal: string;
  relevanceScore: number;
  keyFindings: string;
}

interface ProposalReferencesProps {
  references: Reference[] | null;
  status?: string;
}

export const ProposalReferences = ({ references, status }: ProposalReferencesProps) => {
  if (!references && status === 'pending') {
    return <p className="text-sm text-amber-600">Processing references...</p>;
  }

  if (!references) {
    return <p className="text-sm text-gray-500">No references available.</p>;
  }

  return (
    <div className="space-y-6">
      {references.map((reference, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium mb-1">{reference.citation}</p>
              <p className="text-sm text-gray-600">{reference.journal} ({reference.year})</p>
            </div>
            <Badge variant="secondary" className="ml-2">
              Relevance: {reference.relevanceScore}/5
            </Badge>
          </div>
          
          {reference.doi && (
            <a 
              href={`https://doi.org/${reference.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mb-2 inline-block"
            >
              DOI: {reference.doi}
            </a>
          )}
          
          <div className="mt-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Key Findings:</span> {reference.keyFindings}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};