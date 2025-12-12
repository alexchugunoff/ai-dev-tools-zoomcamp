# Online Coding Interviews

This folder contains a minimal demo of a collaborative coding interview app.

## Structure

- `frontend/` — React + Vite client with CodeMirror editor and WASM code execution.
- `backend/` — Express + WebSocket realtime server.
- `Dockerfile` — Multi-stage Docker build (frontend + backend in one container).

## Commands

### Development

Install all dependencies:
```bash
cd 02-online-coding-interviews
npm run install:all
```

Start frontend dev server:
```bash
cd 02-online-coding-interviews/frontend
npm run dev -- --host 0.0.0.0
```

Start backend server:
```bash
cd 02-online-coding-interviews/backend
npm run dev
```

Run both frontend and backend together:
```bash
cd 02-online-coding-interviews
npm run dev
```

Run backend integration tests:
```bash
cd 02-online-coding-interviews/backend
npm test
```

### Docker

Build and run the application in a container:

```bash
# Build Docker image
cd 02-online-coding-interviews
docker build -t online-coding-interviews .

# Run container on port 3000
docker run -p 3000:3000 online-coding-interviews
```

Access the app at: **http://localhost:3000**

## Features

- **Real-time Collaborative Editing**: WebSocket-based live code sync across all connected users.
- **Multiple Languages**: JavaScript and Python syntax highlighting via CodeMirror.
- **Safe Code Execution**:
  - **JavaScript**: Executed in sandboxed iframe (no network access, no file system).
  - **Python**: Compiled to WebAssembly via [Pyodide](https://pyodide.org/) and executed in browser (no server involvement).
- **Session Management**: Create unique interview sessions via REST API.
- **Containerized**: Single Docker image serves both frontend and backend.

## Architecture

- Frontend connects via WebSocket at `/ws?sessionId={id}` (relative path, works in Docker and dev).
- Code execution happens entirely in the browser (Pyodide for Python, iframe sandbox for JavaScript).
- Backend stores session state and broadcasts code patches to all connected clients.
- In Docker, backend serves static frontend files from `frontend/dist`.

## Notes

- Pyodide loads from CDN (`https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js`).
- Code execution output is captured and displayed in the preview pane.
- All execution is sandboxed—no direct server-side code evaluation.
- Docker base image: `node:18-alpine` (lightweight, ~160MB).

## Deployment

### Render (Free Tier)

1. **Create Render Account**: Go to [render.com](https://render.com) and sign up with GitHub.

2. **Connect Repository**: 
   - Click "New" → "Web Service"
   - Connect your GitHub account
   - Select repository: `ai-dev-tools-zoomcamp`
   - Branch: `main`

3. **Configure Service**:
   - **Name**: `online-coding-interviews` (or any name)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./02-online-coding-interviews/Dockerfile`
   - **Docker Build Context Directory**: `./02-online-coding-interviews`
   - **Branch**: `main`

4. **Environment**:
   - **Environment**: `Production`
   - Add environment variable: `NODE_ENV=production`

5. **Deploy**: Click "Create Web Service"

Your app will be available at: `https://your-service-name.onrender.com`

**Note**: Free tier has sleep after 15 minutes of inactivity. First load may take ~30 seconds.
