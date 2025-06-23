// Alternative simple version without visible progress indicator

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

  // Simple image preloading without UI feedback
  useEffect(() => {
    const preloadImages = () => {
      const allImagePaths = DISEASE_INFO.flatMap(disease => disease.images);
      
      allImagePaths.forEach((imagePath) => {
        const img = new Image();
        img.src = `/${imagePath}`;
        // Silent preloading - no console logs in production
      });
    };

    // Start preloading after initial render
    const timeoutId = setTimeout(preloadImages, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <section className="py-10 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
            Penyakit Daun Kentang yang Umum
          </h2>
          
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
