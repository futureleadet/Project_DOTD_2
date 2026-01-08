import React, { useState, useEffect } from 'react';
import { User, ViewState, FeedItem, UserProfile, TrendInsight, Task } from '../types';
import { createGenerationTask, getTaskStatus, updateUserProfile } from '../services/apiService';
import GeneratePage from './generate_new/GeneratePage';
import ProfilePage from './generate_new/ProfilePage';
import AlertModal from './generate_new/AlertModal';
import { ResultPage } from './ResultPage';

interface GenerateProps {
  currentUser: User | null;
  onNavigate: (view: ViewState) => void;
  onAddToFeed: (item: FeedItem) => void;
  onShop?: (insight: string, items?: any[], creationId?: string) => void;
}

export const Generate: React.FC<GenerateProps> = ({ currentUser, onNavigate, onAddToFeed, onShop }) => {
  const [stage, setStage] = useState<'input' | 'loading' | 'result' | 'error'>('input');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Alert State
  const [alertInfo, setAlertInfo] = useState<{isOpen: boolean, title: string, message: string}>({
      isOpen: false, title: '', message: ''
  });

  // Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    photo: null,
    height: 0,
    faceShape: null,
    personalColor: null,
    bodyType: null,
    gender: 'Female'
  });

  // Result State
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [insight, setInsight] = useState<TrendInsight | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [generationResult, setGenerationResult] = useState<any | null>(null);

  // Sync user profile from props
  useEffect(() => {
    if (currentUser) {
        setUserProfile({
            photo: currentUser.generationPhoto || null,
            height: currentUser.height || 0,
            faceShape: currentUser.faceShape || null,
            personalColor: currentUser.personalColor || null,
            bodyType: currentUser.bodyType || null,
            gender: currentUser.gender || 'Female'
        });
    }
  }, [currentUser]);

  const showAlert = (title: string, message: string) => {
      setAlertInfo({ isOpen: true, title, message });
  };

  const handleProfileSave = async (newProfile: UserProfile) => {
      if (!currentUser) return;
      
      try {
          // Prepare data for API
          const updateData = {
              face_shape: newProfile.faceShape,
              personal_color: newProfile.personalColor,
              height: newProfile.height,
              gender: newProfile.gender,
              body_type: newProfile.bodyType,
              profile_image: newProfile.photo // Base64 or URL
          };

          const updatedUser = await updateUserProfile(updateData);
          
          // Update local state
          setUserProfile({
              photo: updatedUser.generationPhoto || null,
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

  const handleGenerate = async (params: { prompt: string, colors: string[], style: string }) => {
      if (!currentUser) {
          onNavigate(ViewState.LOGIN);
          return;
      }

      setStage('loading');

      try {
          // No need to fetch and send image from frontend anymore!
          // Backend will automatically use the user's profile photo from DB.
          const { task_id } = await createGenerationTask({
              imageFile: null, // Let backend handle it
              prompt: params.prompt,
              gender: userProfile.gender,
              height: userProfile.height,
              bodyType: userProfile.bodyType || 'average',
              style: params.style,
              colors: params.colors,
          });

          // Start polling
          const intervalId = setInterval(async () => {
            try {
              const task: Task = await getTaskStatus(task_id);
    
              if (task.status === 'completed' && task.result?.creation) {
                clearInterval(intervalId);
                setGenerationResult(task.result);
                setGeneratedImage(task.result.creation.media_url);
                
                // Parse Trend Insight safely
                let trendContent = task.result.creation.recommendation_text || 'AI analysis result.';
                // If it's a JSON string, you might want to parse it, but for now assuming text
                
                setInsight({
                  title: "Style Analysis",
                  content: trendContent,
                  tags: task.result.creation.tags_array || [],
                });
                setStage('result');
              } else if (task.status === 'failed') {
                clearInterval(intervalId);
                setErrorMsg(task.result?.error || "Generation failed. Please try again.");
                setStage('error');
              }
            } catch (pollError) {
              clearInterval(intervalId);
              console.error("Polling error:", pollError);
              setErrorMsg("An error occurred while checking the task status.");
              setStage('error');
            }
          }, 3000);

      } catch (error: any) {
          console.error("Generation error:", error);
          setErrorMsg(error.message || "Failed to start generation.");
          setStage('error');
      }
  };

  const handleAddToFeedResult = () => {
    if (!currentUser || !generationResult?.creation) return;
    
    const newItem: FeedItem = {
      id: generationResult.creation.id,
      imageUrl: generationResult.creation.media_url,
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: generationResult.creation.created_at,
      likes: generationResult.creation.likes_count,
      isLiked: generationResult.creation.is_liked || false,
      tags: generationResult.creation.tags_array || [],
      description: generationResult.creation.prompt,
      trendInsight: generationResult.creation.recommendation_text,
    };
    onAddToFeed(newItem);
    showAlert("업로드 완료", "피드에 게시되었습니다.");
  };

  if (stage === 'result') {
      return (
          <ResultPage 
            generatedImage={generatedImage}
            insight={insight}
            onNavigate={onNavigate}
            onAddToFeed={handleAddToFeedResult}
            onReset={() => setStage('input')}
            creationId={generationResult?.creation?.id}
            onShop={() => {
                if (insight && onShop) {
                    // Pass creation ID so shopping results can be saved
                    onShop(insight.content, undefined, generationResult?.creation?.id);
                }
            }}
          />
      );
  }

  if (stage === 'error') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
            <h2 className="text-xl font-bold mb-2">Generation Failed</h2>
            <p className="text-sm text-gray-500 mb-8">{errorMsg}</p>
            <button 
            onClick={() => setStage('input')}
            className="bg-black text-white px-8 py-3 rounded-xl font-bold"
            >
            Try Again
            </button>
        </div>
      );
  }

  return (
    <div className="relative w-full bg-white">
        <GeneratePage 
            userProfile={userProfile}
            userName={currentUser?.name || ''}
            onOpenProfile={() => setIsProfileOpen(true)}
            isProfileOpen={isProfileOpen}
            onToggleGender={() => setUserProfile(p => ({...p, gender: p.gender === 'Male' ? 'Female' : 'Male'}))} // Local toggle only, save updates DB
            onShowAlert={showAlert}
            onGenerate={handleGenerate}
            isGenerating={stage === 'loading'}
            onBack={() => onNavigate(ViewState.HOME)}
        />
        
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