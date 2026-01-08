'use client';

interface ComplaintDisplayProps {
  complaintText: string;
  onGenerate: () => void;
  showGenerateButton: boolean;
  loading?: boolean;
}

export default function ComplaintDisplay({
  complaintText,
  onGenerate,
  showGenerateButton,
  loading = false,
}: ComplaintDisplayProps) {
  return (
    <div className="glass-effect rounded-2xl shadow-2xl shadow-purple-500/20 p-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
          <span className="text-3xl">🤖</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          AI-Powered Complaint Generator
        </h2>
      </div>

      {showGenerateButton && (
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-2 border-blue-500/50 rounded-xl p-5 shadow-md">
            <div className="flex items-start gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <p className="font-bold text-blue-300 mb-2 text-lg">
                  🧠 Advanced AI Processing
                </p>
                <p className="text-blue-200">
                  Our intelligent system will analyze your input and create a professional, well-structured complaint letter automatically.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold text-xl transform hover:scale-105 relative overflow-hidden group"
          >
            {loading ? (
              <>
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating with AI...</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-3xl">🤖</span>
                <span>Generate Complaint Letter</span>
                <span className="text-2xl">✨</span>
              </>
            )}
          </button>
        </div>
      )}

      {complaintText && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg shadow-md">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-200">
              📜 AI-Generated Complaint Letter
            </h3>
          </div>
          
          <div className="relative bg-gradient-to-br from-gray-800/50 to-blue-900/30 border-2 border-indigo-500/50 rounded-2xl p-8 shadow-xl">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-bl-xl rounded-tr-xl font-bold text-sm">
              AI Generated 🤖
            </div>
            <pre className="text-gray-200 whitespace-pre-wrap font-sans text-base leading-relaxed mt-6">
              {complaintText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
