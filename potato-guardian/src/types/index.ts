export type ThemeType = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

export interface DiseaseResult {
  name: string;
  confidence: number;
  description: string;
  treatment: string;
  isUncertain?: boolean;
  warning?: string;
  allPredictions?: Record<string, number>;
  rawConfidence?: number;
  qualityScore?: number;
}

export interface UploadStatus {
  isProcessing: boolean;
  error: string | null;
}