# User Onboarding Feature Documentation

## Overview

The user onboarding feature provides a secure way to generate unique account numbers and cryptographic keys for users upon successful registration. This feature is integrated into the Settings page and ensures users have the necessary credentials for secure transactions.

## Features

### 1. Account Number Generation
- **12-digit unique account number** generated for each user
- Ensures uniqueness across all users
- Used as a human-readable identifier for the account

### 2. Cryptographic Key Generation
- **Ethereum-compatible key pair** using secp256k1 elliptic curve
- **Public key** stored in database for verification
- **Private key** provided to user once (never stored on server)
- **Wallet address** derived from public key for blockchain interactions

### 3. Security Features
- **Private key hashing** for secure storage verification
- **One-time display** of private key to user
- **Download functionality** for private key backup
- **Confirmation step** to ensure user has saved their private key

## Implementation Details

### Backend Components

#### 1. Crypto Utilities (`src/lib/crypto.ts`)
```typescript
// Generate unique 12-digit account number
export const generateAccountNumber = (): string

// Generate Ethereum-compatible key pair
export const generateKeyPair = () => {
  return {
    publicKey: string,
    privateKey: string,
    address: string
  }
}

// Hash private key for secure storage
export const hashPrivateKey = (privateKey: string): string
```

#### 2. Onboarding Service (`src/lib/onboarding.ts`)
```typescript
// Check if user has completed onboarding
export const checkOnboardingStatus = async (userId: string): Promise<boolean>

// Complete user onboarding
export const completeOnboarding = async (userId: string): Promise<OnboardingResult>

// Get user's onboarding data (without private key)
export const getOnboardingData = async (userId: string)
```

### Frontend Components

#### 1. OnboardingModal (`src/components/OnboardingModal.tsx`)
- Multi-step onboarding process
- Secure display of private key
- Copy and download functionality
- Confirmation step for private key saving

#### 2. SettingsPage Integration
- Shows onboarding status
- Displays account and wallet information
- Provides button to complete onboarding if pending

### Database Schema

#### New Columns in `profiles` table:
```sql
account_number text,                    -- Unique 12-digit account number
public_key text,                        -- Ethereum-compatible public key
wallet_address text,                    -- Derived wallet address
private_key_hash text,                  -- Hashed private key for verification
onboarding_completed boolean DEFAULT false,  -- Onboarding completion flag
onboarding_completed_at timestamp with time zone  -- Completion timestamp
```

#### Indexes:
```sql
-- Unique index on account_number
CREATE UNIQUE INDEX profiles_account_number_idx ON public.profiles(account_number);

-- Indexes for faster lookups
CREATE INDEX profiles_wallet_address_idx ON public.profiles(wallet_address);
CREATE INDEX profiles_public_key_idx ON public.profiles(public_key);
```

## Security Considerations

### 1. Private Key Security
- **Never stored** on the server in plain text
- **One-time display** to user during onboarding
- **Hashed version** stored for verification purposes only
- **Download option** for secure backup

### 2. Account Number Uniqueness
- **Unique constraint** in database
- **Retry mechanism** if collision occurs
- **Maximum attempts** to prevent infinite loops

### 3. Cryptographic Standards
- **Ethereum-compatible** using secp256k1 curve
- **Industry-standard** key generation
- **Secure random** number generation

## User Experience Flow

### 1. Initial Setup
1. User signs up and verifies email
2. User navigates to Settings page
3. System detects incomplete onboarding
4. Yellow banner prompts user to complete setup

### 2. Onboarding Process
1. **Welcome Step**: Explains what will be generated
2. **Generating Step**: Shows loading animation
3. **Display Step**: Shows all generated data
   - Account number (copyable)
   - Public key (copyable)
   - Wallet address (copyable)
   - Private key (copyable, downloadable, with warnings)
4. **Confirm Step**: User confirms they saved private key
5. **Complete Step**: Success message and continue

### 3. Post-Onboarding
- Settings page shows all account information
- User can view but not regenerate keys
- Account is fully functional for transactions

## API Endpoints

### Onboarding Status Check
```typescript
// Check if user has completed onboarding
const isOnboarded = await checkOnboardingStatus(userId);
```

### Complete Onboarding
```typescript
// Generate and store onboarding data
const result = await completeOnboarding(userId);
if (result.success) {
  const { accountNumber, publicKey, walletAddress, privateKey } = result.data;
  // Display to user (private key only once)
}
```

### Get Onboarding Data
```typescript
// Retrieve stored onboarding data (no private key)
const data = await getOnboardingData(userId);
// Returns: account_number, public_key, wallet_address, onboarding_completed, onboarding_completed_at
```

## Error Handling

### Common Error Scenarios
1. **Account number collision**: Retry with new number
2. **Database connection issues**: Graceful fallback
3. **Key generation failure**: Clear error message
4. **User already onboarded**: Prevent duplicate generation

### Error Messages
- "Failed to generate unique account number after multiple attempts"
- "Failed to save onboarding data to database"
- "User has already completed onboarding"
- "An unexpected error occurred during onboarding"

## Testing

### Manual Testing Steps
1. Create new user account
2. Verify email
3. Navigate to Settings page
4. Click "Complete Setup" button
5. Follow onboarding flow
6. Verify data is displayed correctly
7. Test copy and download functionality
8. Confirm completion

### Automated Testing (Future)
- Unit tests for crypto functions
- Integration tests for onboarding flow
- Database constraint tests
- Security validation tests

## Deployment Notes

### Database Migration
1. Run the migration file: `20250407080000_add_onboarding_columns.sql`
2. Verify indexes are created
3. Test RLS policies
4. Verify trigger function works

### Environment Requirements
- `ethers` package installed
- Supabase connection configured
- Proper RLS policies in place

## Future Enhancements

### Potential Improvements
1. **Hardware wallet integration** for enhanced security
2. **Multi-signature support** for business accounts
3. **Key recovery mechanisms** for lost private keys
4. **Audit logging** for onboarding events
5. **Rate limiting** for onboarding attempts

### Security Enhancements
1. **Hardware security modules** (HSM) integration
2. **Zero-knowledge proofs** for key verification
3. **Threshold cryptography** for key sharing
4. **Time-locked encryption** for private key backup

## Troubleshooting

### Common Issues
1. **Migration fails**: Check if columns already exist
2. **Key generation fails**: Verify ethers package installation
3. **Database errors**: Check RLS policies and permissions
4. **UI not updating**: Verify profile refresh after onboarding

### Debug Information
- Check browser console for detailed logs
- Verify Supabase connection
- Check database constraints and indexes
- Validate user permissions

## Support

For issues or questions about the onboarding feature:
1. Check browser console for error messages
2. Verify database migration was applied
3. Test with a fresh user account
4. Review security logs if available 