import React from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Pencil } from 'lucide-react';

export const BrandMatchBanner = ({ onClick }: { onClick: () => void }) => {
    return (
        <div onClick={onClick} className="mx-6 mb-4 mt-1">
            <div className="bg-[#111827] rounded-xl p-3.5 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform active:scale-95 group relative overflow-hidden">
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <Pencil size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white text-xs font-bold">나랑 어울리는 브랜드 찾기</span>
                <ChevronRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
        </div>
    );
};

export const IntroOverlay = ({ onBack, onStart }: { onBack: () => void, onStart: () => void }) => {
  return (
    <div className="flex flex-col animate-fade-in w-full h-full relative">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 no-scrollbar">
        {/* Hero Card */}
        <div className="bg-black rounded-[2rem] p-8 mb-8 text-center flex flex-col items-center justify-center h-48 shadow-xl relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50"></div>
            <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '16px 16px'}}></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-white italic tracking-wider mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>DOTD</h1>
                <div className="text-[10px] font-bold text-white tracking-[0.3em] uppercase mb-1">AI STYLE MATCH</div>
                <div className="text-[10px] text-gray-400 font-light tracking-wide">나에게 어울리는 브랜드 찾기</div>
            </div>
        </div>

        {/* Content */}
        <div className="space-y-8 text-center px-2">
            <div>
                <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                    AI가 찾아주는 나만의 히든 브랜드,<br/>
                    DOTD 스타일 매치 ✨
                </h2>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    나만의 숨은 브랜드 찾기,<br/>AI STYLE MATCH가 도와드릴게요!
                </p>
            </div>

            <div className="space-y-6 text-[12px] text-gray-500 leading-relaxed text-center break-keep tracking-tight font-medium">
                <p>
                    DOTD AI는 당신의 스타일 DNA를 분석하여,<br/>
                    숨겨진 보석 같은 브랜드를 찾아드립니다.
                    <span className="block mt-1">(최근 생성한 5건 이상의 데이터 기반)</span>
                </p>
                <p>
                    뻔한 SPA 브랜드는 NO!<br/>
                    당신의 취향을 저격할<br/>
                    감각적인 신생 브랜드를 발견하고,<br/>
                    나만의 스타일을 완성해보세요.
                    <span className="block mt-1">(무신사 스탠다드, 유니클로 등 제외)</span>
                </p>
                <p>
                    AI STYLE MATCH가 당신의 옷장을<br/>
                    특별하게 채워줄 완벽한 파트너를 찾아드립니다.
                </p>
            </div>
        </div>
      </div>

      {/* Bottom Button - Fixed at bottom of tab content, sticky not absolute to avoid covering tab bar if exists, or absolute within relative container */}
      <div className="sticky bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50 pb-8 mt-auto z-10">
        <button 
            onClick={onStart}
            className="w-full bg-[#1F2937] hover:bg-black text-white font-bold py-4 rounded-xl transition-colors text-sm shadow-md active:scale-[0.98]"
        >
            지금 확인하러 가기
        </button>
      </div>
    </div>
  );
};

export const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 z-[60] bg-black/60 flex items-center justify-center p-6 backdrop-blur-[2px] animate-fade-in">
        <div className="bg-white rounded-[2rem] w-full max-w-[300px] py-10 px-8 flex flex-col items-center shadow-2xl">
            {/* Icon Animation */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                {/* Rotating Ring Base */}
                <div className="absolute inset-0 border-[6px] border-gray-100 rounded-[2.5rem] transform rotate-45"></div>
                {/* Rotating Active Ring */}
                <div className="absolute inset-0 border-[6px] border-yellow-400 border-t-transparent border-l-transparent rounded-[2.5rem] transform rotate-45 animate-spin origin-center" style={{ animationDuration: '1.5s' }}></div>
                
                {/* Static Icon */}
                <div className="relative z-10 p-3">
                    <Pencil className="text-yellow-400 fill-yellow-400 -rotate-12" size={36} />
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">스타일 분석 중</h3>
            <p className="text-xs text-gray-400 text-center leading-relaxed break-keep font-medium">
                사용자의 신체 정보와 생성된 룩들을 바탕으로<br/>
                최적의 브랜드를 찾고 있습니다...
            </p>
        </div>
    </div>
  );
};