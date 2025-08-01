import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Wallet, 
  ArrowRight, 
  Globe, 
  Zap, 
  Lock, 
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Star,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Banknote,
  CreditCard,
  PiggyBank,
  FileCheck
} from 'lucide-react';
import WalletPage from './components/WalletPage';
import TransferPage from './components/TransferPage';
import LendingPage from './components/LendingPage';
import SettingsPage from './components/SettingsPage';
import DecentralizedKYC from './components/DecentralizedKYC';
import RegisterModal from './components/RegisterModal';
import SignInModal from './components/SignInModal';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [transactionVolume, setTransactionVolume] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const location = useLocation();

  // Animated counters
  useEffect(() => {
    const animateCounter = (setter: React.Dispatch<React.SetStateAction<number>>, target: number, duration: number) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    animateCounter(setActiveUsers, 100000, 2000);
    animateCounter(setTransactionVolume, 50, 2000);
    animateCounter(setUptime, 99.9, 2000);
  }, []);

  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Multi-Currency Wallet",
      description: "Securely manage INR, cryptocurrencies, and stablecoins in one unified platform with military-grade encryption.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cross-Border Payments",
      description: "Execute instant international transfers with minimal fees using our revolutionary blockchain infrastructure.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Decentralized KYC",
      description: "One-time identity verification that's shareable across multiple financial institutions while maintaining privacy.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <PiggyBank className="w-8 h-8" />,
      title: "Smart Savings",
      description: "Automated investments in tokenized assets with AI-powered portfolio optimization and DeFi yield farming.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Fintech Entrepreneur",
      content: "ChainBank has revolutionized how I manage international transactions. The speed and security are unmatched.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Investment Manager",
      content: "The smart savings feature has consistently outperformed traditional banking products. Truly innovative.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Tech Executive",
      content: "Finally, a banking platform that understands the future of finance. The UX is incredibly intuitive.",
      rating: 5
    }
  ];

  // Check if we're on a page route (not homepage)
  const isPageRoute = location.pathname !== '/';

  // If we're on a page route, render the specific component
  if (isPageRoute) {
    return (
      <>
        {/* Navigation for pages */}
        <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">ChainBank</span>
                </Link>
              </div>
              
              <div className="hidden md:block">
                <div className="flex items-center space-x-8">
                  <Link to="/wallet" className="text-slate-300 hover:text-white transition-colors duration-200">Wallet</Link>
                  <Link to="/transfer" className="text-slate-300 hover:text-white transition-colors duration-200">Transfer</Link>
                  <Link to="/lending" className="text-slate-300 hover:text-white transition-colors duration-200">Lending</Link>
                  <Link to="/settings" className="text-slate-300 hover:text-white transition-colors duration-200">Settings</Link>
                  <div className="relative group">
                    <button className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-1">
                      <span>Services</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link to="/kyc" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-t-lg">KYC Verification</Link>
                      <a href="#" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700">API Access</a>
                      <a href="#" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-b-lg">Developer Tools</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={() => setIsSignInModalOpen(true)}
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-slate-300 hover:text-white"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-slate-800 border-t border-slate-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/wallet" className="block px-3 py-2 text-slate-300 hover:text-white">Wallet</Link>
                <Link to="/transfer" className="block px-3 py-2 text-slate-300 hover:text-white">Transfer</Link>
                <Link to="/lending" className="block px-3 py-2 text-slate-300 hover:text-white">Lending</Link>
                <Link to="/settings" className="block px-3 py-2 text-slate-300 hover:text-white">Settings</Link>
                <Link to="/kyc" className="block px-3 py-2 text-slate-300 hover:text-white">KYC</Link>
                <button 
                  onClick={() => setIsSignInModalOpen(true)}
                  className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Page Content */}
        <div className="bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/lending" element={<LendingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/kyc" element={<DecentralizedKYC />} />
          </Routes>
        </div>

        {/* Authentication Modals */}
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
        />
        <SignInModal
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
        />
      </>
    );
  }

  // Homepage content
  return (
    <>
      {/* Navigation for homepage */}
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ChainBank</span>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link to="/wallet" className="text-slate-300 hover:text-white transition-colors duration-200">Wallet</Link>
                <Link to="/transfer" className="text-slate-300 hover:text-white transition-colors duration-200">Transfer</Link>
                <Link to="/lending" className="text-slate-300 hover:text-white transition-colors duration-200">Lending</Link>
                <Link to="/settings" className="text-slate-300 hover:text-white transition-colors duration-200">Settings</Link>
                <div className="relative group">
                  <button className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-1">
                    <span>Services</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/kyc" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-t-lg">KYC Verification</Link>
                    <a href="#" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700">API Access</a>
                    <a href="#" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-b-lg">Developer Tools</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setIsSignInModalOpen(true)}
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsRegisterModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/wallet" className="block px-3 py-2 text-slate-300 hover:text-white">Wallet</Link>
              <Link to="/transfer" className="block px-3 py-2 text-slate-300 hover:text-white">Transfer</Link>
              <Link to="/lending" className="block px-3 py-2 text-slate-300 hover:text-white">Lending</Link>
              <Link to="/settings" className="block px-3 py-2 text-slate-300 hover:text-white">Settings</Link>
              <Link to="/kyc" className="block px-3 py-2 text-slate-300 hover:text-white">KYC</Link>
              <button 
                onClick={() => setIsSignInModalOpen(true)}
                className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white"
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsRegisterModalOpen(true)}
                className="block w-full text-left px-3 py-2 text-slate-300 hover:text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Routes for homepage */}
      <Routes>
        <Route path="/" element={
          <>
            {/* Hero Section */}
            <section className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 mb-8">
                    <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-sm text-slate-300">Powered by Advanced Blockchain Technology</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                    Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ChainBank</span>
                  </h1>
                  
                  <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Experience the future of banking with our revolutionary blockchain-powered platform. 
                    Secure, transparent, and efficient financial services designed for the digital economy.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <button 
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-semibold flex items-center space-x-2"
                    >
                      <span>Start Banking</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="border border-slate-600 text-slate-300 px-8 py-4 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300 font-semibold flex items-center space-x-2">
                      <span>Watch Demo</span>
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-slate-800/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {activeUsers.toLocaleString()}+
                    </div>
                    <div className="text-slate-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      ${transactionVolume}M+
                    </div>
                    <div className="text-slate-400">Transaction Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-4">
                      <Clock className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {uptime}%
                    </div>
                    <div className="text-slate-400">Uptime</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Advanced Financial Services
                  </h2>
                  <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Discover powerful features designed to transform your financial experience
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="group relative">
                      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="py-24 bg-slate-800/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-6">
                      Bank-Grade Security, Blockchain-Powered
                    </h2>
                    <p className="text-xl text-slate-400 mb-8">
                      Your assets are protected by military-grade encryption, multi-signature protocols, and distributed ledger technology.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <span className="text-slate-300">256-bit AES encryption</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <span className="text-slate-300">Multi-signature wallet technology</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <span className="text-slate-300">Decentralized identity verification</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <span className="text-slate-300">Real-time fraud detection</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl p-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                          <div className="text-2xl font-bold text-white">100%</div>
                          <div className="text-slate-400 text-sm">Secure Transactions</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                          <Lock className="w-12 h-12 text-green-400 mx-auto mb-3" />
                          <div className="text-2xl font-bold text-white">24/7</div>
                          <div className="text-slate-400 text-sm">Security Monitoring</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                          <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                          <div className="text-2xl font-bold text-white">0</div>
                          <div className="text-slate-400 text-sm">Security Breaches</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                          <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                          <div className="text-2xl font-bold text-white">3s</div>
                          <div className="text-slate-400 text-sm">Average Response</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Trusted by Industry Leaders
                  </h2>
                  <p className="text-xl text-slate-400">
                    See what our customers are saying about ChainBank
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-slate-400 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
              <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Financial Future?
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                  Join thousands of users who have already discovered the power of blockchain banking.
                </p>
                <button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-semibold text-lg"
                >
                  Start Your Journey Today
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-white">ChainBank</span>
                    </div>
                    <p className="text-slate-400 mb-6">
                      The future of banking, powered by blockchain technology.
                    </p>
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                        <span className="text-white font-bold">f</span>
                      </div>
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                        <span className="text-white font-bold">t</span>
                      </div>
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                        <span className="text-white font-bold">in</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-4">Products</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li><Link to="/wallet" className="hover:text-white transition-colors">Digital Wallet</Link></li>
                      <li><Link to="/transfer" className="hover:text-white transition-colors">Cross-Border Payments</Link></li>
                      <li><a href="#" className="hover:text-white transition-colors">Smart Savings</a></li>
                      <li><Link to="/lending" className="hover:text-white transition-colors">Lending Platform</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold mb-4">Support</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                      <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 mt-12 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-400">© 2025 ChainBank. All rights reserved.</p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </>
        } />
      </Routes>

      {/* Authentication Modals */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
}

export default App;