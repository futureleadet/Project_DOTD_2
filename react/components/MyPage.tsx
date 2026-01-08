import React, { useState, useEffect } from 'react';
import { User, ViewState, FeedItem } from '../types';
import { getCreationsForUser, getLikedCreations } from '../services/apiService';
import Header from './mypage/Header';
import ProfileSection from './mypage/ProfileSection';
import Tabs from './mypage/Tabs';
import GenerationsGrid from './mypage/GenerationsGrid';
import LikedSection from './mypage/LikedSection';
import BrandArchiveSection from './mypage/BrandArchiveSection';
import { TabType, MyPageProfileProps } from './mypage/types';
import { ResultPage } from './ResultPage';

interface MyPageProps {
  user: User;
  onNavigate: (view: ViewState) => void;
}

export const MyPage: React.FC<MyPageProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('generations');
  const [myItems, setMyItems] = useState<FeedItem[]>([]);
  const [likedItems, setLikedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  
  // Transform User to MyPageProfileProps
  // Note: Missing fields are hardcoded or left empty for now until DB schema is updated
  const userProfile: MyPageProfileProps = {
    id: user.id,
    nickname: user.name,
    gender: 'Unknown', 
    height: 'Unknown',
    faceShape: 'Unknown', 
    bodyType: 'Unknown',
    personalColor: 'Unknown',
    profileImage: user.avatarUrl || 'https://via.placeholder.com/150',
    generationCount: myItems.length
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [creations, liked] = await Promise.all([
          getCreationsForUser(100), // Fetch up to 100 items
          getLikedCreations(100)
        ]);
        
        // Transform Creation[] to FeedItem[] if necessary (assuming API returns compatible structure or transforming here)
        // API service returns Creation[], which is very similar to FeedItem. 
        // We might need to map fields: media_url -> imageUrl, created_at -> createdAt
        
        const mapCreationToFeedItem = (c: any): FeedItem => ({
            id: c.id,
            imageUrl: c.media_url,
            authorId: c.user_id,
            authorName: user.name, // Current user is author
            createdAt: c.created_at,
            likes: c.likes_count,
            isLiked: c.is_liked,
            tags: c.tags_array || [],
            description: c.prompt,
            trendInsight: c.recommendation_text
        });

        setMyItems(creations.map(mapCreationToFeedItem));
        setLikedItems(liked.map(mapCreationToFeedItem));

      } catch (error) {
        console.error("Failed to load MyPage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleTabContent = () => {
      switch (activeTab) {
          case 'generations':
              return <GenerationsGrid items={myItems} onItemClick={setSelectedItem} />;
          case 'liked':
              return <LikedSection items={likedItems} onBrowseStyles={() => onNavigate(ViewState.FEED)} onItemClick={setSelectedItem} />;
          case 'brand-archive':
              return <BrandArchiveSection />;
          default:
              return null;
      }
  };

  const handleDiscovery = () => {
      alert("Style discovery feature coming soon!");
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
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
        />
      )}

      <Header onBack={() => onNavigate(ViewState.HOME)} />
      
      <div className="flex-1 overflow-y-auto">
        <ProfileSection 
            profile={userProfile} 
            onDiscovery={handleDiscovery} 
            isLoading={loading} 
        />
        
        <div className="h-2 bg-gray-50 border-t border-b border-gray-100"></div>

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-4 min-h-[400px]">
             {loading ? (
                 <div className="flex justify-center py-20 text-gray-400">Loading...</div>
             ) : (
                 handleTabContent()
             )}
        </div>
      </div>
    </div>
  );
};