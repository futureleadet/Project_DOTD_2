import React, { useState } from 'react';
import { Ruler } from 'lucide-react';

interface HeightDialProps {
  value: number;
  onChange: (val: number) => void;
}

const HeightDial: React.FC<HeightDialProps> = ({ value, onChange }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const displayValue = value === 0 ? 170 : value;

  const handleChange = (newVal: number) => {
      onChange(newVal);
  }

  if (isConfirmed && value > 0) {
    return (
       <div className="bg-white rounded-[20px] p-4 border border-gray-100 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <Ruler size={14} />
             </div>
             <span className="text-sm font-black text-gray-900">{value} cm</span>
          </div>
          <button 
            onClick={() => setIsConfirmed(false)}
            className="text-xs text-gray-400 underline font-medium hover:text-black transition-colors"
          >
            Change
          </button>
       </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm transition-all duration-300">
      <div className="flex flex-col items-center mb-4 mt-2">
        <div className="text-3xl font-black text-gray-900 flex items-baseline gap-1">
          {displayValue}
          <span className="text-sm font-bold text-gray-400">cm</span>
        </div>
      </div>

      <div className="relative mb-6 px-2">
        <input
          type="range"
          min="140"
          max="195"
          value={displayValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
        <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-300">
            <span>140cm</span>
            <span>195cm</span>
        </div>
      </div>

      <button 
        onClick={() => {
            if (value === 0) onChange(170); // Default to 170 if never touched but confirmed
            setIsConfirmed(true);
        }}
        className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-xs hover:bg-gray-900 transition-colors shadow-lg"
      >
        Confirm Height
      </button>
    </div>
  );
};

export default HeightDial;
