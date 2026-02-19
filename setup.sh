#!/bin/bash

echo "🚀 Starting Local Setup for Hire Pulse..."

# Frontend Setup
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

# Backend Node Setup
echo "📦 Installing Backend (Node) Dependencies..."
cd backend-Node
npm install
cd ..

# Backend Python Setup
echo "📦 Installing Backend (Python) Dependencies..."
cd backend-Py
pip3 install -r requirements.txt
cd ..

echo "✅ Setup Complete!"
echo "To run the application, open 3 terminal tabs and run:"
echo "1. Frontend: cd frontend && npm run dev"
echo "2. Backend Node: cd backend-Node && npm start"
> Verify at: [http://localhost:3000/job-recommendations](http://localhost:3000/job-recommendations) (Should return a JSON response)

echo "3. Backend Python: cd backend-Py && python3 -m uvicorn main:app --reload"
> Verify at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (Should show Swagger UI)
