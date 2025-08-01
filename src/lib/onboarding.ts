import { supabase } from './supabase';
import { generateAccountNumber, generateKeyPair, hashPrivateKey } from './crypto';

export interface OnboardingData {
  accountNumber: string;
  publicKey: string;
  walletAddress: string;
  privateKey: string; // Only returned once for user to save
}

export interface OnboardingResult {
  success: boolean;
  data?: OnboardingData;
  error?: string;
}

// Check if user has completed onboarding
export const checkOnboardingStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking onboarding status for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('account_number, public_key')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking onboarding status:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return false;
    }

    // User has completed onboarding if they have both account_number and public_key
    const isOnboarded = !!(data?.account_number && data?.public_key);
    console.log('Onboarding status check result:', { isOnboarded, data });
    return isOnboarded;
  } catch (error) {
    console.error('Exception checking onboarding status:', error);
    return false;
  }
};

// Complete user onboarding
export const completeOnboarding = async (userId: string): Promise<OnboardingResult> => {
  try {
    console.log('Starting onboarding for user:', userId);

    // Check if user already has onboarding data
    const isOnboarded = await checkOnboardingStatus(userId);
    if (isOnboarded) {
      return {
        success: false,
        error: 'User has already completed onboarding'
      };
    }

    // Generate unique account number
    let accountNumber: string = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      accountNumber = generateAccountNumber();
      console.log(`Generated account number (attempt ${attempts + 1}):`, accountNumber);
      
      // Check if account number already exists
      const { data: existingAccount, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('account_number', accountNumber)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking account number uniqueness:', checkError);
        attempts++;
        continue;
      }

      if (!existingAccount) {
        isUnique = true;
        console.log('Account number is unique:', accountNumber);
      } else {
        console.log('Account number already exists, retrying...');
        attempts++;
      }
    }

    if (!isUnique) {
      return {
        success: false,
        error: 'Failed to generate unique account number after multiple attempts'
      };
    }

    // Generate cryptographic key pair
    console.log('Generating cryptographic key pair...');
    const keyPair = generateKeyPair();
    console.log('Key pair generated successfully');
    
    // Hash the private key for secure storage
    const privateKeyHash = hashPrivateKey(keyPair.privateKey);
    console.log('Private key hashed for storage');

    // Update user profile with onboarding data
    console.log('Updating profile with onboarding data...');
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        account_number: accountNumber,
        public_key: keyPair.publicKey,
        wallet_address: keyPair.address,
        private_key_hash: privateKeyHash,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile with onboarding data:', updateError);
      console.error('Update error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint
      });
      return {
        success: false,
        error: 'Failed to save onboarding data to database'
      };
    }

    console.log('Onboarding completed successfully for user:', userId);
    console.log('Updated profile:', updatedProfile);

    // Return the onboarding data (private key only returned once)
    return {
      success: true,
      data: {
        accountNumber,
        publicKey: keyPair.publicKey,
        walletAddress: keyPair.address,
        privateKey: keyPair.privateKey // Only returned once - user must save this
      }
    };

  } catch (error) {
    console.error('Exception during onboarding:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during onboarding'
    };
  }
};

// Get user's onboarding data (without private key)
export const getOnboardingData = async (userId: string) => {
  try {
    console.log('Fetching onboarding data for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('account_number, public_key, wallet_address, onboarding_completed, onboarding_completed_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching onboarding data:', error);
      console.error('Fetch error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    console.log('Onboarding data fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception fetching onboarding data:', error);
    return null;
  }
};

// Regenerate onboarding data (for testing or recovery)
export const regenerateOnboarding = async (userId: string): Promise<OnboardingResult> => {
  try {
    console.log('Regenerating onboarding for user:', userId);

    // Generate new account number and keys
    const accountNumber: string = generateAccountNumber();
    console.log('Generated new account number:', accountNumber);
    
    const keyPair = generateKeyPair();
    console.log('Generated new key pair');
    
    const privateKeyHash = hashPrivateKey(keyPair.privateKey);
    console.log('Hashed new private key');

    // Update user profile with new onboarding data
    console.log('Updating profile with new onboarding data...');
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        account_number: accountNumber,
        public_key: keyPair.publicKey,
        wallet_address: keyPair.address,
        private_key_hash: privateKeyHash,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile with new onboarding data:', updateError);
      console.error('Regenerate update error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint
      });
      return {
        success: false,
        error: 'Failed to save new onboarding data to database'
      };
    }

    console.log('Onboarding regenerated successfully for user:', userId);
    console.log('Updated profile:', updatedProfile);

    return {
      success: true,
      data: {
        accountNumber,
        publicKey: keyPair.publicKey,
        walletAddress: keyPair.address,
        privateKey: keyPair.privateKey
      }
    };

  } catch (error) {
    console.error('Exception during onboarding regeneration:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during onboarding regeneration'
    };
  }
}; 