import flask
from flask_cors import CORS
from services.transaction_service import TransactionService
from services.account_service import AccountService
app = flask.Flask(__name__)

CORS(app)

transaction_service = TransactionService()
account_service = AccountService()

'''
    ------------------------- HELLO WORLD / HEALTH CHECK ENDPOINT -------------------------
'''

'''
    Hello world endpoint -- Can also be used as a health check
'''
@app.route('/api/hello', methods=['GET', 'OPTIONS'])
def hello():
    if flask.request.method == 'OPTIONS':
        return '', 204
    return flask.jsonify({"message": "Hello, World!"})

'''
    ------------------------- TRANSACTION ENDPOINTS -------------------------
'''

'''
    Get all transactions
'''
@app.route('/api/transactions', methods=['GET', 'OPTIONS'])
def get_transactions():
    if flask.request.method == 'OPTIONS':
        return '', 204
    transactions = transaction_service.get_all_transactions()
    return flask.jsonify(transactions)

'''
    Create a new transaction
'''
@app.route('/api/transactions', methods=['POST', 'OPTIONS'])
def create_transaction():
    if flask.request.method == 'OPTIONS':
        return '', 204
    data = flask.request.json
    try:
        transaction = transaction_service.create_transaction(data)
        return flask.jsonify(transaction), 201
    except ValueError as e:
        return flask.jsonify({"error": str(e)}), 400
    
'''
    Delete a transaction
    @param title: str - The title of the transactionlete a transaction
    @param title: str - The title of the transaction
'''
@app.route('/api/transactions/<string:title>', methods=['DELETE', 'OPTIONS'])
def delete_transaction(title):
    if flask.request.method == 'OPTIONS':
        return '', 204
    if transaction_service.delete_transaction(title):
        return flask.jsonify({"message": "Transaction deleted successfully"})
    return flask.jsonify({"error": "Transaction not found"}), 404

'''
    Update a transaction
    @param title: str - The title of the transaction
'''
@app.route('/api/transactions/<string:title>', methods=['PUT', 'OPTIONS'])
def update_transaction(title):
    if flask.request.method == 'OPTIONS':
        return '', 204
    data = flask.request.json
    try:
        transaction = transaction_service.update_transaction(title, data)
        if transaction:
            return flask.jsonify(transaction)
        return flask.jsonify({"error": "Transaction not found"}), 404
    except ValueError as e:
        return flask.jsonify({"error": str(e)}), 400

'''
    ------------------------- ACCOUNT ENDPOINTS -------------------------
'''

'''
    Get all accounts
'''
@app.route('/api/accounts', methods=['GET', 'OPTIONS'])
def get_accounts():
    if flask.request.method == 'OPTIONS':
        return '', 204
    accounts = account_service.get_all_accounts()
    return flask.jsonify(accounts)

'''
    Create a new account
'''
@app.route('/api/accounts', methods=['POST', 'OPTIONS'])
def create_account():
    if flask.request.method == 'OPTIONS':
        return '', 204
    data = flask.request.json
    try:
        account = account_service.create_account(data)
        return flask.jsonify(account), 201
    except ValueError as e:
        return flask.jsonify({"error": str(e)}), 400
    
'''
    Get account by name
    @param account_name: str - The name of the account to get
'''
@app.route('/api/accounts/<string:account_name>', methods=['GET', 'OPTIONS'])
def get_account(account_name):
    if flask.request.method == 'OPTIONS':
        return '', 204
    account = account_service.get_account(account_name)
    return flask.jsonify(account)
    

'''
    ------------------------- UTILITY ENDPOINTS -------------------------
'''


'''
    Reset the data -- Useful for testing + restarting for examples
'''
@app.route('/api/reset', methods=['DELETE', 'OPTIONS'])
def reset_data():
    if flask.request.method == 'OPTIONS':
        return '', 204
    try:
        transaction_service.reset_transactions()
        account_service.reset_accounts()
        return flask.jsonify({"message": "All data has been reset successfully"}), 200
    except Exception as e:
        return flask.jsonify({"error": str(e)}), 500

'''
    Create multiple transactions and their accounts
'''
@app.route('/api/transactions/bulk', methods=['POST', 'OPTIONS'])
def bulk_create_transactions():
    if flask.request.method == 'OPTIONS':
        return '', 204
    data = flask.request.json
    try:
        if not isinstance(data, list):
            return flask.jsonify({"error": "Request body must be a list of transactions"}), 400
        
        transactions = transaction_service.bulk_create_transactions(data)
        return flask.jsonify(transactions), 201
    except ValueError as e:
        return flask.jsonify({"error": str(e)}), 400
    except Exception as e:
        return flask.jsonify({"error": str(e)}), 500

'''
    Run the app
'''
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
