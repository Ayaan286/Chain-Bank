import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Loader, CheckCircle, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    userType: 'individual',
    dateOfBirth: '',
    agreeToTerms: false,
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia',
    'Japan', 'South Korea', 'India', 'China', 'Brazil', 'Mexico', 'Argentina',
    'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Morocco', 'Ghana', 'Ethiopia'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.country) {
      setError('Please select your country');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateStep2()) {
      setLoading(false);
      return;
    }

    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            country: formData.country,
            user_type: formData.userType,
            date_of_birth: formData.dateOfBirth
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              country: formData.country,
              user_type: formData.userType,
              date_of_birth: formData.dateOfBirth,
              email: formData.email,
              email_verified: false,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) throw profileError;

        // Refresh profile data
        await refreshProfile();

        setEmailSent(true);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCurrentStep(1);
      setFormData({
        fullName: '',
        country: '',
        userType: 'individual',
        dateOfBirth: '',
        agreeToTerms: false,
        email: '',
        password: '',
        confirmPassword: ''
      });
      setError('');
      setSuccess(false);
      setEmailSent(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative animate-slide-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          <X className="h-6 w-6" />
        </button>

        {!success ? (
          <>
            <h2 className="text-2xl font-bold mb-6 gradient-text">Create Your Account</h2>

            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex justify-between mb-4">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-1/2 h-1 rounded-full ${
                      step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                    } transition-all duration-300`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 text-center">
                Step {currentStep} of 2
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {currentStep === 1 ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Type *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="userType"
                          value="individual"
                          checked={formData.userType === 'individual'}
                          onChange={(e) => handleInputChange('userType', e.target.value)}
                          className="mr-2"
                        />
                        Individual
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="userType"
                          value="business"
                          checked={formData.userType === 'business'}
                          onChange={(e) => handleInputChange('userType', e.target.value)}
                          className="mr-2"
                        />
                        Business
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                        placeholder="Create a password (min 8 characters)"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-1/2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

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
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                Please click the verification link in your email to complete your registration.
                You can close this window and return to sign in once verified.
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

export default RegisterModal;