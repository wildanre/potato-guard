import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { DiseaseResult } from '../types';

interface ResultsDisplayProps {
  result: DiseaseResult | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  if (!result) return null;

  // Determine severity level based on the disease and confidence
  const getSeverityLevel = () => {
    if (result.name === 'Healthy') return 'healthy';
    
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
        <div>
          <h3 className="font-bold text-lg">{result.name}</h3>
          <p className="text-sm">
            Confidence: {Math.round(result.confidence * 100)}%
          </p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h4>
          <p className="text-gray-700 dark:text-gray-300">{result.description}</p>
        </div>
        
        {result.name !== 'Healthy' && (
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Treatment</h4>
            <p className="text-gray-700 dark:text-gray-300">{result.treatment}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;