from typing import List, Optional
from repositories.transaction_repository import TransactionRepository
from services.account_service import AccountService, AccountNotFoundError
from datetime import datetime

'''
    Custom exceptions for transaction service
'''

'''
    Base exception for transaction service
    @param message: str - The message to display
'''
class TransactionError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

'''
    Exception raised when a transaction already exists
    @param title: str - The title of the transaction
'''
class DuplicateTransactionError(TransactionError):
    def __init__(self, title: str):
        super().__init__(f"Transaction with title '{title}' already exists")

'''
    Exception raised when transaction data is invalid
    @param message: str - The message to display
'''
class InvalidTransactionError(TransactionError):
    def __init__(self, message: str):
        super().__init__(f"Invalid transaction data: {message}")

'''
    Exception raised when a transaction cannot be found
    @param title: str - The title of the transaction
'''
class TransactionNotFoundError(TransactionError):
    def __init__(self, title: str):
        super().__init__(f"Transaction with title '{title}' not found")

'''
    Transaction service
'''
class TransactionService:
    def __init__(self):
        self.repository = TransactionRepository()
        self.account_service = AccountService()

    def reset_transactions(self):
        self.repository.reset_transactions()

    def get_all_transactions(self) -> List[dict]:
        transactions = self.repository.get_all_transactions()
        # Convert timestamp back to ISO format string for frontend
        for transaction in transactions:
            if 'transactionDate' in transaction:
                timestamp = transaction['transactionDate']
                transaction['transactionDate'] = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
        return transactions
    
    '''
        Get a transaction by title (which is the ID)
    '''
    def get_transaction(self, title: str) -> Optional[dict]:
        transaction = self.repository.get_transaction(title)
        if transaction: 
            transaction['transactionDate'] = datetime.fromtimestamp(transaction['transactionDate']).strftime('%Y-%m-%d')
        return transaction

    '''
        Create a new transaction
        @param transaction: dict - The transaction to create
        @return: dict - The created transaction
        @raise ValueError: If the transaction data is invalid or already exists
        @raise DuplicateTransactionError: If the transaction already exists
    '''
    def create_transaction(self, transaction: dict) -> dict:
        # Convert ISO format string to timestamp
        if 'transactionDate' in transaction:
            transaction['transactionDate'] = int(datetime.fromisoformat(transaction['transactionDate']).timestamp())
        
        # Validate transaction data
        if not all(key in transaction for key in ['title', 'description', 'amount', 'fromAccount', 'toAccount', 'transactionDate']):
            raise ValueError("Missing required transaction fields")
        
        # Check if amount is positive, because transfers can not be negative
        if not isinstance(transaction['amount'], (int, float)) or transaction['amount'] < 0:
            raise ValueError("Amount must be a positive number")
        
        # Check if accounts are different -- that's illogical
        if transaction['fromAccount'] == transaction['toAccount']:
            raise ValueError("From and to accounts cannot be the same")
        
        # Check if transaction with same title (ID) exists
        existing_transaction = self.repository.get_transaction(transaction['title'])
        if existing_transaction:
            raise DuplicateTransactionError(transaction['title'])
        
        return self.repository.create_transaction(transaction)

    '''
        Update a transaction
        @param title: str - The title of the transaction
        @param transaction: dict - The transaction to update
        @return: dict - The updated transaction
        @raise ValueError: If the transaction data is invalid
    '''
    def update_transaction(self, title: str, transaction: dict) -> Optional[dict]:
        # Convert ISO format string to timestamp
        if 'transactionDate' in transaction:
            transaction['transactionDate'] = int(datetime.fromisoformat(transaction['transactionDate']).timestamp())
        
        # Ensure all required fields are present
        if not all(key in transaction for key in ['title', 'description', 'amount', 'fromAccount', 'toAccount', 'transactionDate']):
            raise ValueError("Missing required transaction fields")
        
        # Make sure amount is positive
        if not isinstance(transaction['amount'], (int, float)) or transaction['amount'] < 0:
            raise ValueError("Amount must be a positive number")
        
        # Check if accounts are different -- that's illogical
        if transaction['fromAccount'] == transaction['toAccount']:
            raise ValueError("From and to accounts cannot be the same")
        return self.repository.update_transaction(title, transaction)

    '''
        Delete a transaction
        @param title: str - The title of the transaction
        @return: bool - True if the transaction was deleted, False otherwise
    '''
    def delete_transaction(self, title: str) -> bool:
        return self.repository.delete_transaction(title)

    '''
        Bulk create transactions
        @param transactions: List[dict<Transaction>] - The transactions to create
        @return: List[dict<Transaction>] - The created transactions
    '''
    def bulk_create_transactions(self, transactions: List[dict]) -> List[dict]:
        created_transactions = []
        for transaction in transactions:
            try:
                # Check if from_account exists, create if not
                try:
                    self.account_service.get_account(transaction['fromAccount'])
                except AccountNotFoundError:
                    self.account_service.create_account({
                        'account_name': transaction['fromAccount'],
                    })
                    

                # Check if to_account exists, create if not
                try:
                    self.account_service.get_account(transaction['toAccount'])
                except AccountNotFoundError:
                    self.account_service.create_account({
                        'account_name': transaction['toAccount'],
                    })

                # Create the transaction
                created_transaction = self.create_transaction(transaction)
                created_transactions.append(created_transaction)
            except Exception as e:
                print(f"Failed to create transaction: {str(e)}")
                continue

        return created_transactions 