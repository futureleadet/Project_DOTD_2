import React, { useState, useEffect, useRef } from 'react';
import { FeedItem, ViewState, User, Creation } from '../types';
import { Search, Heart, CheckCircle2, Trash2 } from 'lucide-react';
import { getFeedCreations, likeCreation, unlikeCreation, toggleAdminPick, deleteCreationAdmin } from '../services/apiService';
import { ResultPage } from './ResultPage';

interface FeedProps {
  currentUser: User | null;
  onNavigate: (view: ViewState) => void;
  onShop?: (insight: string, items?: any[], creationId?: string) => void;
}

// Helper to map API's Creation object to frontend's FeedItem
const mapCreationToFeedItem = (creation: Creation): FeedItem => {
  let shoppingList = undefined;
  if (creation.shopping_results) {
      try {
          const parsed = typeof creation.shopping_results === 'string' ? JSON.parse(creation.shopping_results) : creation.shopping_results;
          if (parsed && parsed.shopping_list) {
              shoppingList = parsed.shopping_list.map((item: any, index: number) => ({
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
          }
      } catch (e) {
          console.error("Failed to parse shopping results", e);
      }
  }

  return {
    id: creation.id,
    imageUrl: creation.media_url,
    authorId: creation.user_id,
    authorName: creation.author_name || 'Anonymous',
    createdAt: creation.created_at,
    likes: creation.likes_count,
    isLiked: creation.is_liked || false,
    tags: creation.tags_array || [],
    description: creation.prompt,
    isPicked: creation.is_picked_by_admin || false,
    trendInsight: creation.recommendation_text,
    shoppingList: shoppingList
  };
};

export const Feed: React.FC<FeedProps> = ({ currentUser, onNavigate, onShop }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [filter, setFilter] = useState('latest'); // latest | popular
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  
  const observer = useRef<IntersectionObserver>();
  const lastItemElementRef = useRef<HTMLDivElement>(null);

  const fetchItems = async (currentOffset: number, currentFilter: string, replace: boolean = false) => {
    if (loading || (!hasMore && !replace)) return;
    setLoading(true);
    try {
      const newCreations = await getFeedCreations(currentFilter, limit, currentOffset);
      const newItems = newCreations.map(mapCreationToFeedItem);
      if (replace) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
      setHasMore(newItems.length === limit);
      setOffset(currentOffset + newItems.length);
    } catch (error) {
      console.error("Failed to fetch feed items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    setOffset(0);
    setHasMore(true);
    fetchItems(0, filter, true);
  }, [filter]);
  
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchItems(offset, filter);
      }
    });

    if (lastItemElementRef.current) {
      observer.current.observe(lastItemElementRef.current);
    }
    return () => observer.current?.disconnect();
  }, [loading, hasMore, offset, filter]);
  

  const handleItemClick = (item: FeedItem) => {
    setSelectedItem(item);
  };

  const handleCopyLink = () => {
    // Simulate copy
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };
  
  const handleLikeToggle = async (item: FeedItem) => {
      if (!currentUser) {
          alert("Please login to like items.");
          onNavigate(ViewState.LOGIN);
          return;
      }
      
      const originalItem = items.find(i => i.id === item.id);
      if (!originalItem) return;

      // Optimistic update
      const updatedItems = items.map(i => 
          i.id === item.id ? { ...i, isLiked: !i.isLiked, likes: i.isLiked ? i.likes - 1 : i.likes + 1 } : i
      );
      setItems(updatedItems);
      if(selectedItem?.id === item.id) {
          setSelectedItem(prev => prev ? { ...prev, isLiked: !prev.isLiked, likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1 } : null);
      }

      try {
          if (item.isLiked) {
              await unlikeCreation(item.id);
          } else {
              await likeCreation(item.id);
          }
      } catch (error) {
          // Revert on error
          console.error("Failed to toggle like:", error);
          setItems(items.map(i => i.id === item.id ? originalItem : i));
          if(selectedItem?.id === item.id) setSelectedItem(originalItem);
          alert("Failed to update like status.");
      }
  };

  const handleAdminDelete = async (e: React.MouseEvent, creationId: string | number) => {
    e.stopPropagation(); // Prevent modal from opening
    if (!window.confirm("Are you sure you want to delete this creation as an admin?")) return;

    try {
      await deleteCreationAdmin(String(creationId));
      setItems(prevItems => prevItems.filter(item => item.id !== creationId));
    } catch (error) {
      console.error("Failed to delete creation as admin:", error);
      alert("Admin deletion failed.");
    }
  };

  const handleAdminPick = async (e: React.MouseEvent, creationId: string | number) => {
    e.stopPropagation(); // Prevent modal from opening

    // Optimistic update
    setItems(prevItems => prevItems.map(item => 
      item.id === creationId ? { ...item, isPicked: !item.isPicked } : item
    ));

    try {
      await toggleAdminPick(String(creationId));
    } catch (error) {
      console.error("Failed to pick creation as admin:", error);
      alert("Admin pick failed.");
      // Revert on error
      setItems(prevItems => prevItems.map(item => 
        item.id === creationId ? { ...item, isPicked: !item.isPicked } : item
      ));
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-14">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto bg-white/95 backdrop-blur z-30 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">Feed</h1>
        <div className="flex space-x-3 text-sm font-medium">
          <button 
            onClick={() => setFilter('popular')}
            className={filter === 'popular' ? 'text-black' : 'text-gray-400'}
          >
            Popular
          </button>
          <button 
             onClick={() => setFilter('latest')}
             className={filter === 'latest' ? 'text-black' : 'text-gray-400'}
          >
            Latest
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 mb-4 mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search styles (ex. Vintage, Casual...)" 
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="px-2">
        <div className="grid grid-cols-2 gap-2"> {/* Changed to grid grid-cols-2 gap-2 */}
          {items.map((item, index) => (
            <div 
              key={item.id} 
              onClick={() => handleItemClick(item)}
              ref={index === items.length - 1 ? lastItemElementRef : null}
              className="relative rounded-xl overflow-hidden bg-gray-200 cursor-pointer group aspect-[3/4]" /* Added aspect-[3/4] for consistent image size */
            >
              <img 
                src={item.imageUrl} 
                alt={item.description}
                className="w-full h-full object-cover" /* Changed to h-full to fill container */
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors"></div>
              
              {/* User-facing info */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                <div className="text-[10px] text-white/90 font-mono bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {item.authorName}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex flex-col items-center">
                     <Heart className={`w-4 h-4 text-white ${item.isLiked ? "fill-red-500" : "fill-white"} drop-shadow-sm`} />
                     <span className="text-[10px] text-white font-medium drop-shadow-sm">{item.likes}</span>
                  </div>
                </div>
              </div>

              {/* Admin-only controls */}
              {currentUser?.role === 'ADMIN' && (
                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleAdminPick(e, item.id)}
                    className={`p-2 rounded-full backdrop-blur-md transition-colors ${item.isPicked ? 'bg-purple-600 text-white' : 'bg-white/50 text-gray-800 hover:bg-purple-500 hover:text-white'}`}
                    title={item.isPicked ? "Unpick" : "Pick"}
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleAdminDelete(e, item.id)}
                    className="p-2 rounded-full bg-white/50 text-gray-800 hover:bg-red-500 hover:text-white backdrop-blur-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {loading && <p className="text-center col-span-2 py-4">Loading more...</p>}
        {!hasMore && items.length > 0 && <p className="text-center col-span-2 py-4 text-xs text-gray-500">You've reached the end.</p>}
        {!loading && items.length === 0 && <p className="text-center col-span-2 py-20 text-gray-500">No items in the feed yet.</p>}
      </div>

      {/* Detail Modal (ResultPage) */}
      {selectedItem && (
        <ResultPage
          mode="view"
          generatedImage={selectedItem.imageUrl}
          insight={selectedItem.trendInsight ? {
             title: "Style Analysis", // Default title as it might not be stored
             content: selectedItem.trendInsight,
             tags: selectedItem.tags
          } : null}
          onNavigate={onNavigate}
          onClose={() => setSelectedItem(null)}
          onShop={() => {
              if (onShop) {
                  onShop(selectedItem.trendInsight || '', selectedItem.shoppingList, selectedItem.id);
              }
          }}
          shoppingList={selectedItem.shoppingList}
          creationId={selectedItem.id}
          isLiked={selectedItem.isLiked}
          likesCount={selectedItem.likes}
          onLikeToggle={() => handleLikeToggle(selectedItem)}
        />
      )}
    </div>
  );
};
