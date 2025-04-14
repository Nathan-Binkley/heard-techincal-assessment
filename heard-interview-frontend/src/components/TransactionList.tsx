import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { transactionService } from '@/services/transactionService';
import { accountService } from '@/services/accountService';
import { toast } from 'react-hot-toast';
import EditTransactionDialog from './EditTransactionDialog';
import EditAccountDialog from './EditAccountDialog';
import { Account } from '@/types/account';

export default function TransactionList() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await transactionService.getAllTransactions();
            if (data.length > 0) {
                setTransactions(data);
                setError(null);
            } else {
                setError('No transactions found');
            }
        } catch (err) {
            setError('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (title: string) => {
        try {
            await transactionService.deleteTransaction(title);
            setTransactions(transactions.filter(t => t.title !== title));
        } catch (err) {
            setError('Failed to delete transaction');
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
    };

    const handleSave = async (updatedTransaction: Transaction) => {
        try {
            await transactionService.updateTransaction(updatedTransaction.title, updatedTransaction);
            setTransactions(transactions.map(t => t.title === updatedTransaction.title ? updatedTransaction : t));
            toast.success('Transaction updated successfully');
        } catch (err) {
            toast.error('Failed to update transaction');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 text-center justify-center">{error}</div>;

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                <h2 className="text-2xl font-bold text-center justify-center">Transactions</h2>
                {transactions.map((transaction) => (
                    <div key={transaction.title} className="p-4 border rounded-lg shadow-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold">{transaction.title}</h3>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleEdit(transaction)}
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(transaction.title)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600">{transaction.description}</p>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    From: {transaction.fromAccount}
                                </span>
                                <span className="text-gray-500">
                                    To: {transaction.toAccount}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">{transaction.transactionDate}</span>
                                <span className="font-bold">${(transaction.amount / 100).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {editingTransaction && (
                <EditTransactionDialog
                    transaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
} 