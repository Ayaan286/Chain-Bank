import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Loader, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [currentView, setCurrentView] = useState<'signin' | 'forgot'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user) {
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          setError('Please verify your email before signing in. Check your inbox for the verification link.');
          return;
        }

        // Update email_verified status in profiles table
        try {
          await supabase
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', data.user.id);
        } catch (profileError) {
          console.error('Error updating profile:', profileError);
          // Continue anyway - this is not critical
        }

        // Refresh profile data
        try {
          await refreshProfile();
        } catch (refreshError) {
          console.error('Error refreshing profile:', refreshError);
          // Continue anyway
        }

        onClose();
        navigate('/wallet');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      setEmailSent(true);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'An error occurred while sending reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCurrentView('signin');
      setFormData({ email: '', password: '' });
      setResetEmail('');
      setError('');
      setSuccess(false);
      setEmailSent(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          <X className="h-6 w-6" />
        </button>

        {!success ? (
          <>
            {currentView === 'signin' ? (
              <>
                <h2 className="text-2xl font-bold mb-6 gradient-text">Sign In</h2>

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentView('forgot')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                    disabled={loading}
                  >
                    Forgot your password?
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setCurrentView('signin')}
                    className="mr-3 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-2xl font-bold gradient-text">Reset Password</h2>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentView('signin')}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                    disabled={loading}
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{resetEmail}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                Click the link in your email to reset your password. You can close this window and return to sign in once you've reset your password.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInModal; 