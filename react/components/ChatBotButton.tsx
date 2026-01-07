import React from 'react';
import { motion } from 'framer-motion';

interface ChatBotButtonProps {
  onClick: () => void;
}

const ChatBotButton: React.FC<ChatBotButtonProps> = ({ onClick }) => {
  return (
    <motion.div
      // 1. 둥둥 떠 있는 기본 애니메이션
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        // 2. 클릭 시 눌리는 피드백 효과
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full shadow-lg text-white text-3xl cursor-pointer border-none outline-none"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
        aria-label="AI Fashion Chatbot"
      >
        {/* 귀여운 아이콘 (Emoji나 SVG) */}
        🤖
        {/* 알림 배지 같은 포인트 (선택) */}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </motion.button>
    </motion.div>
  );
};

export default ChatBotButton;
