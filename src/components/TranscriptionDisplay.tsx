'use client';

import { useRef } from 'react';

interface TranscriptionDisplayProps {
  audioBlob: Blob;
  transcribedText: string;
  detectedLanguage: string;
  onConvert: () => void;
  showConvertButton: boolean;
  loading?: boolean;
}

export default function TranscriptionDisplay({
  audioBlob,
  transcribedText,
  detectedLanguage,
  onConvert,
  showConvertButton,
  loading = false,
}: TranscriptionDisplayProps) {
  const getLanguageName = (code: string) => {
    return code === 'ta' ? 'Tamil (தமிழ்)' : 'English';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Step 2: Speech-to-Text Conversion
      </h2>

      {showConvertButton && (
        <div className="space-y-3 mb-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎤</span>
              <div className="flex-1">
                <p className="font-semibold text-blue-900 mb-1">Ready to convert speech to text?</p>
                <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                  <li>Click the button below</li>
                  <li>Allow microphone access when prompted</li>
                  <li>Speak your complaint clearly</li>
                  <li>Wait for the text to appear</li>
                </ol>
                <p className="text-xs text-blue-600 mt-2">
                  💡 <strong>Tip:</strong> Speak in English or Tamil. Make sure you're in a quiet environment for best results.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onConvert}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-lg font-semibold rounded-lg hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <span className="animate-pulse text-2xl">🎙️</span>
                <span className="animate-pulse">Listening... Speak Now!</span>
              </>
            ) : (
              <>
                <span className="text-2xl">🗣️</span>
                <span>Start Speaking (Speech to Text)</span>
              </>
            )}
          </button>
        </div>
      )}

      {transcribedText && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-700">Transcribed Text:</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              detectedLanguage === 'ta' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {getLanguageName(detectedLanguage)}
            </span>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {transcribedText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
