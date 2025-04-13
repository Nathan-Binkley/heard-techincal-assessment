# Full Stack Next.js-Flask Application

This is a full-stack web application with a Next.js frontend and Flask backend.

## Project Structure
```
.
├── frontend/          # Next.js frontend application
└── backend/          # Flask backend application
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Development
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:8080`

## API Specification

### Transactions

#### Get All Transactions
```http
GET /api/transactions
```
Returns a list of all transactions.

#### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
    "title": "string",
    "description": "string",
    "amount": number,
    "fromAccount": "string",
    "toAccount": "string",
    "transactionDate": "string"
}
```

#### Update Transaction
```http
PUT /api/transactions/{title}
Content-Type: application/json

{
    "title": "string",
    "description": "string",
    "amount": number,
    "fromAccount": "string",
    "toAccount": "string",
    "transactionDate": "string"
}
```

#### Delete Transaction
```http
DELETE /api/transactions/{title}
```

### Accounts

#### Get All Accounts
```http
GET /api/accounts
```
Returns a list of all accounts.

#### Get Account by Name
```http
GET /api/accounts/{account_name}
```

#### Create Account
```http
POST /api/accounts
Content-Type: application/json

{
    "account_name": "string",
    "balance": number
}
```

#### Update Account
```http
PUT /api/accounts/{account_name}
Content-Type: application/json

{
    "account_name": "string",
    "balance": number
}
```

#### Delete Account
```http
DELETE /api/accounts/{account_name}
```

### Utility

#### Reset All Data
```http
POST /api/reset
```
Resets all transactions and accounts.

### Response Codes
- 200: Success
- 201: Created
- 204: No Content
- 404: Not Found
- 500: Server Error

### Error Response Format
```json
{
    "error": "string"
}
```

### Success Response Format
```json
{
    "message": "string"
}
``` 