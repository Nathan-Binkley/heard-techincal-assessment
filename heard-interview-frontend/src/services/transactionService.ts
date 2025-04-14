import { Transaction } from '@/types/transaction';

const API_URL = 'http://localhost:8080/api/transactions';

export const transactionService = {
    async getAllTransactions(): Promise<Transaction[]> {
        const response = await fetch(API_URL);
        return response.json();
    },

    async getTransaction(id: number): Promise<Transaction> {
        const response = await fetch(`${API_URL}/${id}`);
        return response.json();
    },

    async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Response> {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });
        if (!response.ok) {
            throw new Error('Failed to create transaction');
        }
        return response;
    },

    async updateTransaction(title: string, transaction: Partial<Transaction>): Promise<Transaction> {
        const response = await fetch(`${API_URL}/${title}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });
        if (!response.ok) {
            throw new Error('Failed to update transaction');
        }
        return response.json();
    },

    async deleteTransaction(title: string): Promise<void> {
        await fetch(`${API_URL}/${title}`, {
            method: 'DELETE',
        });
    },
}; 