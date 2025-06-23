import { useState, useEffect } from 'react';
import { PreloadStatus, ImagePreloadResult } from '../types/disease';
import { APP_CONFIG } from '../config/app';

const isDevelopment = import.meta.env.DEV;

export const useImagePreloader = (imagePaths: string[]): PreloadStatus => {
  const [preloadStatus, setPreloadStatus] = useState<PreloadStatus>({
    loaded: 0,
    total: 0,
    isComplete: false,
  });

  useEffect(() => {
    if (!APP_CONFIG.PRELOAD_ENABLED || imagePaths.length === 0) {
      setPreloadStatus({ loaded: 0, total: 0, isComplete: true });
      return;
    }

    const preloadImages = async (): Promise<ImagePreloadResult> => {
      setPreloadStatus({ loaded: 0, total: imagePaths.length, isComplete: false });

      const preloadPromises = imagePaths.map((imagePath) => {
        return new Promise<{ success: boolean; path: string }>((resolve) => {
          const img = new Image();
          img.src = `${APP_CONFIG.IMAGE_BASE_PATH}${imagePath}`;
          
          img.onload = () => {
            setPreloadStatus(prev => ({ 
              ...prev, 
              loaded: prev.loaded + 1 
            }));
            if (isDevelopment) {
              console.log(`✅ Preloaded: ${imagePath}`);
            }
            resolve({ success: true, path: imagePath });
          };
          
          img.onerror = () => {
            if (isDevelopment) {
              console.warn(`❌ Failed to preload: ${imagePath}`);
            }
            setPreloadStatus(prev => ({ 
              ...prev, 
              loaded: prev.loaded + 1 
            }));
            resolve({ success: false, path: imagePath });
          };
        });
      });

      const results = await Promise.allSettled(preloadPromises);
      const failedImages = results
        .filter((result) => 
          result.status === 'fulfilled' && !result.value.success
        )
        .map((result) => result.status === 'fulfilled' ? result.value.path : '');

      setPreloadStatus(prev => ({ ...prev, isComplete: true }));

      if (isDevelopment) {
        console.log(`🎉 Image preloading completed! Failed: ${failedImages.length}/${imagePaths.length}`);
      }

      return {
        success: failedImages.length === 0,
        failedImages,
        totalImages: imagePaths.length,
      };
    };

    const timeoutId = setTimeout(preloadImages, APP_CONFIG.PRELOAD_DELAY);
    return () => clearTimeout(timeoutId);
  }, [imagePaths]);

  return preloadStatus;
};
