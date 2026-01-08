'use client';

import { useState, useRef, useEffect } from 'react';

interface LiveSpeechRecognitionProps {
  onTranscriptionComplete: (text: string, language: string) => void;
  disabled?: boolean;
}

export default function LiveSpeechRecognition({ 
  onTranscriptionComplete, 
  disabled 
}: LiveSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [recordingTime, setRecordingTime] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (final) {
          finalTranscriptRef.current += final;
          setFinalText(finalTranscriptRef.current);
          setInterimText('');
        } else {
          setInterimText(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          // Continue listening
          return;
        }
        
        if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'audio-capture') {
          alert('No microphone detected. Please connect a microphone and try again.');
        } else if (event.error !== 'aborted') {
          alert(`Speech recognition error: ${event.error}`);
        }
        
        stopListening();
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        if (isListening) {
          // Restart if we're still supposed to be listening
          try {
            recognition.start();
          } catch (e) {
            console.log('Could not restart recognition');
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening]);

  const startListening = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Reset state
      setFinalText('');
      setInterimText('');
      setRecordingTime(0);
      finalTranscriptRef.current = '';
      
      // Set language
      recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      
      // Start recognition
      recognitionRef.current.start();
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please grant permission and try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsListening(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleComplete = () => {
    stopListening();
    
    const fullText = finalTranscriptRef.current.trim();
    
    if (!fullText) {
      alert('No speech was detected. Please try again and speak clearly.');
      return;
    }
    
    // Detect if text contains Tamil characters
    const tamilPattern = /[\u0B80-\u0BFF]/;
    const detectedLanguage = tamilPattern.test(fullText) ? 'ta' : 'en';
    
    onTranscriptionComplete(fullText, detectedLanguage);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* Language Selection */}
      {!isListening && (
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-700">
          <label className="font-bold text-gray-200 text-sm mb-3 block">🌍 Select Language:</label>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 px-5 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                language === 'en'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`flex-1 px-5 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                language === 'ta'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300'
              }`}
            >
              🇮🇳 தமிழ்
            </button>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={startListening}
          disabled={isListening || disabled}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg transform hover:scale-105"
        >
          <span className="text-2xl">🎙️</span>
          Start Speaking
        </button>

        <button
          onClick={stopListening}
          disabled={!isListening}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg transform hover:scale-105"
        >
          <span className="text-2xl">⏹️</span>
          Stop
        </button>

        <button
          onClick={handleComplete}
          disabled={isListening || !finalText}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg transform hover:scale-105"
        >
          <span className="text-2xl">✓</span>
          Done
        </button>
      </div>

      {/* Recording Status */}
      {isListening && (
        <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border-2 border-red-500/50 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-6 h-6 bg-red-600 rounded-full mic-pulse"></div>
                <div className="absolute inset-0 w-6 h-6 bg-red-600 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="font-bold text-red-400 text-xl">
                🎤 Recording... {formatTime(recordingTime)}
              </span>
            </div>
            <div className="flex gap-1">
              <span className="audio-wave"></span>
              <span className="audio-wave"></span>
              <span className="audio-wave"></span>
              <span className="audio-wave"></span>
              <span className="audio-wave"></span>
            </div>
          </div>
        </div>
      )}

      {/* Transcription Display */}
      {(finalText || interimText) && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border-2 border-blue-500/50 p-6 shadow-lg animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📝</span>
            <h3 className="font-bold text-gray-200 text-lg">
              {isListening ? '✨ Live Transcription' : '📄 Transcribed Text'}
            </h3>
          </div>
          <div className="text-gray-100 text-lg leading-relaxed bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 min-h-[100px]">
            {finalText && <span className="font-medium">{finalText}</span>}
            {interimText && (
              <span className="text-blue-400 italic font-medium">{interimText}</span>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isListening && !finalText && (
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/50 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💡</span>
            <h3 className="font-bold text-gray-200">Quick Guide</h3>
          </div>
          <div className="space-y-2 text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">1.</span>
              <p className="font-medium">Select your preferred language (English or தமிழ்)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">2.</span>
              <p className="font-medium">Click "Start Speaking" and speak clearly into your microphone</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">3.</span>
              <p className="font-medium">Watch your words appear in real-time as you speak</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">4.</span>
              <p className="font-medium">Click "Stop" when finished, review the text, and click "Done"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
