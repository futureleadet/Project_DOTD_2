import React from 'react';
import { ExternalLink, Quote, TriangleAlert } from 'lucide-react';
import { PersonaData, WinningFitData, MultiplierData, RedFlagData, BrandData } from './types';

/**
 * Helper to highlight text wrapped in **
 */
const HighlightedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={index} className={className}>
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export const PersonaCard: React.FC<{ data: PersonaData }> = ({ data }) => (
  <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm text-yellow-300">
          IDENTITY FOUND
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2 leading-tight whitespace-pre-line">{data.headline}</h3>
      <p className="text-xs text-gray-300 font-light leading-relaxed text-center mt-2 whitespace-pre-line">
        "{data.summary}"
      </p>
    </div>
  </div>
);

export const WinningFitCard: React.FC<{ data: WinningFitData }> = ({ data }) => (
  <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">
    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
      {data.headline}
    </h4>
    {/* Key Item Box - Consistent UI */}
    <div className="bg-green-50 rounded-xl p-3 mb-2">
      <p className="text-sm font-bold text-green-700 text-center">{data.keyword}</p>
    </div>
    <p className="text-xs text-gray-600 leading-relaxed text-center whitespace-pre-line">
      <HighlightedText 
        text={data.analysis} 
        className="font-bold text-green-700 bg-green-50 px-1 rounded" 
      />
    </p>
  </div>
);

export const MultiplierCard: React.FC<{ data: MultiplierData }> = ({ data }) => (
  <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm">
    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
      {data.headline}
    </h4>
    {/* Key Item Box */}
    <div className="bg-purple-50 rounded-xl p-3 mb-2">
      <p className="text-sm font-bold text-purple-700 text-center">{data.item_name}</p>
    </div>
    <p className="text-xs text-gray-600 leading-relaxed text-center whitespace-pre-line">
      {data.value_prop}
    </p>
  </div>
);

export const RedFlagCard: React.FC<{ data: RedFlagData }> = ({ data }) => (
  <div className="bg-red-50 rounded-2xl p-5 border border-red-100 shadow-sm relative overflow-hidden">
    <div className="relative z-10">
      <h4 className="text-sm font-bold text-red-900 mb-2 flex items-center">
        {data.headline}
      </h4>
      {/* Key Item Box - White background to stand out from the red card */}
      <div className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-red-50">
        <p className="text-sm font-bold text-red-600 text-center line-through decoration-2">
          {data.warning_item}
        </p>
      </div>
      <p className="text-xs text-red-800/80 leading-relaxed text-center whitespace-pre-line font-medium">
        "{data.reason}"
      </p>
    </div>
    <div className="absolute -bottom-2 -right-2 text-6xl text-red-200 opacity-60">
      <TriangleAlert size={64} />
    </div>
  </div>
);

export const BrandDiscoveryList: React.FC<{ brands: BrandData[] }> = ({ brands }) => (
  <div className="pt-2">
    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
      Curated For You
    </h4>
    <div className="space-y-3">
      {brands.map((brand, idx) => (
        <div 
          key={idx}
          className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h5 className="text-sm font-bold text-gray-900">{brand.name}</h5>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium mt-1.5 inline-block">
                {brand.target_item}
              </span>
            </div>
            <a 
              href={brand.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-black transition-colors p-1"
            >
                <ExternalLink size={20} />
            </a>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed flex flex-col items-center text-center mt-2 whitespace-pre-line">
            <Quote size={10} className="mb-1 text-gray-300 fill-current" />
            {brand.reason}
          </p>
        </div>
      ))}
    </div>
  </div>
);