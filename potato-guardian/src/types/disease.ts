import { ReactNode } from 'react';

export interface DiseaseInfo {
  icon: ReactNode;
  title: string;
  description: string;
  images: string[];
  color: 'green' | 'yellow' | 'red';
}

export interface PreloadStatus {
  loaded: number;
  total: number;
  isComplete: boolean;
}

export interface ImagePreloadResult {
  success: boolean;
  failedImages: string[];
  totalImages: number;
}
