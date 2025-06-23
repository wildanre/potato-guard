import React, { useMemo } from 'react';
import { DISEASE_DATA } from '../../constants/diseaseData';
import { useImagePreloader } from '../../hooks/useImagePreloader';
import { useModal } from '../../hooks/useModal';
import DiseaseCard from './DiseaseCard';
import ImagePreviewModal from './ImagePreviewModal';
import PreloadProgress from './PreloadProgress';

const InfoSection: React.FC = () => {
  // Memoize all image paths for preloading
  const allImagePaths = useMemo(() => 
    DISEASE_DATA.flatMap(disease => disease.images), 
    []
  );

  // Custom hooks
  const preloadStatus = useImagePreloader(allImagePaths);
  const { selectedItem: selectedImage, openModal, closeModal } = useModal();

  return (
    <>
      <section className="py-10 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
            Penyakit Daun Kentang yang Umum
          </h2>
          
          <PreloadProgress status={preloadStatus} />
          
          <div className="grid grid-cols-1 max-w-6xl mx-auto lg:grid-cols-3 gap-8">
            {DISEASE_DATA.map((disease) => (
              <DiseaseCard
                key={disease.title}
                disease={disease}
                onImageClick={openModal}
              />
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Deteksi dini dapat menghemat hingga 80% dari kentang. Unggah gambar daun kentang Anda untuk mengidentifikasi potensi masalah dan mendapatkan rekomendasi pengobatan.
            </p>
          </div>
        </div>
      </section>

      <ImagePreviewModal 
        selectedImage={selectedImage}
        onClose={closeModal}
      />
    </>
  );
};

// Memoize the main component for performance
const MemoizedInfoSection = React.memo(InfoSection);
MemoizedInfoSection.displayName = 'InfoSection';

export default MemoizedInfoSection;
