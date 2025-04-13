'use client';

import { useState } from 'react';
import { Account } from '@/types/account';
import { toast } from 'react-hot-toast';

interface EditAccountDialogProps {
    account: Account;
    onClose: () => void;
    onSave: (updatedAccount: Account) => void;
}

export default function EditAccountDialog({ account, onClose, onSave }: EditAccountDialogProps) {
    const [formData, setFormData] = useState<Account>(account);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            onSave(formData);
            onClose();
        } catch (err) {
            toast.error('Failed to update account');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Account Name</label>
                        <input
                            type="text"
                            value={formData.account_name}
                            onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
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