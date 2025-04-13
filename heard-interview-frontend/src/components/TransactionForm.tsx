'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { transactionService } from '@/services/transactionService';
import { accountService } from '@/services/accountService';
import { Account } from '@/types/account';
import { toast } from 'react-hot-toast';

interface TransactionFormProps {
    onTransactionAdded: () => void;
}

export default function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
    const [formData, setFormData] = useState<Transaction>({
        title: '',
        description: '',
        amount: 0,
        fromAccount: '',
        toAccount: '',
        transactionDate: new Date().toISOString().split('T')[0],
    });

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await accountService.getAllAccounts();
                setAccounts(data);
                setLoading(false);
                if (data.length === 0) {
                    toast.error('No accounts found', {
                        duration: 3000,
                        position: 'bottom-right',
                    });
                }
            } catch (err) {
                setError('Failed to load accounts');
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await transactionService.createTransaction(formData);
            toast.success('Transaction created successfully!', {
                duration: 3000,
                position: 'bottom-right',
            });
            onTransactionAdded();
            setFormData({
                title: '',
                description: '',
                amount: 0,
                fromAccount: '',
                toAccount: '',
                transactionDate: new Date().toISOString().split('T')[0],
            });
        } catch (error) {
            console.error('Failed to create transaction:', error);
            toast.error('Failed to create transaction', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    };

    if (loading) {
        return <div>Loading accounts...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-bold">Add New Transaction</h2>
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">From Account</label>
                    <select
                        value={formData.fromAccount}
                        onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border"
                        required
                    >
                        <option value="">Select an account</option>
                        {accounts.map((account) => (
                            <option key={account.account_name} value={account.account_name}>
                                {account.account_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">To Account</label>
                    <select
                        value={formData.toAccount}
                        onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border"
                        required
                    >
                        <option value="">Select an account</option>
                        {accounts.map((account) => (
                            <option key={account.account_name} value={account.account_name}>
                                {account.account_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                    <input
                        type="date"
                        value={formData.transactionDate}
                        onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Add Transaction
                </button>
            </div>
        </form>
    );
} 