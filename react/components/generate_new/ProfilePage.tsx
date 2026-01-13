import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { BODY_TYPES, FACE_SHAPES, PERSONAL_COLOR_SEASONS } from '../../constants';
import HeightDial from './HeightDial';
import { X, Camera, Check } from 'lucide-react';

interface ProfilePageProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (newProfile: UserProfile) => void;
  onShowAlert: (title: string, message: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isOpen, profile, onClose, onSave, onShowAlert }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [activeSeason, setActiveSeason] = useState<string>('Spring');

  // Helper to normalize gender key
  const getSafeGender = (g: string | undefined): 'Male' | 'Female' => {
      if (!g) return 'Female';
      const lower = g.toLowerCase();
      return lower === 'male' ? 'Male' : 'Female';
  };
  const safeGender = getSafeGender(localProfile.gender);

  // Reset local state when opening
  useEffect(() => {
    if (isOpen) {
      setLocalProfile(profile);
    }
  }, [isOpen, profile]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setLocalProfile(prev => ({ ...prev, photo: ev.target!.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!localProfile.photo) {
        onShowAlert('사진 등록 필요', '정확한 분석을 위해<br/>얼굴 사진을 등록해주세요.');
        return;
    }
    onSave(localProfile);
  };

  const handleClose = () => {
      setLocalProfile(profile);
      onClose();
  }

  const currentSeasonData = PERSONAL_COLOR_SEASONS.find(s => s.id === activeSeason);

  return (
    <div className={`fixed inset-0 z-[100] flex items-end justify-center pointer-events-none`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      {/* Bottom Sheet Modal */}
      <div 
        className={`w-full max-w-md h-[90%] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col transition-transform duration-300 ease-out transform pointer-events-auto ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50 shrink-0">
          <h1 className="text-lg font-black tracking-tight text-black">MY PROFILE</h1>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6">
          <div className="space-y-6"> {/* Spacing between sections */}
            
            {/* Photo */}
            <div className="flex flex-col items-center">
              <div className="mb-3 flex items-center gap-1.5 self-start">
                 <span className="text-[11px] font-bold text-gray-900 tracking-wide">FACE PHOTO</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              </div>
              <label className="relative group cursor-pointer w-full">
                <div className="w-full h-80 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:border-gray-400 transition-colors border-dashed">
                  {localProfile.photo ? (
                    <img src={localProfile.photo} alt="Profile" className="w-full h-full object-contain" />
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                        <Camera className="text-gray-400" size={20} />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">터치하여 사진 업로드</span>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>

            {/* Height */}
            <div>
              <label className="text-[11px] font-bold text-gray-900 mb-2 block">키 (Height)</label>
              <HeightDial 
                value={localProfile.height} 
                onChange={(h) => setLocalProfile(prev => ({...prev, height: h}))} 
              />
            </div>

            {/* Face Shape */}
            <div>
              <label className="text-[11px] font-bold text-gray-900 mb-2 block">얼굴형 (Face Shape)</label>
              <div className="grid grid-cols-3 gap-2">
                {FACE_SHAPES.map(face => (
                  <button 
                    key={face.id}
                    onClick={() => setLocalProfile(prev => ({...prev, faceShape: face.id}))}
                    className={`py-3 rounded-xl flex flex-col items-center gap-1 border transition-all ${localProfile.faceShape === face.id ? 'border-black bg-black text-white shadow-md' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'}`}
                  >
                    <span className="text-lg">{face.emoji}</span>
                    <span className={`text-[10px] font-bold ${localProfile.faceShape === face.id ? 'text-white' : ''}`}>{face.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Color */}
            <div>
              <label className="text-[11px] font-bold text-gray-900 mb-2 block">퍼스널 컬러 (Personal Color)</label>
              
              {/* Season Tabs */}
              <div className="flex bg-gray-50 p-1 rounded-xl mb-3">
                {PERSONAL_COLOR_SEASONS.map(season => (
                  <button
                    key={season.id}
                    onClick={() => setActiveSeason(season.id)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${activeSeason === season.id ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <span>{season.icon}</span>
                    <span>{season.name}</span>
                  </button>
                ))}
              </div>

              {/* Tone List */}
              <div className="space-y-2">
                {currentSeasonData?.tones.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => setLocalProfile(prev => ({...prev, personalColor: tone.id}))}
                    className={`w-full p-3 rounded-xl flex items-center justify-between border transition-all ${localProfile.personalColor === tone.id ? 'border-black ring-1 ring-black bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border border-black/10 shadow-inner shrink-0" style={{backgroundColor: tone.color}}></div>
                        <div className="text-left">
                            <span className="text-[11px] font-bold text-gray-900">{tone.name} <span className="font-normal text-gray-500 font-kor">({tone.kor})</span></span>
                        </div>
                     </div>
                     {localProfile.personalColor === tone.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Type */}
            <div>
              <label className="text-[11px] font-bold text-gray-900 mb-2 block">체형 (Body Type)</label>
              <div className="grid grid-cols-2 gap-2">
                {BODY_TYPES[safeGender]?.map(bt => (
                  <button 
                    key={bt.id}
                    onClick={() => setLocalProfile(prev => ({...prev, bodyType: bt.id}))}
                    className={`py-3 px-4 rounded-xl flex flex-col items-start gap-1 border transition-all ${localProfile.bodyType === bt.id ? 'border-black bg-black text-white shadow-md' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between w-full items-center">
                      <span className={`text-[11px] font-bold ${localProfile.bodyType === bt.id ? 'text-white' : 'text-black'}`}>{bt.name}</span>
                      <span className="text-lg">{bt.emoji}</span>
                    </div>
                    <span className={`text-[9px] font-medium font-kor text-left ${localProfile.bodyType === bt.id ? 'text-white/70' : 'text-gray-400'}`}>{bt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button - Moved inside the scroll view for better spacing */}
            <div className="pt-4 pb-4">
              <button onClick={handleSave} className="w-full bg-black text-white text-xs font-bold py-4 rounded-xl shadow-xl hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center gap-2">
                  저장하기
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
