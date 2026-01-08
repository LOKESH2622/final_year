'use client';

import { useState } from 'react';
import LiveSpeechRecognition from '@/components/LiveSpeechRecognition';
import ComplaintDisplay from '@/components/ComplaintDisplay';
import VerificationSection from '@/components/VerificationSection';
import SuccessMessage from '@/components/SuccessMessage';

export default function Home() {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState<'speech' | 'text'>('speech');
  const [transcribedText, setTranscribedText] = useState('');
  const [manualText, setManualText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [complaintText, setComplaintText] = useState('');
  const [category, setCategory] = useState('');
  const [complaintId, setComplaintId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSpeechComplete = (text: string, language: string) => {
    setTranscribedText(text);
    setDetectedLanguage(language);
    setInputMode('speech');
    setStep(2);
  };

  const handleManualTextSubmit = () => {
    if (!manualText.trim()) {
      alert('Please enter your complaint text');
      return;
    }
    
    // Detect language from text
    const tamilPattern = /[\u0B80-\u0BFF]/;
    const isTamil = tamilPattern.test(manualText);
    
    setTranscribedText(manualText);
    setDetectedLanguage(isTamil ? 'ta' : 'en');
    setInputMode('text');
    setStep(2);
  };

  const handleGenerateComplaint = async () => {
    if (!transcribedText) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcribedText,
          language: detectedLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComplaintText(data.complaint);
        setCategory(data.category);
        setStep(3);
      } else {
        alert('Failed to generate complaint: ' + data.error);
      }
    } catch (error) {
      alert('Error connecting to server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmComplaint = async () => {
    if (!complaintText) return;

    setLoading(true);
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint: complaintText,
          transcribed_text: transcribedText,
          language: detectedLanguage,
          category: category,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComplaintId(data.complaint_id);
        setStep(4);
      } else {
        alert('Failed to submit complaint: ' + data.error);
      }
    } catch (error) {
      alert('Error connecting to server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setInputMode('speech');
    setTranscribedText('');
    setManualText('');
    setDetectedLanguage('en');
    setComplaintText('');
    setCategory('');
    setComplaintId('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with modern design */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full animate-float shadow-2xl shadow-purple-500/50">
              <span className="text-6xl">🎤</span>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Smart Voice Complaint System
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            Express yourself in <span className="text-blue-400 font-bold">English</span> or <span className="text-purple-400 font-bold">தமிழ்</span>
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-200 shadow-md border border-gray-700">
              ⚡ AI-Powered
            </span>
            <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-200 shadow-md border border-gray-700">
              🔒 Secure
            </span>
            <span className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-200 shadow-md border border-gray-700">
              🚀 Fast
            </span>
          </div>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="glass-effect rounded-2xl shadow-2xl p-8 mb-8 card-hover-effect">
          <div className="flex items-center justify-between">
            {['Input', 'Generate', 'Verify', 'Complete'].map((label, index) => (
              <div
                key={index}
                className={`flex-1 text-center transition-all duration-500 ${
                  step > index + 1 ? 'opacity-100 scale-105' : step === index + 1 ? 'opacity-100 scale-110' : 'opacity-40 scale-95'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg transition-all duration-500 ${
                    step > index + 1
                      ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg'
                      : step === index + 1
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl animate-pulse-glow'
                      : 'bg-gray-300 text-gray-600 shadow-md'
                  }`}
                >
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <p className="text-sm font-bold text-gray-200">{label}</p>
              </div>
            ))}
          </div>
          {/* Progress Line */}
          <div className="relative mt-6">
            <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-800 rounded-full -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full -translate-y-1/2 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Step 1: Input Selection */}
          {step === 1 && (
            <div className="glass-effect rounded-2xl shadow-2xl shadow-purple-500/20 p-8 animate-slide-up">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
                Choose Your Input Method
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Live Speech Recognition */}
                <div className="group relative bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-2 border-blue-500/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 card-hover-effect cursor-pointer overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4 animate-float">🎙️</div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">Voice Input</h3>
                    <p className="text-gray-400 text-sm mb-5">Speak naturally and we'll transcribe in real-time</p>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">Live</span>
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full font-semibold">Real-time</span>
                    </div>
                    <LiveSpeechRecognition 
                      onTranscriptionComplete={handleSpeechComplete}
                    />
                  </div>
                </div>

                {/* Manual Text Entry */}
                <div className="group relative bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 card-hover-effect cursor-pointer overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-20 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4 animate-float">⌨️</div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">Text Input</h3>
                    <p className="text-gray-400 text-sm mb-5">Type your complaint directly in any language</p>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">Quick</span>
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs rounded-full font-semibold">Easy</span>
                    </div>
                    <div className="space-y-4">
                      <textarea
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        placeholder="Type your complaint in Tamil or English..."
                        className="w-full px-4 py-3 border-2 border-green-500/30 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 resize-none transition-all duration-300 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                        rows={4}
                      />
                      <button
                        onClick={handleManualTextSubmit}
                        disabled={!manualText.trim()}
                        className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg transform hover:scale-105"
                      >
                        Submit Text ✨
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Show Transcribed Text */}
          {step >= 2 && transcribedText && (
            <div className="glass-effect rounded-2xl shadow-2xl shadow-purple-500/20 p-8 animate-slide-up">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                📝 Your Input
              </h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-200">Detected Language:</h3>
                  <span className={`px-5 py-2 rounded-full text-base font-bold shadow-lg ${
                    detectedLanguage === 'ta' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}>
                    {detectedLanguage === 'ta' ? '🇮🇳 Tamil (தமிழ்)' : '🇬🇧 English'}
                  </span>
                </div>
                
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-2 border-gray-700 rounded-xl p-6 shadow-inner">
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
                    {transcribedText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Generate Complaint */}
          {step >= 2 && transcribedText && (
            <ComplaintDisplay
              complaintText={complaintText}
              onGenerate={handleGenerateComplaint}
              showGenerateButton={step === 2}
              loading={loading}
            />
          )}

          {/* Step 3: Verification */}
          {step >= 3 && complaintText && (
            <VerificationSection
              complaintText={complaintText}
              language={detectedLanguage}
              onConfirm={handleConfirmComplaint}
              onRetry={handleReset}
              loading={loading}
            />
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <SuccessMessage
              complaintId={complaintId}
              onNewComplaint={handleReset}
            />
          )}
        </div>
      </div>
    </main>
  );
}
