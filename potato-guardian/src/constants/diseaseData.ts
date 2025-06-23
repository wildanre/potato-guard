import { createElement } from 'react';
import { Leaf, Droplets, Heart } from 'lucide-react';
import { DiseaseInfo } from '../types/disease';

export const DISEASE_DATA: DiseaseInfo[] = [
  {
    icon: createElement(Heart, { className: "h-8 w-8 text-green-600 dark:text-green-400" }),
    title: 'Healthy',
    description: 'Daun kentang yang sehat dengan warna hijau normal dan tidak ada tanda-tanda penyakit.',
    images: ['Healthy_1.jpg', 'Healthy_2.jpg', 'Healthy_3.jpg'],
    color: 'green'
  },
  {
    icon: createElement(Leaf, { className: "h-8 w-8 text-yellow-600 dark:text-yellow-400" }),
    title: 'Early Blight',
    description: 'Penyakit fungal yang ditandai dengan noda coklat dengan cincin konkret, biasanya mempengaruhi daun tua terlebih dahulu.',
    images: ['Early_Blight_1.jpg', 'Early_Blight_2.jpg', 'Early_Blight_3.jpg'],
    color: 'yellow'
  },
  {
    icon: createElement(Droplets, { className: "h-8 w-8 text-red-600 dark:text-red-400" }),
    title: 'Late Blight',
    description: 'Infeksi mold air yang menyebabkan noda gelap, lembab, dan terlihat pada daun dan batang, menyebar dengan cepat dalam kondisi dingin dan lembab.',
    images: ['Late_Blight_1.jpg', 'Late_Blight_2.jpg', 'Late_Blight_3.jpg'],
    color: 'red'
  }
];
