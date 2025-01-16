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
      case 'introduction':
        return 'Introduction';
      case 'ethical_considerations':
        return 'Ethical Considerations';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white p-8 rounded-md shadow-sm border border-gray-200 max-w-[816px] mx-auto" style={{ minHeight: '1056px' }}>
      <h4 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
        {getTitle(type)}
      </h4>
      {content ? (
        <div className="prose max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-gray-800">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-gray-800">{children}</h3>,
              p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
              li: ({ children }) => <li className="mb-2">{children}</li>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-amber-600">
          {status === 'pending' ? 'Processing...' : 'No content available'}
        </p>
      )}
    </div>
  );
};