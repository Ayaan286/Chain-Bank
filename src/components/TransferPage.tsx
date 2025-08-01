import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Copy } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface Currency {
  code: string;
  name: string;
  balance: number;
  symbol: string;
}

interface LocationState {
  selectedWallet?: string;
}

const TransferPage = () => {
  const location = useLocation();
  const { selectedWallet } = (location.state as LocationState) || {};
  
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>(selectedWallet || 'USD');
  const [toCurrency, setToCurrency] = useState<string>('ETH');
  const [isLoading, setIsLoading] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', balance: 5000.00, symbol: '$' },
    { code: 'EUR', name: 'Euro', balance: 4200.00, symbol: '€' },
    { code: 'GBP', name: 'British Pound', balance: 3500.00, symbol: '£' },
    { code: 'ETH', name: 'Ethereum', balance: 2.5, symbol: 'Ξ' },
    { code: 'BTC', name: 'Bitcoin', balance: 0.15, symbol: '₿' },
    { code: 'USDT', name: 'Tether', balance: 10000.00, symbol: '₮' }
  ];

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate transfer delay and store in transaction history
    const transaction = {
      from: fromCurrency,
      to: toCurrency,
      amount: parseFloat(amount),
      receiverAddress,
      accountNumber,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    // Here you would typically store the transaction in your database
    console.log('Transaction:', transaction);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setAmount('');
    setReceiverAddress('');
    setAccountNumber('');
  };

  const getExchangeRate = (from: string, to: string) => {
    const rates: Record<string, number> = {
      'USD-ETH': 0.00045,
      'USD-BTC': 0.000023,
      'ETH-BTC': 0.051,
      'EUR-USD': 1.1,
      'GBP-USD': 1.27,
      'USDT-USD': 1
    };
    return rates[`${from}-${to}`] || 1;
  };

  const selectedFromCurrency = currencies.find(c => c.code === fromCurrency);
  const selectedToCurrency = currencies.find(c => c.code === toCurrency);

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 gradient-text text-center">
        Currency Transfer
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleTransfer} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* From Currency */}
            <div className="bg-gray-50 p-6 rounded-xl transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-lg font-semibold mb-4">From</h2>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-600">
                Available Balance: {selectedFromCurrency?.symbol}{selectedFromCurrency?.balance.toFixed(2)}
              </div>
            </div>

            {/* To Currency */}
            <div className="bg-gray-50 p-6 rounded-xl transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-lg font-semibold mb-4">To</h2>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-600">
                Current Balance: {selectedToCurrency?.symbol}{selectedToCurrency?.balance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Receiver Details */}
          <div className="bg-gray-50 p-6 rounded-xl transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4">Receiver Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Public Key / Wallet Address</label>
                <div className="relative">
                  <input
                    type="text"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    placeholder="Enter receiver's public key or wallet address"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(receiverAddress)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-gray-50 p-6 rounded-xl transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4">Amount</h2>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="mt-2 text-sm text-gray-600">
                Exchange Rate: 1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency)} {toCurrency}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2 transform hover:scale-[1.02] transition-all duration-300"
          >
            {isLoading ? (
              <RefreshCw className="animate-spin h-5 w-5" />
            ) : (
              <>
                <span>Transfer Now</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferPage;