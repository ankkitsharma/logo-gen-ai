'use client';

export const STYLES = ['Minimal', 'Geometric', 'Bold', 'Elegant', 'Flat'];
export const COLORS = ['Neutral', 'Dark', 'Pastel', 'Vibrant', 'Monochrome'];
export const INDUSTRIES = ['Tech', 'Finance', 'Health', 'Creator', 'SaaS'];

export default function PresetSelector({ 
  label, 
  options, 
  value, 
  onChange 
}: { 
  label: string; 
  options: string[]; 
  value: string; 
  onChange: (val: string) => void;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(value === option ? '' : option)}
            className={`px-3 py-1 text-sm rounded-full border transition-all ${
              value === option 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
