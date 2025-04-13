import { Account } from '@/types/account';

const API_URL = 'http://localhost:8080/api/accounts';

export const accountService = {
    async getAllAccounts() {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch accounts');
        }
        return response.json();
    },

    async getAccount(accountName: string): Promise<Account> {
        console.log("Getting account", accountName);
        const response = await fetch(`${API_URL}/${accountName}`);
        if (!response.ok) {
            throw new Error('Account not found');
        }
        return response.json();
    },

    async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(account),
        });
        return response.json();
    },
}; 