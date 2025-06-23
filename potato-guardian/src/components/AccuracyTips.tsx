import React, { useState } from 'react';
import { HelpCircle, Upload, Eye, MessageCircle, RotateCcw, X } from 'lucide-react';

const AccuracyTips: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      icon: <Upload className="h-5 w-5 text-blue-500" />,
      title: "Upload Gambar",
      description: "Klik area upload atau drag & drop gambar daun kentang Anda. Format yang didukung: JPG, PNG, maksimal 5MB."
    },
    {
      icon: <Eye className="h-5 w-5 text-green-500" />,
      title: "Lihat Contoh Gambar",
      description: "Scroll ke bawah untuk melihat contoh gambar setiap penyakit. Klik gambar untuk melihat detail lebih besar."
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-purple-500" />,
      title: "Gunakan Chatbot",
      description: "Klik ikon chat di pojok kanan untuk bertanya tentang hasil deteksi atau cara perawatan tanaman kentang."
    },
    {
      icon: <RotateCcw className="h-5 w-5 text-orange-500" />,
      title: "Coba Ulang Jika Perlu",
      description: "Jika hasil confidence rendah atau tidak sesuai, upload gambar lain atau gunakan gambar dengan kualitas lebih baik."
    }
  ];

  const examples = [
    {
      type: "steps",
      title: "📋 Langkah-Langkah Penggunaan",
      points: [
        "Upload gambar daun kentang",
        "Tunggu proses analisis selesai",
        "Lihat hasil deteksi dan tingkat confidence",
        "Baca rekomendasi yang diberikan"
      ]
    },
    {
      type: "features", 
      title: "🎯 Fitur Aplikasi",
      points: [
        "Deteksi 3 kondisi: Sehat, Early Blight, Late Blight",
        "Chatbot AI untuk konsultasi",
        "Galeri contoh gambar penyakit",
        "Mode gelap/terang otomatis"
      ]
    }
  ];

  return (
    <>      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-4 sm:right-4 md:bottom-20 md:right-6 lg:bottom-4 lg:right-12 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        title="Panduan Penggunaan Aplikasi"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Panduan Penggunaan Aplikasi
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 p-2 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {tips.map((tip, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      {tip.icon}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {examples.map((example, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {example.title}
                    </h3>
                    <ul className="space-y-2">
                      {example.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                          <span className="mr-2">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  💡 Tips Penggunaan
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
                  <li>• Gunakan gambar dengan resolusi yang cukup untuk hasil optimal</li>
                  <li>• Jika hasil confidence rendah (&lt;70%), coba gambar lain</li>
                  <li>• Manfaatkan chatbot untuk mendapat penjelasan detail tentang hasil</li>
                  <li>• Lihat galeri contoh untuk memahami karakteristik setiap penyakit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccuracyTips;
