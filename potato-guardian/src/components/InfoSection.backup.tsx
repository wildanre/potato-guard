import React, { useState, useEffect } from 'react';
import { Leaf, Droplets, Heart, X } from 'lucide-react';

// Move static data outside component to prevent re-creation on every render
const DISEASE_INFO = [
  {
    icon: <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />,
    title: 'Healthy',
    description: 'Daun kentang yang sehat dengan warna hijau normal dan tidak ada tanda-tanda penyakit.',
    images: ['Healthy_1.jpg', 'Healthy_2.jpg', 'Healthy_3.jpg'],
    color: 'green'
  },
  {
    icon: <Leaf className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />,
    title: 'Early Blight',
    description: 'Penyakit fungal yang ditandai dengan noda coklat dengan cincin konkret, biasanya mempengaruhi daun tua terlebih dahulu.',
    images: ['Early_Blight_1.jpg', 'Early_Blight_2.jpg', 'Early_Blight_3.jpg'],
    color: 'yellow'
  },
  {
    icon: <Droplets className="h-8 w-8 text-red-600 dark:text-red-400" />,
    title: 'Late Blight',
    description: 'Infeksi mold air yang menyebabkan noda gelap, lembab, dan terlihat pada daun dan batang, menyebar dengan cepat dalam kondisi dingin dan lembab.',
    images: ['Late_Blight_1.jpg', 'Late_Blight_2.jpg', 'Late_Blight_3.jpg'],
    color: 'red'
  }
];

const InfoSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [preloadStatus, setPreloadStatus] = useState<{
    loaded: number;
    total: number;
    isComplete: boolean;
  }>({ loaded: 0, total: 0, isComplete: false });

  // Preload all images when component mounts
  useEffect(() => {
    const preloadImages = async () => {
      // Get all image paths from DISEASE_INFO
      const allImagePaths = DISEASE_INFO.flatMap(disease => disease.images);
      
      setPreloadStatus({ loaded: 0, total: allImagePaths.length, isComplete: false });

      const preloadPromises = allImagePaths.map((imagePath) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = `/${imagePath}`;
          
          img.onload = () => {
            setPreloadStatus(prev => ({ 
              ...prev, 
              loaded: prev.loaded + 1 
            }));
            console.log(`✅ Preloaded: ${imagePath}`);
            resolve();
          };
          
          img.onerror = () => {
            console.warn(`❌ Failed to preload: ${imagePath}`);
            // Still count as "loaded" to continue progress
            setPreloadStatus(prev => ({ 
              ...prev, 
              loaded: prev.loaded + 1 
            }));
            reject(new Error(`Failed to load ${imagePath}`));
          };
        });
      });

      try {
        await Promise.allSettled(preloadPromises);
        setPreloadStatus(prev => ({ ...prev, isComplete: true }));
        console.log(`🎉 All images preloaded successfully!`);
      } catch (error) {
        console.log('Some images failed to preload, but continuing...');
        setPreloadStatus(prev => ({ ...prev, isComplete: true }));
      }
    };

    // Start preloading after a small delay to not block initial render
    const timeoutId = setTimeout(preloadImages, 100);

    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array = run once on mount

  return (
    <>
      <section className="py-10 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
            Penyakit Daun Kentang yang Umum
          </h2>
          
          {/* Optional: Preload Progress Indicator */}
          {!preloadStatus.isComplete && preloadStatus.total > 0 && (
            <div className="mb-4 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Memuat gambar... {preloadStatus.loaded}/{preloadStatus.total}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-md mx-auto">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(preloadStatus.loaded / preloadStatus.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 max-w-6xl mx-auto lg:grid-cols-3 gap-8">
            {DISEASE_INFO.map((disease) => (
              <div 
                key={disease.title}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {disease.icon}
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-2">
                  {disease.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  {disease.description}
                </p>
                
                {/* Image Gallery */}
                <div className="grid grid-cols-3 gap-2">
                  {disease.images.map((image) => (
                    <div 
                      key={image}
                      className="relative cursor-pointer group overflow-hidden rounded-md"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={`/${image}`}
                        alt={`${disease.title} example`}
                        loading="lazy"
                        className="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Deteksi dini dapat menghemat hingga 80% dari kentang. Unggah gambar daun kentang Anda untuk mengidentifikasi potensi masalah dan mendapatkan rekomendasi pengobatan.
            </p>
          </div>
        </div>
      </section>

      {/* Image Preview Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <img 
              src={`/${selectedImage}`}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

// Wrap component with React.memo for performance optimization
const MemoizedInfoSection = React.memo(InfoSection);
MemoizedInfoSection.displayName = 'InfoSection';

export default MemoizedInfoSection;