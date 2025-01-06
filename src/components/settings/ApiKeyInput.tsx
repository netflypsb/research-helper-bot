import { Input } from "@/components/ui/input";

interface ApiKeyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ApiKeyInput = ({ label, value, onChange }: ApiKeyInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-sky-700 mb-1">
        {label}
      </label>
      <Input 
        type="password" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter API key" 
      />
    </div>
  );
};