import { Card } from "@/components/ui/card";
import { Link, Database, ArrowUpAZ } from "lucide-react";
import { useEffect, useState } from "react";

interface Reference {
  title: string;
  link: string;
}

interface ReferenceOrganizerProps {
  searchResults: any[];
}

export const ReferenceOrganizer = ({ searchResults }: ReferenceOrganizerProps) => {
  const [organizedReferences, setOrganizedReferences] = useState<Reference[]>([]);

  useEffect(() => {
    if (searchResults.length > 0) {
      organizeReferences();
    }
  }, [searchResults]);

  const organizeReferences = () => {
    // Extract references from search results
    const allReferences = searchResults.flatMap(result => {
      // Parse the JSONB results field which contains the actual search results
      const parsedResults = result.results?.organic || [];
      return parsedResults.map((item: any) => ({
        title: item.title || "",
        link: item.link || "",
      }));
    });

    // Remove duplicates based on URL
    const uniqueReferences = Array.from(
      new Map(allReferences.map(ref => [ref.link, ref])).values()
    );

    // Sort alphabetically by title
    const sortedReferences = uniqueReferences.sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );

    setOrganizedReferences(sortedReferences);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-sky-900">Reference List</h3>
        <div className="flex items-center gap-1 ml-auto text-sm text-gray-500">
          <ArrowUpAZ className="h-4 w-4" />
          <span>Sorted alphabetically</span>
        </div>
      </div>

      <div className="space-y-4">
        {organizedReferences.length > 0 ? (
          organizedReferences.map((ref, index) => (
            <div key={ref.link} className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
              <Link className="h-4 w-4 mt-1 flex-shrink-0 text-sky-600" />
              <div className="text-sm">
                <p className="font-medium text-sky-900">{ref.title}</p>
                <a href={ref.link} target="_blank" rel="noopener noreferrer" 
                   className="text-sky-600 hover:underline break-all">
                  {ref.link}
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No references available yet
          </p>
        )}
      </div>
    </Card>
  );
};