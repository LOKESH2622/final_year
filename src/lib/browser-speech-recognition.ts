// Simple speech recognition utility using browser's Web Speech API
// This is a client-side fallback when server-side recognition is not available

export interface SpeechRecognitionResult {
  text: string;
  language: string;
  confidence: number;
}

export class BrowserSpeechRecognition {
  private recognition: any;

  constructor() {
    // Check for browser support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  async recognizeAudio(audioBlob: Blob, language: 'en' | 'ta' = 'en'): Promise<SpeechRecognitionResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      // Set language
      this.recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

      // Set up event handlers
      this.recognition.onresult = (event: any) => {
        const result = event.results[0][0];
        resolve({
          text: result.transcript,
          language: language,
          confidence: result.confidence,
        });
      };

      this.recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      // For blob, we need to play it while recording
      // This is a workaround since Web Speech API doesn't directly support blob input
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
      this.recognition.start();

      // Stop recognition when audio ends
      audio.onended = () => {
        setTimeout(() => {
          this.recognition.stop();
        }, 500);
      };
    });
  }

  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    );
  }
}
