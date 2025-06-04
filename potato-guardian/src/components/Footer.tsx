import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 px-6 bg-green-50 dark:bg-green-950 transition-colors duration-300 border-t border-green-100 dark:border-green-900">
      <div className="container mx-auto text-center">
        <p className="text-green-700 dark:text-green-300 flex items-center justify-center">
          &copy; 2025 <Heart className="h-4 w-4 mx-1 text-red-500" /> Untuk Kentang yang Sehat
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
          © {new Date().getFullYear()} Pelindung Kentang - Deteksi Penyakit Daun Kentang
        </p>
      </div>
    </footer>
  );
};

export default Footer;