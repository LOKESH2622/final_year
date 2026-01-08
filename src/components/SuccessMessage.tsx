'use client';

interface SuccessMessageProps {
  complaintId: string;
  onNewComplaint: () => void;
}

export default function SuccessMessage({ complaintId, onNewComplaint }: SuccessMessageProps) {
  return (
    <div className="glass-effect rounded-2xl shadow-2xl shadow-green-500/20 p-10 text-center animate-slide-up">
      <div className="mb-8">
        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse-glow">
          <span className="text-7xl animate-float">✅</span>
        </div>
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
          🎉 Success! Complaint Registered!
        </h2>
        <p className="text-gray-300 text-lg mb-6 font-medium">
          Your complaint has been successfully submitted and is now in the system.
        </p>
        <div className="inline-block bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500/50 rounded-2xl px-8 py-5 shadow-xl">
          <p className="text-sm text-gray-300 mb-2 font-semibold">🏷️ Your Complaint ID:</p>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md border border-gray-700">
            <p className="text-3xl font-mono font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {complaintId}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/50 rounded-2xl p-6 mb-8 text-left shadow-lg">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">📄</span>
          <p className="font-bold text-blue-300 text-xl">
            What Happens Next?
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-lg">1.</span>
            <p className="text-blue-200 font-medium">
              💾 Your complaint has been securely saved to our database
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-lg">2.</span>
            <p className="text-blue-200 font-medium">
              👥 It will be reviewed by the appropriate department
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-lg">3.</span>
            <p className="text-blue-200 font-medium">
              🔍 Use your Complaint ID to track the status
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-400 font-bold text-lg">4.</span>
            <p className="text-blue-200 font-medium">
              📧 You may be contacted if additional information is needed
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNewComplaint}
        className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-2xl transition-all duration-300 mx-auto text-xl font-bold transform hover:scale-105"
      >
        <span className="text-2xl">➕</span>
        <span>Register New Complaint</span>
        <span className="text-2xl">🎙️</span>
      </button>

      <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
        <span>🔒</span>
        <p className="text-sm font-medium">
          Please save your Complaint ID for future reference
        </p>
      </div>
    </div>
  );
}
