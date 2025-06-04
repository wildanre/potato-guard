import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import InfoSection from './components/InfoSection';
import { detectDisease } from './utils/mockDetectionService';
import { DiseaseResult, UploadStatus } from './types';

function App() {
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    isProcessing: false,
    error: null
  });

  const handleImageSelect = async (file: File) => {
    setResult(null);
    setUploadStatus({
      isUploading: true,
      isProcessing: false,
      error: null
    });

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setUploadStatus({
        isUploading: false,
        isProcessing: true,
        error: null
      });

      // Process the image using the mock detection service
      const detectionResult = await detectDisease(file);

      setResult(detectionResult);
      setUploadStatus({
        isUploading: false,
        isProcessing: false,
        error: null
      });
    } catch (error) {
      setUploadStatus({
        isUploading: false,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'An error occurred during processing. Please try again.'
      });
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-green-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />

        <main className="flex-grow">
          <section className="py-12 px-6">
            <div className="container mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-4">
                Pendeteksian Penyakit Daun Kentang
              </h1>
              <p className="max-w-2xl mx-auto text-green-700 dark:text-green-400">
                Upload gambar daun kentang untuk mendeteksi penyakit dan dapatkan rekomendasi pengobatan.
              </p>
            </div>

            <ImageUploader
              onImageSelect={handleImageSelect}
              uploadStatus={uploadStatus}
            />

            <ResultsDisplay result={result} />
          </section>

          <InfoSection />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;