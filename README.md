# Containerized Network Management - Frontend

This workspace contains the React frontend. It connects to the Flask backend at `/api`.

Run:
- Backend: (separate workspace) PORT=3001 python app.py
- Frontend: npm install && npm start (runs on 3000, proxies /api to 3001)

Environment:
- Frontend .env.example includes REACT_APP_API_BASE for future deployments.