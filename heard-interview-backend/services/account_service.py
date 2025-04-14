from typing import List, Optional
from repositories.account_repository import AccountRepository

'''
    Custom exceptions for account service
'''

'''
    Base exception for account service
    @param message: str - The message to display
'''
class AccountError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

'''
    Exception raised when a account already exists
    @param account_name: str - The name of the account
'''
class DuplicateAccountError(AccountError):
    def __init__(self, account_name: str):
        super().__init__(f"Account with name '{account_name}' already exists")

'''
    Exception raised when account data is invalid
    @param message: str - The message to display
'''
class InvalidAccountError(AccountError):
    def __init__(self, message: str):
        super().__init__(f"Invalid account data: {message}")

'''
    Exception raised when a account cannot be found
    @param account_name: str - The name of the account
'''
class AccountNotFoundError(AccountError):
    def __init__(self, account_name: str):
        super().__init__(f"Account with name '{account_name}' not found")

'''
    Account service
'''
class AccountService:
    def __init__(self):
        self.repository = AccountRepository()

    def get_all_accounts(self) -> List[dict]:
        return self.repository.get_all_accounts()
    
    '''
        Get a account by name
    '''
    def get_account(self, account_name: str) -> Optional[dict]:
        account = self.repository.get_account(account_name)
        if account is None:
            raise AccountNotFoundError(account_name)
        return account

    '''
        Create a new account
        @param account: dict - The account to create
        @return: dict - The created account
        @raise ValueError: If the account data is invalid or already exists
        @raise DuplicateAccountError: If the account already exists
    '''
    def create_account(self, account: dict) -> dict:
        # Validate account data
        if not all(key in account for key in ['account_name']):
            raise ValueError("Missing required account fields")
        
        # Check if account name is not empty
        if not account['account_name']:
            raise ValueError("Account name must not be empty")
        
        # Check if account with same name exists
        existing_account = self.repository.get_account(account['account_name'])
        if existing_account:
            raise DuplicateAccountError(account['account_name'])
        
        return self.repository.create_account(account)

    '''
        Update a account
        @param account_name: str - The name of the account
        @param account: dict - The account to update
        @return: dict - The updated account
        @raise ValueError: If the account data is invalid
    '''
    def update_account(self, account_name: str, account: dict) -> Optional[dict]:
        # Ensure all required fields are present
        if not all(key in account for key in ['account_name']):
            raise ValueError("Missing required account fields")
        
        # Make sure amount is positive
        if not isinstance(account['account_name'], str):
            raise ValueError("Account name must be a string")
        
        return self.repository.update_account(account_name, account)

    '''
        Get all transactions for a account
        @param account_name: str - The name of the account
        @return: List[dict] - The transactions for the account
    '''
    def get_account_transactions(self, account_name: str) -> List[dict]:
        return self.repository.get_account_transactions(account_name)

    '''
        Delete a account
        @param account_name: str - The name of the account
        @return: bool - True if the account was deleted, False otherwise
    '''
    def delete_account(self, account_name: str) -> bool:
        return self.repository.delete_account(account_name)
    
    '''
        Reset the accounts
    '''
    def reset_accounts(self):
        return self.repository.reset_accounts()
