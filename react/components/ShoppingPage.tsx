import React, { useEffect, useState } from 'react';
import { ChevronLeft, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { ViewState, ShoppingItem } from '../types';
import { getShoppingRecommendations } from '../services/apiService';

interface ShoppingPageProps {
  onNavigate: (view: ViewState) => void;
  items?: ShoppingItem[];
  insight?: string;
  creationId?: string;
}

export const ShoppingPage: React.FC<ShoppingPageProps> = ({ onNavigate, items, insight, creationId }) => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(items || []);
  const [loading, setLoading] = useState<boolean>(!items && !!insight);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      // If items are passed directly, use them (mock mode or view mode)
      if (items) {
          setShoppingItems(items);
          setLoading(false);
          return;
      }

      if (!insight) {
          // No insight provided, maybe show empty or mock? 
          // For now, let's keep mock if no insight is passed for dev purposes
          if (shoppingItems.length === 0) {
            // Keep default mock data logic if desired, or show empty
            setLoading(false);
          }
          return;
      }

      const fetchItems = async () => {
          setLoading(true);
          setError(null);
          try {
              // Pass creationId if available, so backend can save the results
              const data = await getShoppingRecommendations(insight, creationId);
              if (data && data.shopping_list) {
                  // Map API response to ShoppingItem interface
                  const mappedItems: ShoppingItem[] = data.shopping_list.map((item: any, index: number) => ({
                      id: index,
                      category: item.category,
                      brand: item.brand,
                      name: item.item_name,
                      price: item.price,
                      tip: item.reason,
                      link: item.link,
                      imageUrl: item.thumbnail_url,
                      search_keyword: item.search_keyword
                  }));
                  setShoppingItems(mappedItems);
              } else {
                  setShoppingItems([]);
              }
          } catch (err) {
              console.error("Failed to fetch shopping items:", err);
              setError("Failed to load recommendations. Please try again.");
          } finally {
              setLoading(false);
          }
      };

      fetchItems();
  }, [insight, items, creationId]);

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
            {insight ? (
                <>
                Here are some curated items based on your analysis.<br/>
                We found these products that perfectly match the suggested style.
                </>
            ) : (
                "We propose a Black & Cream steady seller essential look focused on material and fit. Feel the sophistication given by the structural silhouette."
            )}
          </p>
        </div>

        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2" size={24} />
          Shopping Info
        </h3>
        
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
                <p className="text-gray-500 text-sm font-medium">Curating the best items for you...</p>
                <p className="text-gray-400 text-xs mt-1">This uses AI and might take up to 45 seconds.</p>
            </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                <p className="text-gray-800 font-bold mb-1">Oops!</p>
                <p className="text-gray-500 text-sm">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold"
                >
                    Retry
                </button>
            </div>
        ) : shoppingItems.length === 0 ? (
             <div className="text-center py-20 text-gray-400">
                 No items found.
             </div>
        ) : (
            <div className="space-y-6">
            {shoppingItems.map((item, index) => (
                <div
                key={item.id}
                className="border border-gray-200 rounded-[30px] p-5 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 relative">
                    {item.imageUrl ? (
                        <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://picsum.photos/200/200?random=${index}`;
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingCart size={24} />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-purple-500 font-black uppercase tracking-wider mb-0.5">{item.brand}</p>
                    <p className="font-bold text-gray-900 mb-1 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-500 mb-3 leading-tight line-clamp-2 italic">
                    Tip: {item.tip}
                    </p>
                    <div className="flex justify-between items-end">
                    <span className="font-black text-gray-900 text-base">{item.price}</span>
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
        )}
        
        {!loading && !error && (
            <div className="mt-12 p-8 border-2 border-dashed border-gray-200 rounded-[40px] text-center">
                <p className="text-gray-400 text-sm font-medium">More items being curated...</p>
            </div>
        )}
      </div>
    </div>
  );
};
