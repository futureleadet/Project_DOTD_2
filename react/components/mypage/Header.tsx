import React from 'react';
import { ChevronLeft, Settings } from 'lucide-react';

interface Props {
    onBack?: () => void;
}

const Header: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="bg-white text-black p-5 flex justify-between items-center shrink-0 z-20 relative border-b border-gray-100">
      <button 
        onClick={onBack}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-bold tracking-wider uppercase">My Page</h1>
      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Header;
