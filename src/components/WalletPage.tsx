import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Bitcoin, DollarSign, Euro, PoundSterling, Coins } from 'lucide-react';

interface WalletType {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  image: string;
  currencies: string[];
}

const WalletPage = () => {
  const navigate = useNavigate();

  const walletTypes: WalletType[] = [
    {
      id: 'crypto',
      name: 'Crypto Wallet',
      description: 'Secure storage for your cryptocurrency assets with multi-chain support',
      icon: <Bitcoin className="h-8 w-8" />,
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80',
      currencies: ['BTC', 'ETH', 'USDT']
    },
    {
      id: 'fiat',
      name: 'Fiat Wallet',
      description: 'Traditional currency wallet with instant global transfers',
      icon: <DollarSign className="h-8 w-8" />,
      image: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&w=800&q=80',
      currencies: ['USD', 'EUR', 'GBP']
    },
    {
      id: 'stablecoin',
      name: 'Stablecoin Wallet',
      description: 'Stable digital currencies pegged to traditional assets',
      icon: <Coins className="h-8 w-8" />,
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80',
      currencies: ['USDT', 'USDC', 'DAI']
    },
    {
      id: 'multi',
      name: 'Multi-Currency Wallet',
      description: 'One wallet for all your digital and traditional assets',
      icon: <Wallet className="h-8 w-8" />,
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80',
      currencies: ['BTC', 'ETH', 'USD', 'EUR']
    }
  ];

  const handleWalletSelect = (currency: string) => {
    navigate('/transfer', { state: { selectedWallet: currency } });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4 gradient-text">Choose Your Wallet</h1>
      <p className="text-gray-600 text-center mb-12">Select a wallet type to start your transaction</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {walletTypes.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={wallet.image}
                alt={wallet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center space-x-2">
                  {wallet.icon}
                  <h3 className="text-xl font-bold">{wallet.name}</h3>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">{wallet.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Supported Currencies:</p>
                <div className="flex flex-wrap gap-2">
                  {wallet.currencies.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => handleWalletSelect(currency)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors duration-300"
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletPage;