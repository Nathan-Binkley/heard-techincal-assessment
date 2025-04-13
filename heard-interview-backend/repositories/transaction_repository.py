import sqlite3
from typing import List, Optional
from datetime import datetime

class TransactionRepository:
    def __init__(self, db_path: str = 'transactions.db'):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS transactions (
                    title TEXT PRIMARY KEY,
                    description TEXT NOT NULL,
                    amount INTEGER NOT NULL,
                    fromAccount TEXT NOT NULL,
                    toAccount TEXT NOT NULL,
                    transactionDate INTEGER NOT NULL
                )
            ''')
            conn.commit()

    def reset_transactions(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM transactions')
            conn.commit()

    '''
        Get all transactions
        @return: List[dict] - A list of all transactions
    '''
    def get_all_transactions(self) -> List[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM transactions')
            return [dict(row) for row in cursor.fetchall()]

    '''
        Get a transaction by title
        @param title: str - The title of the transaction
        @return: Optional[dict] - The transaction if found, otherwise None
    '''
    def get_transaction(self, title: str) -> Optional[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM transactions WHERE title = ?', (title,))
            row = cursor.fetchone()
            return dict(row) if row else None

    '''
        Create a new transaction
        @param transaction: dict - The transaction to create
        @return: dict - The created transaction
    '''
    def create_transaction(self, transaction: dict) -> dict:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO transactions (title, description, amount, fromAccount, toAccount, transactionDate)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                transaction['title'],
                transaction['description'],
                int(transaction['amount'] * 100), #cast to int to avoid weird math
                transaction['fromAccount'],
                transaction['toAccount'],
                transaction['transactionDate']
            ))
            conn.commit()
            return transaction

    '''
        Update a transaction
        @param title: str - The title of the transaction
        @param transaction: dict - The transaction to update
        @return: Optional[dict] - The updated transaction if found, otherwise None
    '''
    def update_transaction(self, title: str, transaction: dict) -> Optional[dict]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE transactions
                SET description = ?, amount = ?, fromAccount = ?, toAccount = ?, transactionDate = ?
                WHERE title = ?
            ''', (
                transaction['description'],
                int(transaction['amount']*100), # cast to int to avoid weird math with floating 1000th decimal
                transaction['fromAccount'],
                transaction['toAccount'],
                transaction['transactionDate'],
                title  # Don't want to update this because it's our ID
            ))
            conn.commit()
            if cursor.rowcount > 0:
                return transaction
            return None

    '''
        Delete a transaction
        @param title: str - The title of the transaction
        @return: bool - True if the transaction was deleted, otherwise False
    '''
    def delete_transaction(self, title: str) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM transactions WHERE title = ?', (title,))
            conn.commit()
            return cursor.rowcount > 0 