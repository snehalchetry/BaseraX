---
description: Start the Hostel ERP frontend and backend servers locally
---
To run the project locally for development, you need to start both the Vite React frontend and the Express backend simultaneously.

// turbo-all
1. Start the Express backend server (Listens on port 5000):
```bash
cd c:\HostelERP\server
npm run dev
```

2. Start the Vite frontend server in a new terminal (Listens on port 5173):
```bash
cd c:\HostelERP\client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173` to view the application.
