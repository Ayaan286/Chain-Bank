import { ethers } from 'ethers';

// Generate a unique 12-digit account number
export const generateAccountNumber = (): string => {
  // Generate a random 12-digit number
  const min = 100000000000; // 12 digits starting with 1
  const max = 999999999999; // 12 digits ending with 9
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

// Generate Ethereum-compatible key pair
export const generateKeyPair = () => {
  try {
    // Generate a new wallet using ethers.js
    const wallet = ethers.Wallet.createRandom();
    
    return {
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      address: wallet.address
    };
  } catch (error) {
    console.error('Error generating key pair:', error);
    throw new Error('Failed to generate cryptographic keys');
  }
};

// Validate account number format
export const validateAccountNumber = (accountNumber: string): boolean => {
  return /^\d{12}$/.test(accountNumber);
};

// Validate Ethereum address format
export const validateEthereumAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// Hash private key for secure storage (one-way hash)
export const hashPrivateKey = (privateKey: string): string => {
  return ethers.keccak256(ethers.toUtf8Bytes(privateKey));
};

// Encrypt private key with a passphrase (for temporary storage)
export const encryptPrivateKey = (privateKey: string, passphrase: string): string => {
  try {
    // Create a simple encryption using ethers
    const wallet = new ethers.Wallet(privateKey);
    const encrypted = wallet.encrypt(passphrase);
    return encrypted;
  } catch (error) {
    console.error('Error encrypting private key:', error);
    throw new Error('Failed to encrypt private key');
  }
};

// Decrypt private key with passphrase
export const decryptPrivateKey = (encryptedPrivateKey: string, passphrase: string): string => {
  try {
    const wallet = ethers.Wallet.fromEncryptedJsonSync(encryptedPrivateKey, passphrase);
    return wallet.privateKey;
  } catch (error) {
    console.error('Error decrypting private key:', error);
    throw new Error('Failed to decrypt private key');
  }
}; 