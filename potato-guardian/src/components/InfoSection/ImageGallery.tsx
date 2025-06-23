import React from 'react';
import { APP_CONFIG } from '../../config/app';

interface ImageGalleryProps {
  images: string[];
  diseaseTitle: string;
  onImageClick: (image: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  diseaseTitle, 
  onImageClick 
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((image) => (
        <div 
          key={image}
          className="relative cursor-pointer group overflow-hidden rounded-md"
          onClick={() => onImageClick(image)}
        >
          <img 
            src={`${APP_CONFIG.IMAGE_BASE_PATH}${image}`}
            alt={`${diseaseTitle} example`}
            loading={APP_CONFIG.IMAGE_LAZY_LOADING ? "lazy" : undefined}
            className="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ImageGallery);
