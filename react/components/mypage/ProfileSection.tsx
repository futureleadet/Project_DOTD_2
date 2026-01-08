import React from 'react';
import { MyPageProfileProps } from './types';
import { Camera, Sparkles, Loader2, ChevronRight, User as UserIcon, Ruler, Smile, Activity } from 'lucide-react';

interface Props {
  profile: MyPageProfileProps;
  onDiscovery: () => void;
  isLoading: boolean;
}

const ProfileSection: React.FC<Props> = ({ profile, onDiscovery, isLoading }) => {
  return (
    <div className="p-6 pb-6">
      <div className="flex items-start space-x-5">
        <div className="w-24 h-24 rounded-[28px] overflow-hidden border-2 border-gray-100 shadow-sm shrink-0 relative group cursor-pointer">
          <img 
            src={profile.profileImage} 
            alt="User Face" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white w-6 h-6" />
          </div>
        </div>

        <div className="flex-1 space-y-4 pt-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Styling Target</p>
              <h2 className="text-2xl font-black text-gray-900 leading-none truncate">{profile.nickname}</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge icon={<UserIcon size={12} />} label={profile.gender || 'Gender?'} />
            <Badge icon={<Ruler size={12} />} label={profile.height || 'Height?'} />
            <Badge icon={<Smile size={12} />} label={`🥚 ${profile.faceShape}`} />
            <Badge icon={<Activity size={12} />} label={`🪜 ${profile.bodyType}`} />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-600">
              <span className="w-2 h-2 rounded-full bg-[#8D5F3C] ring-1 ring-gray-200"></span>
              {profile.personalColor}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={onDiscovery}
        disabled={isLoading}
        className="mt-8 w-full bg-gray-900 text-white text-[13px] font-bold py-4 rounded-2xl shadow-lg hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center space-x-2 group disabled:opacity-50"
      >
        {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4 text-white" />
        ) : (
            <Sparkles className="w-4 h-4 text-yellow-400 group-hover:animate-pulse" />
        )}
        <span>{isLoading ? '분석 중...' : '나랑 어울리는 브랜드 찾기'}</span>
        {!isLoading && <ChevronRight className="w-3 h-3 text-white/70 group-hover:translate-x-1 transition-transform" />}
      </button>
    </div>
  );
};

const Badge: React.FC<{ icon?: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-600">
    {icon && <span className="text-gray-400">{icon}</span>}
    {label}
  </span>
);

export default ProfileSection;
