import React from 'react';
import { X } from 'lucide-react';
import { APP_CONFIG, UI_CONFIG } from '../../config/app';

interface ImagePreviewModalProps {
  selectedImage: string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ 
  selectedImage, 
  onClose 
}) => {
  if (!selectedImage) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-${UI_CONFIG.MODAL_Z_INDEX}`}
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label="Close image preview"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <img 
          src={`${APP_CONFIG.IMAGE_BASE_PATH}${selectedImage}`}
          alt="Preview"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={handleImageClick}
        />
      </div>
    </div>
  );
};

export default React.memo(ImagePreviewModal);
