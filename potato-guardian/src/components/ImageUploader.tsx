import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadStatus } from '../types';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  uploadStatus: UploadStatus;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, uploadStatus }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Pilih gambar (JPEG, PNG)');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Pilih gambar yang lebih kecil dari 5MB');
      return;
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    const formData = new FormData();
    formData.append('image', fileInputRef.current.files[0]);

    try {
      uploadStatus.isProcessing = true;

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      uploadStatus.isProcessing = false;

      if (result.status === 'success') {
        alert(`Prediksi: ${result.prediction} (Confidence: ${(result.confidence * 100).toFixed(2)}%)`);
      } else {
        alert(`Gagal memproses gambar: ${result.message}`);
      }
    } catch (err: any) {
      uploadStatus.isProcessing = false;
      alert('Terjadi kesalahan saat mengirim gambar ke server.');
      console.error(err);
    }
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
          ${uploadStatus.isUploading || uploadStatus.isProcessing ? 'opacity-60 pointer-events-none' : ''}
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
          disabled={uploadStatus.isUploading || uploadStatus.isProcessing}
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-80 mx-auto rounded-lg shadow-sm"
            />
            {!uploadStatus.isUploading && !uploadStatus.isProcessing && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                aria-label="Hapus gambar"
              >
                <X className="h-5 w-5" />
              </button>
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
            <p className="mt-4 text-xs text-green-500 dark:text-green-500">
              Format yang didukung: JPEG, PNG, WebP | Ukuran maksimal: 5MB
            </p>
          </div>
        )}

        {uploadStatus.error && (
          <div className="mt-3 text-red-500 text-sm text-center">
            {uploadStatus.error}
          </div>
        )}

        {uploadStatus.isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-green-700 dark:text-green-300">Uploading image...</p>
            </div>
          </div>
        )}

        {uploadStatus.isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-green-700 dark:text-green-300">Processing image...</p>
            </div>
          </div>
        )}
      </div>

      {previewUrl && !uploadStatus.isUploading && !uploadStatus.isProcessing && (
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