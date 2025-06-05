import React, { useState } from 'react';
import { HelpCircle, Camera, Sun, Target, Lightbulb, X } from 'lucide-react';

const AccuracyTips: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      icon: <Sun className="h-5 w-5 text-yellow-500" />,
      title: "Pencahayaan Optimal",
      description: "Gunakan cahaya alami yang merata, hindari bayangan keras atau cahaya terlalu terang yang menyebabkan overexposure."
    },
    {
      icon: <Target className="h-5 w-5 text-blue-500" />,
      title: "Fokus pada Daun",
      description: "Pastikan daun mengisi 60-80% frame gambar dengan latar belakang yang kontras (tanah, langit, atau permukaan gelap)."
    },
    {
      icon: <Camera className="h-5 w-5 text-green-500" />,
      title: "Kualitas Gambar",
      description: "Gunakan resolusi minimal 224x224 pixel, hindari blur, dan pastikan detail daun terlihat jelas."
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-purple-500" />,
      title: "Sudut Pengambilan",
      description: "Ambil foto dari atas daun dengan sudut 45-90 derajat untuk menangkap detail permukaan daun dengan baik."
    }
  ];

  const examples = [
    {
      type: "good",
      title: "✅ Gambar Baik",
      points: [
        "Daun terlihat jelas dan fokus",
        "Pencahayaan merata tanpa bayangan",
        "Latar belakang kontras",
        "Detail gejala penyakit terlihat"
      ]
    },
    {
      type: "bad", 
      title: "❌ Hindari",
      points: [
        "Gambar blur atau buram",
        "Pencahayaan terlalu gelap/terang",
        "Daun terlalu kecil dalam frame",
        "Banyak objek lain yang menganggu"
      ]
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Tips untuk Akurasi Terbaik"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Tips Meningkatkan Akurasi Deteksi
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Pro Tips
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                  <li>• Ambil beberapa foto dari sudut berbeda untuk hasil terbaik</li>
                  <li>• Bersihkan lensa kamera sebelum mengambil foto</li>
                  <li>• Jika confidence rendah (&lt;70%), coba ambil foto ulang dengan tips di atas</li>
                  <li>• Untuk gejala ringan, gunakan mode macro jika tersedia</li>
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
