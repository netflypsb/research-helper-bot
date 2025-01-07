import { useState } from "react";
import { ResearchForm } from "./ResearchForm";
import { ResearchOutput } from "./ResearchOutput";

export const DashboardLayout = () => {
  const [viewMode, setViewMode] = useState<"sections" | "preview">("sections");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
      <div className="w-full">
        <ResearchForm />
      </div>
      <div className="w-full">
        <ResearchOutput viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  );
};