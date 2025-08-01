import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Ban as Bank, ArrowRightLeft, PiggyBank, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-xl">ChainBank</Link>
        <Link to="/wallet">Wallet</Link>
        <Link to="/transfer">Transfer</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/lending">Lending</Link>
        <Link to="/kyc">KYC</Link>
      </div>
    </nav>
  );
};

export default Navbar;