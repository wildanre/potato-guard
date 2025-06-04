import React from 'react';
import { Leaf, Droplets } from 'lucide-react';

const InfoSection: React.FC = () => {
  const diseaseInfo = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />,
      title: 'Early Blight',
      description: 'Penyakit fungal yang ditandai dengan noda coklat dengan cincin konkret, biasanya mempengaruhi daun tua terlebih dahulu.'
    },
    {
      icon: <Droplets className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: 'Late Blight',
      description: 'Infeksi mold air yang menyebabkan noda gelap, lembab, dan terlihat pada daun dan batang, menyebar dengan cepat dalam kondisi dingin dan lembab.'
    }
  ];

  return (
    <section className="py-10 px-6">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          Penyakit Daun Kentang yang Umum
        </h2>
        
        <div className="grid grid-cols-1 max-w-2xl mx-auto md:grid-cols-2 lg:grid-cols-2 gap-6">
          {diseaseInfo.map((disease, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {disease.icon}
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-2">
                {disease.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {disease.description}
              </p>
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
  );
};

export default InfoSection;