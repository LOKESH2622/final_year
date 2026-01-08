'use client';

import { useState, useRef } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import TranscriptionDisplay from '@/components/TranscriptionDisplay';
import ComplaintDisplay from '@/components/ComplaintDisplay';
import VerificationSection from '@/components/VerificationSection';
import SuccessMessage from '@/components/SuccessMessage';

export default function Home() {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState<'audio' | 'text'>('audio');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [manualText, setManualText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [complaintText, setComplaintText] = useState('');
  const [category, setCategory] = useState('');
  const [complaintId, setComplaintId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setInputMode('audio');
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
    // Skip directly to step 3 for manual text (no need for transcription step)
    setStep(3);
  };

  const handleTranscriptionComplete = async () => {
    if (!audioBlob) return;

    setLoading(true);
    
    try {
      // Use browser's Web Speech API for better accuracy
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
        setLoading(false);
        return;
      }

      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately - we just needed permission
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        alert('🎤 Microphone access is required. Please click Allow when your browser asks for permission.');
        setLoading(false);
        return;
      }

      // Create recognition instance
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      // Start with English - user can choose language preference
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log('🎤 Speech recognition started. Speak now...');
      };
      
      recognition.onresult = (event: any) => {
        const result = event.results[0][0];
        const transcript = result.transcript;
        const confidence = result.confidence;
        
        console.log(`✅ Recognized: "${transcript}" (confidence: ${(confidence * 100).toFixed(0)}%)`);
        
        if (transcript && transcript.trim().length > 0) {
          // Detect if text contains Tamil characters
          const tamilPattern = /[\u0B80-\u0BFF]/;
          const isTamil = tamilPattern.test(transcript);
          
          setTranscribedText(transcript);
          setDetectedLanguage(isTamil ? 'ta' : 'en');
          setStep(3);
        } else {
          alert('No text recognized. Please try again or use manual text entry.');
        }
        setLoading(false);
      };

      recognition.onerror = (event: any) => {
        console.error('❌ Recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again and speak clearly, or use manual text entry.');
        } else if (event.error === 'audio-capture') {
          alert('🎤 Microphone not detected. Please check your microphone and try again.');
        } else if (event.error === 'not-allowed') {
          alert('🚫 Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'aborted') {
          // User stopped - no alert needed
          console.log('Speech recognition aborted by user');
        } else {
          alert('Speech recognition failed. Please try manual text entry instead.');
        }
        
        setLoading(false);
      };

      recognition.onend = () => {
        console.log('🔴 Speech recognition ended');
        setLoading(false);
      };

      // Start recognition
      recognition.start();

    } catch (error) {
      alert('Error during transcription. Please try manual text entry.');
      console.error(error);
      setLoading(false);
    }
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
        setStep(4);
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
        setStep(5);
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
    setInputMode('audio');
    setAudioBlob(null);
    setTranscribedText('');
    setManualText('');
    setDetectedLanguage('en');
    setComplaintText('');
    setCategory('');
    setComplaintId('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎤 Speech-to-Text Complaint System
          </h1>
          <p className="text-gray-600">
            Record your complaint or type it manually (Tamil / English)
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Groq AI Powered
            </span>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              ✓ Tamil & English
            </span>
          </div>
        </header>

        <div className="space-y-6">
          {/* Step 1: Input Method Selection */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Choose Input Method
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🎤 Audio Recording</h3>
                  <p className="text-gray-600 text-sm mb-4">Record your complaint using microphone</p>
                  <AudioRecorder
                    onRecordingComplete={handleRecordingComplete}
                    disabled={false}
                  />
                </div>
                
                <div className="border-2 border-green-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">⌨️ Manual Text Entry</h3>
                  <p className="text-gray-600 text-sm mb-4">Type your complaint directly</p>
                  <div className="space-y-3">
                    <textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Enter your complaint in Tamil or English..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                    <button
                      onClick={handleManualTextSubmit}
                      disabled={!manualText.trim()}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Submit Text
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Audio Transcription (for audio mode only) */}
          {step >= 2 && inputMode === 'audio' && audioBlob && (
            <TranscriptionDisplay
              audioBlob={audioBlob}
              transcribedText={transcribedText}
              detectedLanguage={detectedLanguage}
              onConvert={handleTranscriptionComplete}
              showConvertButton={step === 2}
              loading={loading}
            />
          )}

          {/* Step 2b: Show transcribed text for manual entry */}
          {step >= 3 && inputMode === 'text' && transcribedText && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Input Text
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-700">Entered Text:</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    detectedLanguage === 'ta' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {detectedLanguage === 'ta' ? 'Tamil (தமிழ்)' : 'English'}
                  </span>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {transcribedText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generate Complaint */}
          {step >= 3 && transcribedText && (
            <ComplaintDisplay
              complaintText={complaintText}
              onGenerate={handleGenerateComplaint}
              showGenerateButton={step === 3}
              loading={loading}
            />
          )}

          {/* Step 4: Verification */}
          {step >= 4 && complaintText && (
            <VerificationSection
              complaintText={complaintText}
              language={detectedLanguage}
              onConfirm={handleConfirmComplaint}
              onRetry={handleReset}
              loading={loading}
            />
          )}

          {/* Step 5: Success */}
          {step === 5 && (
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
