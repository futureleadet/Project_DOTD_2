import React from 'react';
import { MyPageProfileProps } from './types';
import { Camera, Sparkles, Loader2, ChevronRight, User as UserIcon, Ruler, Smile, Activity, Palette } from 'lucide-react';
import { FACE_SHAPES, BODY_TYPES, ALL_PERSONAL_COLORS } from '../../constants';

interface Props {
  profile: MyPageProfileProps;
  onDiscovery: () => void;
  isLoading: boolean;
}

const ProfileSection: React.FC<Props> = ({ profile, onDiscovery, isLoading }) => {
  // Helpers to get rich info
  const getFaceInfo = (id: string) => FACE_SHAPES.find(f => f.id === id);
  
  const getBodyInfo = (gender: string, id: string) => {
      const safeGender = gender === 'Male' ? 'Male' : 'Female';
      return BODY_TYPES[safeGender]?.find(b => b.id === id);
  };
  
  const getPersonalColorInfo = (id: string) => ALL_PERSONAL_COLORS.find(p => p.id === id);

  const faceInfo = getFaceInfo(profile.faceShape);
  const bodyInfo = getBodyInfo(profile.gender, profile.bodyType);
  const colorInfo = getPersonalColorInfo(profile.personalColor);

  return (
    <div className="p-6 pb-6">
      <div className="flex items-start space-x-5">
        <div className="flex flex-col items-center space-y-2 shrink-0">
          <div className="w-24 h-24 rounded-[28px] overflow-hidden border-2 border-gray-100 shadow-sm relative group cursor-pointer">
            <img 
              src={profile.profileImage} 
              alt="User Face" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-6 h-6" />
            </div>
          </div>
          
          {/* Generation Count Badge */}
          <div className="w-full px-1">
            <div className="flex justify-between items-center mb-1 px-0.5">
               <span className="text-[9px] font-bold text-gray-400">DAILY</span>
               <span className="text-[10px] font-black text-gray-900">{profile.dailyGenerationsUsed} / {profile.maxDailyGenerations}</span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
               <div 
                className="h-full bg-black transition-all duration-500" 
                style={{ width: `${(profile.dailyGenerationsUsed / profile.maxDailyGenerations) * 100}%` }}
               ></div>
            </div>
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
            <Badge icon={<UserIcon size={12} />} label={profile.gender === 'Male' ? 'Male' : 'Female'} />
            
            {profile.height !== 'Unknown' && (
                <Badge icon={<Ruler size={12} />} label={profile.height} />
            )}
            
            {faceInfo && (
                <Badge icon={<Smile size={12} />} label={`${faceInfo.emoji} ${faceInfo.name}`} />
            )}
            
            {bodyInfo && (
                <Badge icon={<Activity size={12} />} label={`${bodyInfo.emoji} ${bodyInfo.name}`} />
            )}
            
            {colorInfo ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-600">
                  <div className="w-2 h-2 rounded-full border border-black/10" style={{backgroundColor: colorInfo.color}}></div>
                  {colorInfo.name}
                </span>
            ) : (
                profile.personalColor !== 'Unknown' && (
                    <Badge icon={<Palette size={12} />} label={profile.personalColor} />
                )
            )}
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
