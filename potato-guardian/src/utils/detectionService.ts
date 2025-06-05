import { DiseaseResult } from '../types';

// Disease information mapping based on prediction results
const diseaseInfo: Record<string, Omit<DiseaseResult, 'name' | 'confidence'>> = {
  'Early_Blight': {
    description: 'Early blight adalah penyakit jamur yang disebabkan oleh Alternaria solani. Muncul sebagai lesi berwarna coklat hingga hitam dengan cincin konsentris, membentuk pola seperti target. Biasanya menyerang daun yang lebih tua terlebih dahulu dan dapat menyebar ke batang dan buah.',
    treatment: 'Aplikasikan fungisida yang mengandung chlorothalonil atau tembaga. Lakukan rotasi tanaman, buang tanaman yang terinfeksi, dan pastikan jarak tanam yang cukup untuk sirkulasi udara. Siram di pangkal tanaman dan hindari membasahi daun.'
  },
  'Late_Blight': {
    description: 'Late blight disebabkan oleh oomycete Phytophthora infestans. Muncul sebagai lesi basah berwarna abu-abu kehijauan yang dengan cepat berubah menjadi coklat hingga hitam. Pertumbuhan jamur putih mungkin terlihat di bagian bawah daun dalam kondisi lembab.',
    treatment: 'Aplikasikan fungisida secara preventif, terutama sebelum musim hujan. Segera buang dan hancurkan tanaman yang terinfeksi. Hindari irigasi di atas kepala dan tingkatkan sirkulasi udara. Tanam varietas yang tahan jika tersedia.'
  },
  'Healthy': {
    description: 'Daun terlihat sehat tanpa tanda-tanda penyakit. Daun kentang yang sehat biasanya berwarna hijau sedang hingga hijau tua, dengan tekstur sedikit berbulu dan struktur daun majemuk.',
    treatment: 'Lanjutkan perawatan preventif reguler: penyiraman yang tepat, pemupukan seimbang, dan pemantauan tanda-tanda awal hama atau penyakit.'
  }
};

// Get API URL from environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL;
//  || 'http://localhost:5000'

// Real API service for disease detection
export const detectDisease = async (imageFile: File): Promise<DiseaseResult> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        // Add ngrok-skip-browser-warning header to avoid ngrok warning page
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();    if (result.status === 'success') {
      const diseaseKey = result.prediction as keyof typeof diseaseInfo;
      const info = diseaseInfo[diseaseKey] || diseaseInfo['Healthy'];
      
      return {
        name: result.prediction,
        confidence: result.confidence,
        description: info.description,
        treatment: info.treatment,
        isUncertain: result.is_uncertain,
        warning: result.warning,
        allPredictions: result.all_predictions,
        rawConfidence: result.raw_confidence,
        qualityScore: result.quality_score
      };} else {
      throw new Error(result.message || 'Prediction failed');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to connect to prediction service');
  }
};
