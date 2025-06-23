import React from 'react';
import { DiseaseInfo } from '../../types/disease';
import ImageGallery from './ImageGallery';

interface DiseaseCardProps {
  disease: DiseaseInfo;
  onImageClick: (image: string) => void;
}

const DiseaseCard: React.FC<DiseaseCardProps> = ({ disease, onImageClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-center mb-4">
        {disease.icon}
      </div>
      
      <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-2">
        {disease.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
        {disease.description}
      </p>
      
      <ImageGallery
        images={disease.images}
        diseaseTitle={disease.title}
        onImageClick={onImageClick}
      />
    </div>
  );
};

export default React.memo(DiseaseCard);
