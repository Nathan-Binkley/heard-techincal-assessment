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