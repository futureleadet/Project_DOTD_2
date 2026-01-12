import React, { useState } from 'react';
import { getBrandArchive } from '../../services/apiService';
import { ArchiveState } from './brand_archive/types';
import { IntroOverlay, LoadingOverlay, BrandMatchBanner } from './brand_archive/BrandMatchFlow';
import { LockedView } from './brand_archive/LockedView';
import { UnlockedView } from './brand_archive/UnlockedView';
import { ViewState } from '../../types';

interface BrandArchiveSectionProps {
    onNavigate: (view: ViewState) => void;
}

const BrandArchiveSection: React.FC<BrandArchiveSectionProps> = ({ onNavigate }) => {
  // Start with showIntro = true immediately
  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(false);
  const [archiveData, setArchiveData] = useState<ArchiveState | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setShowIntro(false);
    try {
      const response = await getBrandArchive();
      console.log("Brand Archive Raw Response:", response);
      
      let data = response;
      // If data is array (n8n returns array sometimes), take the first item
      if (Array.isArray(response) && response.length > 0) {
        data = response[0];
      }

      console.log("Brand Archive Processed Data:", data);
      
      if (!data) {
          throw new Error("Empty data received");
      }

      setArchiveData(data);
    } catch (error) {
      console.error("Failed to fetch brand archive:", error);
      alert("데이터를 가져오는 데 실패했습니다.");
      // If failed, show intro again so user can retry
      setShowIntro(true);
    } finally {
      setLoading(false);
    }
  };

  if (archiveData) {
    return (
      <div className="animate-fade-in">
        {archiveData.status === 'locked' ? (
          <LockedView data={archiveData} onNavigate={onNavigate} />
        ) : (
          <UnlockedView data={archiveData} />
        )}
      </div>
    );
  }

  // If loading, show loading overlay
  if (loading) {
      return <LoadingOverlay />;
  }

  // Default view is the IntroOverlay
  // We remove the onBack logic or make it do nothing since this is the root view of this tab
  return (
    <div className="h-full">
        <IntroOverlay 
          onBack={() => {}} // No back action needed as it's the main view of the tab
          onStart={handleStart} 
        />
    </div>
  );
};

export default BrandArchiveSection;
