import React, { useState } from 'react';
import { UserProfile, ColorDefinition } from '../../types';
import { MAIN_COLORS, STYLES, FACE_SHAPES, BODY_TYPES, ALL_PERSONAL_COLORS } from '../../constants';
import StyleCarousel from './StyleCarousel';
import { Menu, Camera, Edit2, RefreshCw, Keyboard, X, Check, Loader2, Sparkles } from 'lucide-react';

interface GeneratePageProps {
  userProfile: UserProfile;
  userName: string;
  onOpenProfile: () => void;
  isProfileOpen: boolean;
  onToggleGender: () => void;
  onShowAlert: (title: string, message: string) => void;
  onGenerate: (params: any) => void;
  isGenerating: boolean;
  onBack: () => void;
}

const GeneratePage: React.FC<GeneratePageProps> = ({ userProfile, userName, onOpenProfile, isProfileOpen, onToggleGender, onShowAlert, onGenerate, isGenerating, onBack }) => {
  const [styleRequest, setStyleRequest] = useState('');
  const [selectedColors, setSelectedColors] = useState<ColorDefinition[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('m_ai_auto');

  // Helper to normalize gender key
  const getSafeGender = (g: string | undefined): 'Male' | 'Female' => {
      if (!g) return 'Female';
      const lower = g.toLowerCase();
      return lower === 'male' ? 'Male' : 'Female';
  };
  const safeGender = getSafeGender(userProfile.gender);

  // Helper to get emoji/name safely
  const getFaceInfo = () => FACE_SHAPES.find(f => f.id === userProfile.faceShape);
  const getBodyInfo = () => BODY_TYPES[safeGender]?.find(b => b.id === userProfile.bodyType);
  const getPersonalColorInfo = () => ALL_PERSONAL_COLORS.find(p => p.id === userProfile.personalColor);
  
  const currentStyle = STYLES.find(s => s.id === selectedStyleId) || STYLES[0];

  const toggleColor = (color: ColorDefinition) => {
    if (selectedColors.some(c => c.id === color.id)) {
      setSelectedColors(prev => prev.filter(c => c.id !== color.id));
    } else {
      if (selectedColors.length < 3) {
        setSelectedColors(prev => [...prev, color]);
      } else {
        onShowAlert("Limit Reached", "최대 3개까지만<br>선택 가능합니다.");
      }
    }
  };

  const handleGenerateClick = () => {
    if (!userProfile.photo) {
        onShowAlert("사진 등록 필요", "프로필 사진을 먼저 등록해주세요.");
        return;
    }
    
    // Pass parameters to parent handler
    onGenerate({
        prompt: styleRequest,
        colors: selectedColors.map(c => c.name),
        style: selectedStyleId,
        // Profile info is already in userProfile, but can be passed explicitly if needed
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-white relative z-0">
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center bg-white sticky top-0 z-20">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <X className="text-black" size={24} />
        </button>
        <h1 className="text-lg font-black tracking-widest text-black">GENERATE</h1>
        <Menu className="text-gray-400 cursor-pointer hover:text-black" size={24} />
      </div>

      <div className="px-5 py-2 space-y-6 pb-20">
        {/* Summary Card */}
        <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 rounded-[32px] relative">
            <div className="flex items-center gap-5">
                {/* Profile Image Wrapper */}
                <div 
                    onClick={onOpenProfile} 
                    className="relative shrink-0 cursor-pointer group"
                >
                    <div className="w-[88px] h-[88px] rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center group-hover:border-black transition-colors shadow-sm relative">
                        {userProfile.photo ? (
                            <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-1">
                                <Camera className="text-gray-300 mb-1 group-hover:text-gray-400 transition-colors" size={28} />
                                <span className="text-[9px] text-gray-400 font-bold leading-tight">사진 추가</span>
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 className="text-white" size={14} />
                        </div>
                    </div>
                    
                    {/* Mandatory Red Dot - Reduced size */}
                    {!userProfile.photo && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white z-10 shadow-sm"></div>
                    )}
                </div>

                {/* Info Area */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                         <h2 className="text-xl font-black text-gray-900 truncate leading-none">{userName || 'USER_DOTD'}</h2>
                    </div>
                    
                    {!userProfile.photo && (
                        <p className="text-[11px] text-red-500 font-bold mb-2 animate-pulse">
                            내 사진을 넣어 이미지를 만드세요
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Gender Toggle Switch */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); onToggleGender(); }}
                            className="relative flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-900 transition-colors active:scale-95"
                        >
                             <span className="text-sm">{userProfile.gender === 'Male' ? '🙆‍♂️' : '🙆‍♀️'}</span>
                             <span className="text-[11px] font-bold">{userProfile.gender}</span>
                             <RefreshCw className="text-gray-400 ml-0.5" size={10} />
                        </button>

                        {/* Height Badge - Hide if 0 */}
                        {userProfile.height > 0 && (
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-gray-700">
                                <Edit2 className="text-yellow-600" size={10} />
                                <span className="text-[11px] font-bold">{userProfile.height}cm</span>
                            </div>
                        )}

                        {/* Other Badges */}
                        {userProfile.faceShape && getFaceInfo() && (
                             <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-gray-700">
                                <span className="text-[10px]">{getFaceInfo()?.emoji}</span>
                                <span className="text-[11px] font-bold">{getFaceInfo()?.name}</span>
                            </div>
                        )}

                        {userProfile.personalColor && getPersonalColorInfo() && (
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-gray-700">
                                <div className="w-2 h-2 rounded-full border border-black/10" style={{backgroundColor: getPersonalColorInfo()?.color}}></div>
                                <span className="text-[11px] font-bold">{getPersonalColorInfo()?.name}</span>
                            </div>
                        )}

                        {userProfile.bodyType && getBodyInfo() && (
                             <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-gray-700">
                                <span className="text-[10px]">{getBodyInfo()?.emoji}</span>
                                <span className="text-[11px] font-bold">{getBodyInfo()?.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Style Request */}
        <div>
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center mb-3">
                1. Style Request
                <span className="ml-2 w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </label>
            <div className="relative group">
                <textarea 
                    value={styleRequest}
                    onChange={(e) => setStyleRequest(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:bg-white focus:border-black focus:ring-0 outline-none block p-4 pr-10 resize-none transition-all font-kor leading-snug placeholder-gray-400" 
                    rows={2} 
                    placeholder="오늘의 OOTD 테마를 입력하세요"
                ></textarea>
                <div className="absolute bottom-3 right-4 text-gray-300 group-focus-within:text-black transition-colors">
                    <Keyboard size={14} />
                </div>
            </div>
        </div>

        {/* Color Tone */}
        <div>
            <div className="flex justify-between items-end mb-3">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">2. Color Tone</label>
                <span className={`text-[10px] font-bold ${selectedColors.length === 3 ? 'text-black' : 'text-gray-300'}`}>{selectedColors.length}/3</span>
            </div>
            
            {selectedColors.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1 mb-2 hide-scrollbar">
                    {selectedColors.map(color => (
                        <button key={color.id} onClick={() => toggleColor(color)} className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-medium hover:bg-gray-800 transition-colors shrink-0 shadow-sm">
                            <div className="w-3 h-3 rounded-full border border-gray-500/30" style={{backgroundColor: color.hex}}></div>
                            {color.name}
                            <X className="text-gray-400 ml-1" size={10} />
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-5 gap-y-4 gap-x-2 place-items-center">
                {MAIN_COLORS.map(color => {
                    const isSelected = selectedColors.some(c => c.id === color.id);
                    const isLight = ['white', 'cream', 'beige', 'yellow'].includes(color.id);
                    const checkColor = isLight ? 'text-black' : 'text-white';
                    
                    return (
                        <button 
                            key={color.id}
                            onClick={() => toggleColor(color)}
                            className={`relative w-11 h-11 rounded-full transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-105' : 'hover:scale-105'}`}
                            style={{ backgroundColor: color.hex, border: color.border ? '1px solid #E5E7EB' : 'none' }}
                        >
                            {isSelected && <Check size={14} className={checkColor} />}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Style Mood */}
        <section>
            <div className="flex justify-between items-end mb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    3. Style Mood
                </h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{currentStyle.name}</span>
            </div>
            
            <StyleCarousel 
                styles={STYLES} 
                currentStyleId={selectedStyleId} 
                onStyleChange={(s) => setSelectedStyleId(s.id)} 
            />
        </section>
      </div>

      {/* Footer Button - Reduced padding to bring closer to content */}
      <div className="p-4 bg-white border-t border-gray-50 sticky bottom-0 z-20 shrink-0">
        <button 
            onClick={handleGenerateClick}
            className="w-full bg-black text-white text-sm font-bold py-4 rounded-2xl shadow-xl hover:bg-gray-900 transform active:scale-95 transition-all flex justify-center items-center group gap-2"
        >
            {isGenerating ? (
                <Loader2 className="animate-spin text-yellow-300" size={20} />
            ) : (
                <Sparkles className="text-yellow-300 group-hover:animate-spin" size={20} />
            )}
            <span>GENERATE OOTD</span>
        </button>
      </div>
    </div>
  );
};

export default GeneratePage;
