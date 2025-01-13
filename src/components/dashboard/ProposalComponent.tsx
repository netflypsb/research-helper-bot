import ReactMarkdown from 'react-markdown';

interface ProposalComponentProps {
  type: string;
  content: string | null;
  status: string;
}

export const ProposalComponent = ({ type, content, status }: ProposalComponentProps) => {
  const getTitle = (type: string) => {
    switch (type) {
      case 'literature_review':
        return 'Literature Review';
      case 'title_and_objectives':
        return 'Title & Objectives';
      case 'methodology':
        return 'Methodology';
      case 'abstract':
        return 'Abstract';
      default:
        return type;
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h4 className="font-medium text-sky-700 mb-2">{getTitle(type)}</h4>
      {content ? (
        <div className="prose max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-amber-600">
          {status === 'pending' ? 'Processing...' : 'No content available'}
        </p>
      )}
    </div>
  );
};