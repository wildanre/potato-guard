import React from 'react';
import { PreloadStatus } from '../../types/disease';
import { APP_CONFIG } from '../../config/app';

interface PreloadProgressProps {
  status: PreloadStatus;
  showProgress?: boolean;
}

const PreloadProgress: React.FC<PreloadProgressProps> = ({ 
  status, 
  showProgress = APP_CONFIG.SHOW_PRELOAD_PROGRESS 
}) => {
  if (!showProgress || status.isComplete || status.total === 0) {
    return null;
  }

  const progressPercentage = (status.loaded / status.total) * 100;

  return (
    <div className="mb-4 text-center">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Memuat gambar... {status.loaded}/{status.total}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-md mx-auto">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default React.memo(PreloadProgress);
