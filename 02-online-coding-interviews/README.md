
Online Coding Interviews

This folder contains a minimal demo of a collaborative coding interview app.

Structure:
- `frontend/` — React + Vite client.
- `backend/` — Express + WebSocket realtime server.

Commands

- Install frontend dependencies:
	```bash
	cd 02-online-coding-interviews/frontend
	npm install
	```

- Start frontend dev server:
	```bash
	npm run dev -- --host 0.0.0.0
	```

- Install backend dependencies:
	```bash
	cd 02-online-coding-interviews/backend
	npm install
	```

- Start backend server:
	```bash
	npm run dev
	```

- Run backend integration tests:
	```bash
	cd 02-online-coding-interviews/backend
	npm test
	```

Notes:

- Frontend connects to WebSocket at `ws://localhost:3000/ws?sessionId={id}` by default when backend runs on port 3000.
- Code execution is sandboxed in an iframe in the browser (frontend handles it).

End-to-End Application for online coding interviews