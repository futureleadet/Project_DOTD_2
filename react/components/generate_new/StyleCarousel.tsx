import React, { useState, useRef, useEffect } from 'react';
import { StyleDefinition } from '../../types';

interface StyleCarouselProps {
  styles: StyleDefinition[];
  currentStyleId: string;
  onStyleChange: (style: StyleDefinition) => void;
}

const CONTAINER_HEIGHT = 220;
const ITEM_HEIGHT = 65;
const VISIBLE_RANGE = 3;

const StyleCarousel: React.FC<StyleCarouselProps> = ({ styles, currentStyleId, onStyleChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(styles.findIndex(s => s.id === currentStyleId));
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  // Sync internal index if prop changes externally
  useEffect(() => {
    const idx = styles.findIndex(s => s.id === currentStyleId);
    if (idx !== -1 && idx !== currentIndex) {
      setCurrentIndex(idx);
    }
  }, [currentStyleId, styles]);

  const handleStart = (y: number) => {
    setIsDragging(true);
    setStartY(y);
    setDragY(0);
  };

  const handleMove = (y: number) => {
    if (!isDragging) return;
    const diff = y - startY;
    
    // Resistance at edges
    if ((currentIndex === 0 && diff > 0) || (currentIndex === styles.length - 1 && diff < 0)) {
        setDragY(diff * 0.3);
    } else {
        setDragY(diff);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const SWIPE_THRESHOLD = 20; // Lower threshold for easier navigation
    let newIndex = currentIndex;

    if (dragY < -SWIPE_THRESHOLD && currentIndex < styles.length - 1) {
        newIndex++;
    } else if (dragY > SWIPE_THRESHOLD && currentIndex > 0) {
        newIndex--;
    }

    setDragY(0);
    setCurrentIndex(newIndex);
    onStyleChange(styles[newIndex]);
  };

  const handleWheel = (e: React.WheelEvent) => {
      // Simple wheel handler
      if (e.deltaY > 0 && currentIndex < styles.length - 1) {
          setCurrentIndex(prev => {
              const next = prev + 1;
              onStyleChange(styles[next]);
              return next;
          });
      } else if (e.deltaY < 0 && currentIndex > 0) {
          setCurrentIndex(prev => {
              const next = prev - 1;
              onStyleChange(styles[next]);
              return next;
          });
      }
  };

  const handleClick = (e: React.MouseEvent) => {
      // Allow clicking top/bottom to navigate if not dragging
      if (isDragging) return;
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const clickY = e.clientY - rect.top;
      const centerY = rect.height / 2;
      
      if (clickY < centerY - 40 && currentIndex > 0) {
          setCurrentIndex(prev => {
              const next = prev - 1;
              onStyleChange(styles[next]);
              return next;
          });
      } else if (clickY > centerY + 40 && currentIndex < styles.length - 1) {
          setCurrentIndex(prev => {
              const next = prev + 1;
              onStyleChange(styles[next]);
              return next;
          });
      }
  };

  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientY);
  const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
  const onMouseUp = () => handleEnd();

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };
  const onTouchEnd = () => handleEnd();

  // Attach global mouse listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  const currentStyle = styles[currentIndex];

  return (
    <div className="relative w-full h-[220px] bg-white rounded-[24px] overflow-hidden border border-gray-100 flex select-none">
      {/* Left Wheel Area */}
      <div 
        ref={containerRef}
        className={`w-[45%] h-full relative border-r border-gray-50 bg-gray-50/50 overflow-hidden wheel-mask touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
        onClick={handleClick}
      >
        <div className="absolute top-1/2 left-0 w-full h-[60px] -mt-[30px] border-y border-black/5 bg-black/5 pointer-events-none z-10 flex items-center">
            <div className="w-1 h-4 bg-black rounded-r-full"></div>
        </div>
        
        <div className="absolute left-0 w-full h-full pointer-events-none">
          {styles.map((style, i) => {
            const dragRatio = dragY / CONTAINER_HEIGHT * 3;
            const offset = (i - currentIndex) + dragRatio;
            const dist = Math.abs(offset);
            
            // Only render if visible
            if (dist > VISIBLE_RANGE) return null;

            const translateY = (CONTAINER_HEIGHT / 2) + (offset * ITEM_HEIGHT);
            const scale = Math.max(0.6, 1.1 - dist * 0.4);
            const opacity = Math.max(0.2, 1 - dist * 0.5);
            const blur = Math.min(4, dist * 2);
            const zIndex = 100 - Math.round(dist * 10);
            const rotateX = offset * -20;
            const isActive = dist < 0.3;

            return (
              <div 
                key={style.id}
                className="absolute left-1/2 flex items-center justify-center transition-transform duration-75"
                style={{
                  width: 60, height: 60,
                  marginLeft: -30, marginTop: -30,
                  transform: `translateY(${translateY}px) scale(${scale}) perspective(500px) rotateX(${rotateX}deg)`,
                  opacity: opacity,
                  filter: `blur(${blur}px)`,
                  zIndex: zIndex,
                  transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s, filter 0.4s'
                }}
              >
                 <div className="absolute inset-0 rounded-xl border-2 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                        src={`https://picsum.photos/seed/${style.imageSeed}/200/200`} 
                        alt={style.name} 
                        className="w-full h-full object-cover" 
                    />
                 </div>
                 <div className={`absolute inset-[-2px] rounded-xl border-2 border-black transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Info Area */}
      <div className="w-[55%] h-full flex flex-col justify-center px-5 relative z-20">
        <div className="transition-opacity duration-300">
            <p className="text-[10px] text-black font-bold mb-1 tracking-wide font-kor">{currentStyle.koreanName}</p>
            <h4 className="text-xl font-black text-gray-300 tracking-tighter uppercase mb-3 leading-none font-sans">{currentStyle.name}</h4>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed break-keep font-kor line-clamp-3" dangerouslySetInnerHTML={{ __html: currentStyle.desc }}></p>
        </div>
      </div>
    </div>
  );
};

export default StyleCarousel;
