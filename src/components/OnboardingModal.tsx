import React, { useState } from 'react';
import { X, Copy, CheckCircle, AlertTriangle, Shield, Key, CreditCard, Download, Eye, EyeOff } from 'lucide-react';
import { completeOnboarding, OnboardingData } from '../lib/onboarding';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingModal = ({ isOpen, onClose, onComplete }: OnboardingModalProps) => {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState<'welcome' | 'generating' | 'display' | 'confirm' | 'complete'>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleStartOnboarding = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');
    setStep('generating');

    try {
      const result = await completeOnboarding(user.id);
      
      if (result.success && result.data) {
        setOnboardingData(result.data);
        setStep('display');
      } else {
        setError(result.error || 'Failed to complete onboarding');
        setStep('welcome');
      }
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || 'An unexpected error occurred');
      setStep('welcome');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!hasConfirmed) {
      setError('Please confirm that you have saved your private key');
      return;
    }
    setStep('complete');
  };

  const handleComplete = async () => {
    try {
      await refreshProfile();
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error refreshing profile:', error);
      onClose();
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadPrivateKey = () => {
    if (!onboardingData) return;
    
    const blob = new Blob([onboardingData.privateKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'private-key.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    if (step === 'display' || step === 'confirm') {
      // Don't allow closing during critical steps
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          disabled={step === 'display' || step === 'confirm'}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Complete Your Account Setup</h2>
              <p className="text-gray-600 mb-6">
                To complete your account setup, we'll generate your unique account number and cryptographic keys for secure transactions.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold">12-Digit Account Number</h3>
                  <p className="text-sm text-gray-600">A unique identifier for your account</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Key className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Cryptographic Keys</h3>
                  <p className="text-sm text-gray-600">Secure public and private key pair for transactions</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}

            <button
              onClick={handleStartOnboarding}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Start Account Setup'}
            </button>
          </div>
        )}

        {/* Generating Step */}
        {step === 'generating' && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Generating Your Account</h2>
            <p className="text-gray-600">Creating your unique account number and cryptographic keys...</p>
          </div>
        )}

        {/* Display Step */}
        {step === 'display' && onboardingData && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Account Setup Complete!</h2>
              <p className="text-gray-600">Please save your account details securely.</p>
            </div>

            <div className="space-y-6">
              {/* Account Number */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Account Number</label>
                  <button
                    onClick={() => copyToClipboard(onboardingData.accountNumber, 'account')}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {copiedField === 'account' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="font-mono text-lg bg-white p-3 rounded border">
                  {onboardingData.accountNumber}
                </div>
              </div>

              {/* Public Key */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Public Key</label>
                  <button
                    onClick={() => copyToClipboard(onboardingData.publicKey, 'public')}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {copiedField === 'public' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {onboardingData.publicKey}
                </div>
              </div>

              {/* Wallet Address */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Wallet Address</label>
                  <button
                    onClick={() => copyToClipboard(onboardingData.walletAddress, 'wallet')}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {copiedField === 'wallet' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {onboardingData.walletAddress}
                </div>
              </div>

              {/* Private Key - Critical Security Warning */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Private Key (CRITICAL)</h3>
                    <p className="text-sm text-red-700">
                      This is your private key. Save it securely - you won't see it again!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-red-700">Private Key</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-red-600 hover:text-red-700"
                    >
                      {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(onboardingData.privateKey, 'private')}
                      className="text-red-600 hover:text-red-700"
                    >
                      {copiedField === 'private' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={downloadPrivateKey}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                  {showPrivateKey ? onboardingData.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setStep('confirm')}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                I Have Saved My Private Key
              </button>
            </div>
          </div>
        )}

        {/* Confirm Step */}
        {step === 'confirm' && (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Final Confirmation</h2>
              <p className="text-gray-600">Please confirm that you have securely saved your private key.</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Warning:</strong> If you haven't saved your private key, you will lose access to your account and any funds associated with it.
              </p>
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="confirm-save"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="confirm-save" className="ml-2 text-sm text-gray-700">
                I confirm that I have securely saved my private key
              </label>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={!hasConfirmed}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Complete Setup
            </button>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your account has been successfully set up. You can now access all features of the platform.
            </p>
            <button
              onClick={handleComplete}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal; 