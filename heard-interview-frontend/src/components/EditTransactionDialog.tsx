'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { accountService } from '@/services/accountService';
import { Account } from '@/types/account';
import { toast } from 'react-hot-toast';

interface EditTransactionDialogProps {
    transaction: Transaction;
    onClose: () => void;
    onSave: (updatedTransaction: Transaction) => void;
}

export default function EditTransactionDialog({ transaction, onClose, onSave }: EditTransactionDialogProps) {
    const [formData, setFormData] = useState<Transaction>(transaction);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await accountService.getAllAccounts();
                setAccounts(data);
                setLoading(false);
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
            onSave(formData);
            onClose();
        } catch (err) {
            toast.error('Failed to update transaction');
        }
    };

    if (loading) return <div>Loading accounts...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            value={formData.amount / 100}
                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 