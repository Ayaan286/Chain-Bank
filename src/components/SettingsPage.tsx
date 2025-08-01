import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Key, CheckCircle, XCircle, LogOut, RefreshCw, CreditCard, Wallet, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkOnboardingStatus, getOnboardingData } from '../lib/onboarding';
import OnboardingModal from './OnboardingModal';

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  country?: string;
  user_type?: string;
  date_of_birth?: string;
  email_verified?: boolean;
  created_at?: string;
  account_number?: string;
  public_key?: string;
  wallet_address?: string;
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
}

const SettingsPage = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<boolean | null>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await refreshProfile();
      await checkOnboardingStatusAndData();
    } catch (err) {
      setError('Failed to refresh profile data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const checkOnboardingStatusAndData = async () => {
    if (!user) return;
    
    try {
      const isOnboarded = await checkOnboardingStatus(user.id);
      setOnboardingStatus(isOnboarded);
      
      if (isOnboarded) {
        const data = await getOnboardingData(user.id);
        setOnboardingData(data);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleOnboardingComplete = async () => {
    await checkOnboardingStatusAndData();
    await refreshProfile();
  };

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setError('Loading timeout - please refresh the page');
      }
    }, 15000); // Increased to 15 seconds

    return () => clearTimeout(timeout);
  }, [loading]);

  // Check onboarding status when user loads
  useEffect(() => {
    if (user && !loading) {
      checkOnboardingStatusAndData();
    }
  }, [user, loading]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Settings</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Retry</span>
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your settings.</p>
        </div>
      </div>
    );
  }

  const settingsSections = [
    {
      icon: <User className="h-6 w-6" />,
      title: 'Profile Information',
      description: 'Your account information and personal details',
      items: [
        { 
          label: 'Full Name', 
          value: profile?.full_name || 'Not provided',
          icon: profile?.full_name ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'Email', 
          value: profile?.email || user?.email || 'Not provided',
          icon: profile?.email || user?.email ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'Country', 
          value: profile?.country || 'Not provided',
          icon: profile?.country ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'User Type', 
          value: profile?.user_type ? profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1) : 'Not provided',
          icon: profile?.user_type ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'Date of Birth', 
          value: formatDate(profile?.date_of_birth),
          icon: profile?.date_of_birth ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'Email Verified', 
          value: profile?.email_verified ? 'Yes' : 'No',
          icon: profile?.email_verified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        }
      ]
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Account & Wallet',
      description: 'Your account number and cryptographic wallet information',
      items: [
        { 
          label: 'Account Number', 
          value: onboardingData?.account_number || profile?.account_number || 'Not generated',
          icon: (onboardingData?.account_number || profile?.account_number) ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'Wallet Address', 
          value: onboardingData?.wallet_address || profile?.wallet_address || 'Not generated',
          icon: (onboardingData?.wallet_address || profile?.wallet_address) ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'Public Key', 
          value: onboardingData?.public_key || profile?.public_key ? 'Generated' : 'Not generated',
          icon: (onboardingData?.public_key || profile?.public_key) ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'Onboarding Status', 
          value: onboardingStatus ? 'Completed' : 'Pending',
          icon: onboardingStatus ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />
        },
        { 
          label: 'Onboarding Date', 
          value: formatDate(onboardingData?.onboarding_completed_at || profile?.onboarding_completed_at),
          icon: (onboardingData?.onboarding_completed_at || profile?.onboarding_completed_at) ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        }
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Security Settings',
      description: 'Manage your security preferences and authentication methods',
      items: [
        { 
          label: 'Two-Factor Authentication', 
          value: 'Disabled',
          icon: <XCircle className="h-4 w-4 text-red-500" />
        },
        { 
          label: 'Account Created', 
          value: formatDate(profile?.created_at),
          icon: profile?.created_at ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
        }
      ]
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Notifications',
      description: 'Configure how you receive alerts and updates',
      items: [
        { 
          label: 'Email Notifications', 
          value: 'Enabled',
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        },
        { 
          label: 'Transaction Alerts', 
          value: 'Enabled',
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <SettingsIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold gradient-text">Account Settings</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Refresh</span>
          </button>
          <button
            onClick={signOut}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Onboarding Status Banner */}
      {onboardingStatus === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Complete Account Setup</h3>
                <p className="text-yellow-700">
                  Your account needs to be fully set up. Generate your account number and cryptographic keys to access all features.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {settingsSections.map((section, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:scale-[1.01]"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-indigo-600">{section.icon}</div>
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                    <div className="font-medium break-all">{item.value}</div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Email Verification Status */}
        {profile && !profile.email_verified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800">Email Verification Required</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              Your email address has not been verified yet. Please check your inbox for the verification link and click it to complete your account setup.
            </p>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Resend Verification Email
            </button>
          </div>
        )}

        {/* Database Connection Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Connection Status</h3>
          </div>
          <p className="text-blue-700 mb-4">
            {profile ? 
              'Successfully connected to database. Your profile data is being displayed above.' :
              'Connected to authentication system. Some profile data may be missing.'
            }
          </p>
          <div className="text-sm text-blue-600">
            <p>User ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Email Confirmed: {user.email_confirmed_at ? 'Yes' : 'No'}</p>
            <p>Onboarding Status: {onboardingStatus ? 'Completed' : 'Pending'}</p>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default SettingsPage;