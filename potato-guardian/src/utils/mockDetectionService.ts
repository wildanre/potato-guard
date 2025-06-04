import { DiseaseResult } from '../types';

// Mock disease database
const diseaseDatabase: Record<string, DiseaseResult> = {
  'early_blight': {
    name: 'Early Blight',
    confidence: 0.92,
    description: 'Early blight is a fungal disease caused by Alternaria solani. It appears as brown to black lesions with concentric rings, forming a target-like pattern. It typically affects older leaves first and can spread to stems and fruit.',
    treatment: 'Apply fungicides containing chlorothalonil or copper. Practice crop rotation, remove infected plants, and ensure adequate spacing for air circulation. Water at the base of plants and avoid wetting the foliage.'
  },
  'late_blight': {
    name: 'Late Blight',
    confidence: 0.87,
    description: 'Late blight is caused by the oomycete Phytophthora infestans. It appears as water-soaked, gray-green lesions that quickly turn brown to black. White fungal growth may be visible on the underside of leaves in humid conditions.',
    treatment: 'Apply fungicides preventatively, especially before rainy periods. Remove and destroy infected plants immediately. Avoid overhead irrigation and improve air circulation. Plant resistant varieties when available.'
  },
  'healthy': {
    name: 'Healthy',
    confidence: 0.95,
    description: 'The leaf appears healthy with no signs of disease. Healthy potato leaves are typically medium to dark green, with a slightly fuzzy texture and a compound leaf structure.',
    treatment: 'Continue with regular preventative care: proper watering, balanced fertilization, and monitoring for early signs of pests or disease.'
  }
};

// This is a mock service that simulates detection API
export const detectDisease = (imageFile: File): Promise<DiseaseResult> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Randomly select a disease from the database
      const diseases = Object.keys(diseaseDatabase);
      const randomIndex = Math.floor(Math.random() * diseases.length);
      const selectedDisease = diseases[randomIndex];
      
      resolve(diseaseDatabase[selectedDisease]);
    }, 2000); // Simulate a 2-second processing time
  });
};