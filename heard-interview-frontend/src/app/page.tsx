'use client';

import { useState } from 'react';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import AccountForm from '@/components/AccountForm';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);

  const handleTransactionAdded = () => {
    setShowTransactionForm(false);
  };

  const handleAccountAdded = () => {
    setShowAccountForm(false);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transaction Management</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowAccountForm(!showAccountForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add New Account
          </button>
          <button
            onClick={() => setShowTransactionForm(!showTransactionForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add New Transaction
          </button>
        </div>
      </div>

      {showAccountForm && (
        <div className="mb-6">
          <AccountForm onAccountAdded={handleAccountAdded} />
        </div>
      )}

      {showTransactionForm && (
        <div className="mb-6">
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        </div>
      )}

      <TransactionList />
    </main>
  );
}
