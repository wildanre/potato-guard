import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon, Info } from 'lucide-react';
import { UploadStatus } from '../types';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onAnalyzeImage: (file: File) => void;
  uploadStatus: UploadStatus;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onAnalyzeImage, uploadStatus }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageQuality, setImageQuality] = useState<{ score: number; issues: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to analyze image quality
  const analyzeImageQuality = (file: File): Promise<{ score: number; issues: string[] }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const issues: string[] = [];
        let score = 100;
        
        // Check resolution
        if (img.width < 224 || img.height < 224) {
          issues.push('Resolusi gambar terlalu rendah (minimum 224x224)');
          score -= 30;
        }
        
        // Check aspect ratio (prefer square or close to square)
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 0.5 || aspectRatio > 2) {
          issues.push('Rasio aspek gambar tidak ideal (gunakan gambar yang lebih persegi)');
          score -= 20;
        }
        
        // Check file size (too small might indicate low quality)
        if (file.size < 50 * 1024) { // Less than 50KB
          issues.push('File terlalu kecil, mungkin kualitas rendah');
          score -= 20;
        }
        
        // Analyze brightness and contrast (basic)
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, Math.min(100, img.width), Math.min(100, img.height));
          const data = imageData.data;
          let totalBrightness = 0;
          
          for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            totalBrightness += brightness;
          }
          
          const avgBrightness = totalBrightness / (data.length / 4);
          
          if (avgBrightness < 50) {
            issues.push('Gambar terlalu gelap');
            score -= 15;
          } else if (avgBrightness > 200) {
            issues.push('Gambar terlalu terang');
            score -= 15;
          }
        }
        
        resolve({ score: Math.max(0, score), issues });
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Enhanced file processing with quality analysis
  const processFile = async (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Analyze image quality
    try {
      const quality = await analyzeImageQuality(file);
      setImageQuality(quality);
    } catch (error) {
      console.warn('Failed to analyze image quality:', error);
      setImageQuality(null);
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pass the file to parent component
    onImageSelect(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setImageQuality(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    
    const file = fileInputRef.current.files[0];
    onAnalyzeImage(file);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 
          ${isDragging
            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
            : 'border-green-300 dark:border-green-700 bg-white dark:bg-gray-800'} 
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          placeholder="Pilih gambar"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={uploadStatus.isProcessing}
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-80 mx-auto rounded-lg shadow-sm"
            />
            {!uploadStatus.isProcessing && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                aria-label="Hapus gambar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            
            {/* Image Quality Indicator */}
            {imageQuality && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">
                    Kualitas Gambar: {imageQuality.score}/100
                  </span>
                  <div className={`ml-2 px-2 py-1 rounded text-xs ${
                    imageQuality.score >= 80 ? 'bg-green-100 text-green-800' :
                    imageQuality.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {imageQuality.score >= 80 ? 'Baik' : 
                     imageQuality.score >= 60 ? 'Cukup' : 'Perlu Perbaikan'}
                  </div>
                </div>
                {imageQuality.issues.length > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="font-medium mb-1">Saran untuk meningkatkan akurasi:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {imageQuality.issues.map((issue, index) => (
                        <li key={index} className="text-xs">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className="text-center cursor-pointer py-12"
            onClick={handleClickUpload}
          >
            <ImageIcon className="h-16 w-16 mx-auto text-green-500 dark:text-green-400 mb-3" />
            <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">
              Unggah Gambar Daun Kentang
            </h3>
            <p className="text-sm text-green-600 dark:text-green-400 mb-4">
              Tarik dan lepas atau klik untuk menelusuri
            </p>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
              type="button"
            >
              <Upload className="h-4 w-4 mr-2" />
              Pilih Gambar
            </button>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">
                Tips untuk hasil terbaik:
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 text-left">
                <li>• Gunakan pencahayaan yang baik dan merata</li>
                <li>• Fokus pada daun dengan latar belakang kontras</li>
                <li>• Pastikan daun mengisi sebagian besar frame</li>
                <li>• Hindari bayangan yang berlebihan</li>
                <li>• Gunakan resolusi minimal 224x224 pixel</li>
              </ul>
            </div>
            <p className="mt-3 text-xs text-green-500 dark:text-green-500">
              Format yang didukung: JPEG, PNG, WebP | Ukuran maksimal: 5MB
            </p>
          </div>
        )}

        {uploadStatus.error && (
          <div className="mt-3 text-red-500 text-sm text-center">
            {uploadStatus.error}
          </div>
        )}

        {uploadStatus.isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-green-700 dark:text-green-300">Menganalisis gambar...</p>
            </div>
          </div>
        )}
      </div>

      {previewUrl && !uploadStatus.isProcessing && (
        <div className="mt-4 text-center">
          <button
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            type="button"
            onClick={handleAnalyze}
          >
            Analisis Gambar Daun
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;