import React from 'react';
import { Lock, Plus } from 'lucide-react';
import { LockedData } from './types';
import { ViewState } from '../../../types';

interface LockedViewProps {
  data: LockedData;
  onNavigate: (view: ViewState) => void;
}

export const LockedView: React.FC<LockedViewProps> = ({ data, onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6 animate-fade-in">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300 shadow-sm">
        <Lock size={40} />
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-4">{data.display_headline}</h2>
      
      <div className="w-full max-w-[240px] bg-gray-200 h-2.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-black h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${data.progress_percentage}%` }}
        />
      </div>
      
      {/* 
        Changes made:
        - Increased font size to text-sm
        - Added 'break-keep' (word-break: keep-all) to prevent awkward word splitting in Korean
        - Added 'leading-7' for better line spacing
        - Constrained width with 'max-w-[85%]' for a centered look
      */}
      <p className="text-sm text-gray-500 leading-7 whitespace-pre-line mb-10 break-keep max-w-[85%] mx-auto">
        {data.message_body}
      </p>
      
      <button 
        onClick={() => onNavigate(ViewState.CREATE)} 
        className="bg-gray-900 text-white text-sm font-bold py-4 px-10 rounded-2xl shadow-xl hover:bg-black transition-transform active:scale-95 flex items-center gap-2"
      >
        <Plus size={16} /> 스타일 더 생성하기
      </button>
    </div>
  );
};