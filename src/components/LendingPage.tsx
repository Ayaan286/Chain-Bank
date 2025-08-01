import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Loan {
  id: string;
  amount: number;
  currency: string;
  interest_rate: number;
  duration_days: number;
  status: 'open' | 'funded' | 'repaid';
  borrower_id: string;
  lender_id?: string;
  created_at: string;
}

const LendingPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [myLoans, setMyLoans] = useState<Loan[]>([]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [interestRate, setInterestRate] = useState('10');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID from Supabase auth
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Fetch all open loans
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setLoans(data);
        if (userId) {
          setMyLoans(data.filter((loan: Loan) => loan.borrower_id === userId || loan.lender_id === userId));
        }
      }
      setLoading(false);
    };
    if (userId) fetchLoans();
  }, [userId]);

  // Request a new loan
  const handleRequestLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase.from('loans').insert([
      {
        amount: parseFloat(amount),
        currency,
        interest_rate: parseFloat(interestRate),
        duration_days: parseInt(duration),
        status: 'open',
        borrower_id: userId,
      },
    ]);
    setLoading(false);
    if (!error) {
      setAmount('');
      setInterestRate('10');
      setDuration('30');
      // Refresh loans
      const { data } = await supabase.from('loans').select('*').order('created_at', { ascending: false });
      setLoans(data || []);
    }
  };

  // Fund a loan
  const handleFundLoan = async (loanId: string) => {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase
      .from('loans')
      .update({ status: 'funded', lender_id: userId })
      .eq('id', loanId);
    setLoading(false);
    if (!error) {
      // Refresh loans
      const { data } = await supabase.from('loans').select('*').order('created_at', { ascending: false });
      setLoans(data || []);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Blockchain Lending Marketplace</h1>
      {/* Loan Request Form */}
      <form onSubmit={handleRequestLoan} className="bg-white shadow rounded p-4 mb-8">
        <h2 className="text-lg font-semibold mb-2">Request a Loan</h2>
        <div className="flex flex-wrap gap-4 mb-2">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="border p-2 rounded w-32"
            required
          />
          <select value={currency} onChange={e => setCurrency(e.target.value)} className="border p-2 rounded w-32">
            <option value="INR">INR</option>
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
          <input
            type="number"
            placeholder="Interest %"
            value={interestRate}
            onChange={e => setInterestRate(e.target.value)}
            className="border p-2 rounded w-32"
            required
          />
          <input
            type="number"
            placeholder="Duration (days)"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            className="border p-2 rounded w-40"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Requesting...' : 'Request Loan'}
          </button>
        </div>
      </form>

      {/* Loan Marketplace */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Open Loan Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2">Amount</th>
                <th className="p-2">Currency</th>
                <th className="p-2">Interest %</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.filter(l => l.status === 'open').map(loan => (
                <tr key={loan.id}>
                  <td className="p-2">{loan.amount}</td>
                  <td className="p-2">{loan.currency}</td>
                  <td className="p-2">{loan.interest_rate}</td>
                  <td className="p-2">{loan.duration_days} days</td>
                  <td className="p-2 capitalize">{loan.status}</td>
                  <td className="p-2">
                    {loan.borrower_id !== userId && (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => handleFundLoan(loan.id)}
                        disabled={loading}
                      >
                        Fund Loan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {loans.filter(l => l.status === 'open').length === 0 && (
                <tr><td colSpan={6} className="p-2 text-center">No open loan requests.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Loans */}
      <div>
        <h2 className="text-lg font-semibold mb-2">My Loans</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2">Role</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Currency</th>
                <th className="p-2">Interest %</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {myLoans.map(loan => (
                <tr key={loan.id}>
                  <td className="p-2">{loan.borrower_id === userId ? 'Borrower' : 'Lender'}</td>
                  <td className="p-2">{loan.amount}</td>
                  <td className="p-2">{loan.currency}</td>
                  <td className="p-2">{loan.interest_rate}</td>
                  <td className="p-2">{loan.duration_days} days</td>
                  <td className="p-2 capitalize">{loan.status}</td>
                </tr>
              ))}
              {myLoans.length === 0 && (
                <tr><td colSpan={6} className="p-2 text-center">No loans yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LendingPage; 