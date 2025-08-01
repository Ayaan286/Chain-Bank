import React, { useRef, useState } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  status: 'Pending' | 'Verified' | 'Rejected';
}

const DecentralizedKYC: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;
    const newFiles: UploadedFile[] = Array.from(uploaded).map((file) => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      status: 'Pending',
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === id ? { ...file, status: 'Verified' } : file
        )
      );
      setVerifyingId(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }, 1800);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto p-6">
      {/* Main Panel */}
      <div className="flex-1 bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-2">Decentralized KYC (d-KYC)</h2>
        <p className="text-gray-600 mb-6">One-time identity verification stored securely on the blockchain.</p>
        {/* File Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Upload KYC Document (PDF, JPG, PNG)</label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
              onChange={handleFileUpload}
            />
          </div>
        </div>
        {/* Uploaded Files List */}
        <div>
          <h3 className="font-semibold mb-2">Uploaded Files</h3>
          {files.length === 0 ? (
            <div className="text-gray-400 italic">No files uploaded yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li key={file.id} className="flex items-center justify-between py-2">
                  <span className="truncate max-w-xs" title={file.name}>{file.name}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        file.status === 'Verified'
                          ? 'bg-green-100 text-green-700'
                          : file.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {file.status}
                    </span>
                    {file.status === 'Pending' && (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-60"
                        onClick={() => handleVerify(file.id)}
                        disabled={verifyingId === file.id}
                      >
                        {verifyingId === file.id ? 'Verifying...' : 'Verify Now'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
            KYC Document Verified Successfully!
          </div>
        )}
      </div>
      {/* Info Panel */}
      <div className="md:w-80 w-full bg-indigo-50 rounded-2xl shadow p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-indigo-700 mb-2">Why d-KYC?</h3>
        <ul className="list-disc pl-5 text-indigo-900 space-y-2 text-sm">
          <li>Reusable KYC across banks</li>
          <li>On-chain immutability</li>
          <li>Permissioned sharing</li>
        </ul>
        <div className="mt-4 text-xs text-indigo-500">Your documents are encrypted and only accessible to permissioned verifiers.</div>
      </div>
    </div>
  );
};

export default DecentralizedKYC; 