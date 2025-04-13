'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Account } from '@/types/account';
import { accountService } from '@/services/accountService';

interface AccountFormProps {
    onAccountAdded: () => void;
}

export default function AccountForm({ onAccountAdded }: AccountFormProps) {
    const [formData, setFormData] = useState<Account>({
        account_name: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await accountService.createAccount(formData);
            toast.success('Account created successfully!', {
                duration: 3000,
                position: 'bottom-right',
            });
            onAccountAdded();
            setFormData({
                account_name: '',
            });
        } catch (error) {
            console.error('Failed to create account:', error);
            toast.error('Failed to create account', {
                duration: 3000,
                position: 'bottom-right',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-xl font-bold">Add New Account</h2>
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Account Name</label>
                    <input
                        type="text"
                        value={formData.account_name}
                        onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Add Account
                </button>
            </div>
        </form>
    );
} 