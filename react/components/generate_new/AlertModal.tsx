import React from 'react';
import { Info } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-[24px] p-6 shadow-2xl max-w-[260px] w-full transform scale-100 transition-all">
            <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-gray-100 text-black rounded-full flex items-center justify-center mb-4">
                    <Info size={16} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed break-keep font-medium" dangerouslySetInnerHTML={{__html: message}}></p>
                <button onClick={onClose} className="w-full bg-black text-white text-xs font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
                    확인
                </button>
            </div>
        </div>
    </div>
  );
};

export default AlertModal;
