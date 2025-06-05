import React from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { DiseaseResult } from '../types';

interface ResultsDisplayProps {
  result: DiseaseResult | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) return null;

  // Determine severity level based on the disease, confidence, and uncertainty
  const getSeverityLevel = () => {
    if (result.name === 'Healthy') return 'healthy';
    
    // Consider uncertainty in severity calculation
    if (result.isUncertain) return 'uncertain';
    if (result.confidence > 0.8) return 'high';
    if (result.confidence > 0.6) return 'medium';
    return 'low';
  };

  const severity = getSeverityLevel();

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div 
        className={`
          p-4 flex items-center
          ${severity === 'healthy' 
            ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' 
            : severity === 'high' 
              ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200' 
              : severity === 'medium' 
                ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200' 
              : severity === 'uncertain'
                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200'
                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200'
          }
        `}
      >
        {severity === 'healthy' ? (
          <CheckCircle className="h-6 w-6 mr-2" />
        ) : severity === 'high' ? (
          <AlertTriangle className="h-6 w-6 mr-2" />
        ) : (
          <Info className="h-6 w-6 mr-2" />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{result.name.replace(/_/g, ' ')}</h3>
            {result.isUncertain && (
              <span className="px-2 py-1 bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                Tidak Pasti
              </span>
            )}
          </div>            <p className="text-sm">
              Probabilitas: {Math.round(result.confidence * 100)}%
              {result.qualityScore && (
                <span className="ml-2 text-xs opacity-75">
                  (Kualitas: {Math.round(result.qualityScore * 100)}%)
                </span>
              )}
            </p>
        </div>
      </div>
      
      {/* Warning for uncertain predictions */}
      {result.warning && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">{result.warning}</p>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* All predictions display */}
        {result.allPredictions && Object.keys(result.allPredictions).length > 1 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analisis Probabilitas
            </h4>
            <div className="space-y-2">
              {Object.entries(result.allPredictions)
                .sort(([,a], [,b]) => b - a)
                .map(([disease, confidence]) => (
                  <div key={disease} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {disease.replace(/_/g, ' ')}
                    </span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {Math.round(confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Deskripsi</h4>
          <p className="text-gray-700 dark:text-gray-300">{result.description}</p>
        </div>
        
        {result.name !== 'Healthy' && (
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Pengobatan</h4>
            <p className="text-gray-700 dark:text-gray-300">{result.treatment}</p>
            
            {result.isUncertain && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Catatan:</strong> Karena tingkat akurasi rendah, disarankan untuk:
                </p>
                <ul className="text-sm text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                  <li>• Mengambil foto dengan pencahayaan yang lebih baik</li>
                  <li>• Memastikan daun terlihat jelas dan fokus</li>
                  <li>• Konsultasi dengan ahli tanaman jika gejala berlanjut</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;