import React from 'react';
import { FeedItem } from '../../types';

interface Props {
  items: FeedItem[];
  onItemClick?: (item: FeedItem) => void;
}

const GenerationsGrid: React.FC<Props> = ({ items, onItemClick }) => {
  if (items.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-sm">No generations yet.</p>
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
          <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.description || "Generated Image"} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <span className="text-white text-[13px] font-bold truncate w-full">{item.description || "No Title"}</span>
            <span className="text-gray-300 text-[10px] mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenerationsGrid;
