import React, { useState } from 'react';
import { Download, Copy, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { ViewState, TrendInsight } from '../types';

interface ResultPageProps {
  generatedImage: string;
  insight: TrendInsight | null;
  onNavigate: (view: ViewState) => void;
  onAddToFeed?: () => void;
  onReset?: () => void;
  mode?: 'creation' | 'view';
  onClose?: () => void;
  onShop?: (insight: string) => void; // Keeping for backward compatibility or direct call
  // Extended props
  creationId?: string;
  shoppingList?: any[]; // Using any[] to avoid circular dependency if ShoppingItem is not imported here, but better to import
}

export const ResultPage: React.FC<ResultPageProps> = ({
  generatedImage,
  insight,
  onNavigate,
  onAddToFeed,
  onReset,
  mode = 'creation',
  onClose,
  onShop,
  creationId,
  shoppingList
}) => {
  const [isDetailView, setIsDetailView] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  
  // Logic to determine if Shop button should be shown
  const showShopButton = mode === 'creation' || (mode === 'view' && shoppingList && shoppingList.length > 0);

  const handleShopClick = () => {
      if (onShop && insight) {
          onShop(insight.content);
      }
  };

  const handleDownload = () => {    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `DOTD-${Date.now()}.png`;
    link.click();
  };

  const handleBack = () => {
      if (mode === 'view' && onClose) {
          onClose();
      } else {
          onNavigate(ViewState.HOME);
      }
  };

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={handleBack} className="p-2 hover:bg-gray-50 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-widest mx-auto pr-10">
          D{' '}
          <span className="relative inline-block">
            O
            <span className="absolute -top-1 left-1/2 -translate-x-1/2">👕</span>
          </span>{' '}
          T D
        </h1>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
            {mode === 'creation' ? 'Creation Result' : 'Style Detail'}
        </h2>

        {/* Result Image */}
        <div className="relative aspect-[3/4] bg-gray-50 border border-gray-200 rounded-[40px] mb-6 flex items-center justify-center overflow-hidden shadow-inner">
          <img 
            src={generatedImage || "https://picsum.photos/600/800?random=1"} 
            alt="Outfit Result" 
            className="w-full h-full object-cover"
          />
          <button 
            className="absolute top-6 right-6 p-2 bg-white/80 rounded-full shadow-sm text-gray-600 hover:bg-white transition-colors"
            onClick={handleDownload}
          >
            <Download size={24} />
          </button>
        </div>

        {/* Buttons - Only show in creation mode */}
        {mode === 'creation' && (
            <div className="flex gap-4 mb-8">
            <button
                onClick={onAddToFeed}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-colors text-sm sm:text-base"
            >
                Upload to Feed
            </button>
            <button 
                onClick={onReset}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-colors text-sm sm:text-base"
            >
                Create Another
            </button>
            </div>
        )}

        {/* Trend Insight Section */}
        {insight && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center">
                <Sparkles size={18} className="mr-2 text-purple-500" />
                Trend Insight
              </h3>
            </div>
            <div className="p-6 border border-gray-200 rounded-[30px] relative bg-white shadow-sm">
              <button
                onClick={() => handleCopy(insight.content, 'insight')}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                {copied === 'insight' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>

              <p className="font-bold mb-4 flex items-center">🕶️ {insight.title || "Style Analysis"}</p>

              {!isDetailView ? (
                <div className="text-sm text-gray-600 space-y-3">
                  <p className="line-clamp-3">{insight.content}</p>
                  <button
                    onClick={() => setIsDetailView(true)}
                    className="text-gray-400 underline mt-4 hover:text-gray-600"
                  >
                    See Details
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-600 space-y-4">
                  <p className="whitespace-pre-line">{insight.content}</p>
                  <button
                    onClick={() => setIsDetailView(false)}
                    className="text-gray-400 underline hover:text-gray-600"
                  >
                    Collapse
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tag Section */}
        {insight && insight.tags && insight.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Tag</h3>
            <div className="p-4 border border-gray-200 rounded-2xl relative bg-gray-50">
              <div className="flex flex-wrap gap-2 pr-8">
                {insight.tags.map(tag => (
                  <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                ))}
              </div>
              <button
                onClick={() => handleCopy(insight.tags.join(' '), 'tags')}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                {copied === 'tags' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Action Button to Shopping */}
        {showShopButton && (
            <div className="mt-4">
                <button
                onClick={handleShopClick}
                className="w-full py-5 bg-gray-800 text-white rounded-xl font-bold text-lg shadow-xl active:scale-95 transition-transform hover:bg-gray-900"
                >
                {mode === 'view' ? 'View Shopping List' : 'Shop this style directly'}
                </button>
            </div>
        )}
      </div>
    </>
  );

  if (mode === 'view') {
      return (
          <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-sm pt-safe pb-safe" onClick={onClose}>
              <div 
                className="w-full max-w-md bg-white h-full overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                  {content}
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen font-sans pb-24">
      {content}
    </div>
  );
};