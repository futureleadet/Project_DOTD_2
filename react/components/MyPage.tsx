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
import ProfilePage from './generate_new/ProfilePage';
import AlertModal from './generate_new/AlertModal';
import { updateUserProfile } from '../services/apiService';

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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{isOpen: boolean, title: string, message: string}>({
      isOpen: false, title: '', message: ''
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    photo: user.avatarUrl || null,
    height: user.height || 0,
    faceShape: user.faceShape || null,
    personalColor: user.personalColor || null,
    bodyType: user.bodyType || null,
    gender: user.gender || 'Female'
  });

  // Sync user profile from props
  useEffect(() => {
    if (user) {
        setUserProfile({
            photo: user.avatarUrl || null,
            height: user.height || 0,
            faceShape: user.faceShape || null,
            personalColor: user.personalColor || null,
            bodyType: user.bodyType || null,
            gender: user.gender || 'Female'
        });
    }
  }, [user]);

  const showAlert = (title: string, message: string) => {
      setAlertInfo({ isOpen: true, title, message });
  };

  const handleProfileSave = async (newProfile: UserProfile) => {
      try {
          const updateData = {
              face_shape: newProfile.faceShape,
              personal_color: newProfile.personalColor,
              height: newProfile.height,
              gender: newProfile.gender,
              body_type: newProfile.bodyType,
              profile_image: newProfile.photo
          };

          const updatedUser = await updateUserProfile(updateData);
          
          setUserProfile({
              photo: updatedUser.avatarUrl || null,
              height: updatedUser.height || 0,
              faceShape: updatedUser.faceShape || null,
              personalColor: updatedUser.personalColor || null,
              bodyType: updatedUser.bodyType || null,
              gender: updatedUser.gender || 'Female'
          });
          
          setIsProfileOpen(false);
          showAlert("저장 완료", "프로필 정보가 저장되었습니다.");
      } catch (error) {
          console.error("Failed to update profile:", error);
          showAlert("오류", "프로필 저장에 실패했습니다.");
      }
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

  // Profile props for ProfileSection
  const uiProfile: MyPageProfileProps = {
    id: user.id,
    nickname: user.name,
    gender: userProfile.gender, 
    height: userProfile.height > 0 ? `${userProfile.height}cm` : 'Unknown',
    faceShape: userProfile.faceShape || 'Unknown', 
    bodyType: userProfile.bodyType || 'Unknown',
    personalColor: userProfile.personalColor || 'Unknown',
    profileImage: userProfile.photo || 'https://via.placeholder.com/150',
    generationCount: myItems.length,
    dailyGenerationsUsed: user.dailyGenerationsUsed || 0,
    maxDailyGenerations: user.maxDailyGenerations || 3
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

      <Header 
        onBack={() => onNavigate(ViewState.HOME)} 
        onSettingsClick={() => setIsProfileOpen(true)}
      />
      
      <div className="flex-1 overflow-y-auto">
        <ProfileSection 
            profile={uiProfile} 
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

      <ProfilePage 
          isOpen={isProfileOpen}
          profile={userProfile}
          onClose={() => setIsProfileOpen(false)}
          onSave={handleProfileSave}
          onShowAlert={showAlert}
      />

      <AlertModal 
          isOpen={alertInfo.isOpen}
          title={alertInfo.title}
          message={alertInfo.message}
          onClose={() => setAlertInfo(prev => ({...prev, isOpen: false}))}
      />
    </div>
  );
};