'use client';

import { useState } from 'react';

interface VerificationSectionProps {
  complaintText: string;
  language: string;
  onConfirm: () => void;
  onRetry: () => void;
  loading?: boolean;
}

export default function VerificationSection({
  complaintText,
  language,
  onConfirm,
  onRetry,
  loading: externalLoading = false,
}: VerificationSectionProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  const handleListenToComplaint = async () => {
    setTtsLoading(true);
    try {
      // Check if browser supports speech synthesis
      if (!('speechSynthesis' in window)) {
        alert('Text-to-speech is not supported in your browser. Please use Chrome, Edge, or Safari.');
        setTtsLoading(false);
        return;
      }

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: complaintText,
          language: language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Use browser's speech synthesis
        const utterance = new SpeechSynthesisUtterance(data.text);
        utterance.lang = data.language;
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(language === 'ta' ? 'ta' : 'en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        
        // Create a dummy audio URL to show success
        setAudioUrl('browser-tts-active');
      } else {
        alert('Failed to generate audio');
      }
    } catch (error) {
      alert('Error generating audio');
      console.error(error);
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <div className="glass-effect rounded-2xl shadow-2xl shadow-orange-500/20 p-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
          <span className="text-3xl">✅</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Verify Your Complaint
        </h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/50 rounded-xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="font-bold text-yellow-300 mb-2 text-lg">
                👀 Final Review
              </p>
              <p className="text-yellow-200">
                Please review your complaint carefully before submitting. You can listen to it being read aloud to verify all details are correct.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleListenToComplaint}
          disabled={ttsLoading}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 font-bold text-lg transform hover:scale-105"
        >
          <span className="text-2xl">🔊</span>
          {ttsLoading ? 'Generating Audio...' : 'Listen to Complaint'}
        </button>

        {audioUrl && (
          <div className="space-y-3 animate-slide-up">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <p className="font-bold text-green-400 text-lg">Audio is playing through your speakers</p>
            </div>
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-xl p-4 shadow-md">
              <p className="text-green-200 font-medium">
                🎧 The complaint is being read aloud. Listen carefully to verify all details.
              </p>
            </div>
          </div>
        )}

        <div className="border-t-2 border-gray-700 pt-6 mt-6">
          <h3 className="text-2xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <span>📤</span>
            Confirm Submission
          </h3>
          <p className="text-gray-300 text-base mb-6 font-medium">
            Once you click "Confirm & Submit", your complaint will be officially registered in the system and forwarded for processing.
          </p>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={onConfirm}
              disabled={externalLoading}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold text-xl transform hover:scale-105"
            >
              {externalLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">✅</span>
                  <span>Confirm & Submit</span>
                </>
              )}
            </button>

            <button
              onClick={onRetry}
              disabled={externalLoading}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold text-xl transform hover:scale-105"
            >
              <span className="text-2xl">🔄</span>
              <span>Start Over</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
