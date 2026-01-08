import React from 'react';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { ViewState, ShoppingItem } from '../types';

interface ShoppingPageProps {
  onNavigate: (view: ViewState) => void;
  items?: ShoppingItem[];
}

export const ShoppingPage: React.FC<ShoppingPageProps> = ({ onNavigate, items }) => {
  // Default mock items if none provided
  const shoppingItems: ShoppingItem[] = items || [
    {
      id: 1,
      brand: 'The Knit Company',
      name: 'Wool Blend Setup Blazer',
      price: '158,000',
      tip: 'The neckline elongates the neck line, further highlighting the soft impression.',
      link: '#',
    },
    {
      id: 2,
      brand: 'Musinsa Standard',
      name: 'Wide Denim Pants (Cream)',
      price: '45,000',
      tip: 'Cream-colored pants that lighten the heaviness of the black top. It is the fit that fits the Korean body type best.',
      link: '#',
    },
    {
      id: 3,
      brand: 'Catch Fashion',
      name: 'German Army Sneakers White',
      price: '129,000',
      tip: 'It matches the tone of the overall look and helps with a neat finish.',
      link: '#',
    },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen font-sans pb-24 overflow-y-auto">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={() => onNavigate(ViewState.CREATE)} className="p-2 mr-2 hover:bg-gray-50 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-widest mx-auto pr-8 text-center">
          D{' '}
          <span className="relative inline-block">
            O
            <span className="absolute -top-1 left-1/2 -translate-x-1/2">👕</span>
          </span>{' '}
          T D
        </h1>
      </div>

      <div className="p-6">
        <div className="mb-8 bg-gray-50 p-6 rounded-[30px] border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Essential Dandy: Timeless Softness
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            We propose a Black & Cream steady seller essential look focused on material and fit. Feel the sophistication given by the structural silhouette.
          </p>
        </div>

        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2" size={24} />
          Shopping Info
        </h3>
        
        <div className="space-y-6">
          {shoppingItems.map((item, index) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-[30px] p-5 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100">
                <img 
                    src={item.imageUrl || `https://picsum.photos/200/200?random=${index + 10}`} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-purple-500 font-black uppercase tracking-wider mb-0.5">{item.brand}</p>
                <p className="font-bold text-gray-900 mb-1 truncate">{item.name}</p>
                <p className="text-[11px] text-gray-500 mb-3 leading-tight line-clamp-2 italic">
                  Tip: {item.tip}
                </p>
                <div className="flex justify-between items-end">
                  <span className="font-black text-gray-900 text-base">{item.price} <span className="text-[10px] font-normal text-gray-400">KRW</span></span>
                  <button
                    onClick={() => window.open(item.link, '_blank')}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-8 border-2 border-dashed border-gray-200 rounded-[40px] text-center">
             <p className="text-gray-400 text-sm font-medium">More items being curated...</p>
        </div>
      </div>
    </div>
  );
};
