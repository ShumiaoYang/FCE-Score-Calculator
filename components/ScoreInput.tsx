
import React from 'react';

interface ScoreInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  max: number;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ id, label, value, onChange, max }) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numValue = parseInt(e.target.value, 10);
    if (isNaN(numValue)) {
      e.target.value = '';
    } else {
      if (numValue > max) numValue = max;
      if (numValue < 0) numValue = 0;
      e.target.value = numValue.toString();
    }
    onChange(e);
  };
  
  return (
    <div className="flex items-center justify-between space-x-4">
      <label htmlFor={id} className="text-sm font-medium text-slate-300 whitespace-nowrap">
        {label}
      </label>
      <input
        type="number"
        id={id}
        name={id}
        value={value}
        onChange={handleInput}
        min="0"
        max={max}
        placeholder="0"
        className="w-24 bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white text-right focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
      />
    </div>
  );
};

export default ScoreInput;
