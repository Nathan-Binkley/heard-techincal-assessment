import sqlite3
from typing import List, Optional
from datetime import datetime

class AccountRepository:
    def __init__(self, db_path: str = 'accounts.db'):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS accounts (
                    account_name TEXT PRIMARY KEY
                )
            ''')
            conn.commit()

    '''
        Get all accounts
        @return: List[dict] - A list of all accounts
    '''
    def get_all_accounts(self) -> List[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM accounts')
            return [dict(row) for row in cursor.fetchall()]

    '''
        Get a transaction by title
        @param account_name: str - The name of the account
        @return: Optional[dict] - The account if found, otherwise None
    '''
    def get_account(self, account_name: str) -> Optional[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM accounts WHERE account_name = ?', (account_name,))
            row = cursor.fetchone()
            return dict(row) if row else None

    '''
        Create a new account
        @param account: dict - The account to create
        @return: dict - The created account
    '''
    def create_account(self, account: dict) -> dict:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO accounts (account_name)
                VALUES (?)
            ''', (
                account['account_name'],
            ))
            conn.commit()
            return account

    '''
        Update an account
        @param account_name: str - The name of the account
        @param account: dict - The account to update
        @return: Optional[dict] - The updated account if found, otherwise None
    '''
    def update_account(self, account_name: str, account: dict) -> Optional[dict]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE accounts
                SET account_name = ?
                WHERE account_name = ?
            ''', (
                account['account_name'],
                account_name
            ))
            conn.commit()
            if cursor.rowcount > 0:
                return account
            return None

    '''
        Delete an account
        @param account_name: str - The name of the account
        @return: bool - True if the account was deleted, otherwise False
    '''
    def delete_account(self, account_name: str) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM accounts WHERE account_name = ?', (account_name,))
            conn.commit()
            return cursor.rowcount > 0 

    '''
        Get all transactions for a account
        @param account_name: str - The name of the account
        @return: List[dict] - The transactions for the account
    '''
    def get_account_transactions(self, account_name: str) -> List[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM transactions WHERE account_name = ?', (account_name,))
            return [dict(row) for row in cursor.fetchall()]

    '''
        Reset the accounts
        @return: bool - True if the accounts were reset, otherwise False
    '''
    def reset_accounts(self) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM accounts')