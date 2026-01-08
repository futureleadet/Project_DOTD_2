import React from 'react';
import { FeedItem } from '../../types';
import { Heart } from 'lucide-react';

interface Props {
  items: FeedItem[];
  onBrowseStyles: () => void;
  onItemClick?: (item: FeedItem) => void;
}

const LikedSection: React.FC<Props> = ({ items, onBrowseStyles, onItemClick }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Heart className="text-gray-300 w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-gray-800">No liked items yet</h3>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed px-10">
          Tap the heart icon on generated looks to save them here.
        </p>
        <button 
          onClick={onBrowseStyles}
          className="mt-8 px-6 py-3 bg-gray-900 text-white text-[12px] font-bold rounded-xl hover:bg-black transition-colors"
        >
          Browse Styles
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in">
      {items.map((item) => (
        <div 
          key={item.id} 
          onClick={() => onItemClick && onItemClick(item)}
          className="relative group rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-gray-100"
        >
          <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.description} />
          <div className="absolute top-2 right-2">
             <Heart className="w-5 h-5 text-red-500 fill-red-500 drop-shadow-md" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <span className="text-white text-[13px] font-bold truncate">{item.description || "No Title"}</span>
            <span className="text-gray-300 text-[10px] mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LikedSection;
