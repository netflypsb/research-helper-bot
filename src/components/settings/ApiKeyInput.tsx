import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  link?: string;
  disabled?: boolean;
}

export const ApiKeyInput = ({ label, value, onChange, link, disabled }: ApiKeyInputProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="block text-sm font-medium text-sky-700">
          {label}
        </label>
        {link && !disabled && (
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-sky-600 hover:text-sky-800"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Get API Key
          </a>
        )}
      </div>
      <Input 
        type="password" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter API key" 
        disabled={disabled}
        className={disabled ? "bg-gray-100" : ""}
      />
    </div>
  );
};