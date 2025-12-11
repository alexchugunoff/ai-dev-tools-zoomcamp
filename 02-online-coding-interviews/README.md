
Online Coding Interviews

This folder contains a minimal demo of a collaborative coding interview app.

Structure:
- `frontend/` — React + Vite client with CodeMirror editor and WASM code execution.
- `backend/` — Express + WebSocket realtime server.

Commands

- Install all dependencies:
  ```bash
  cd 02-online-coding-interviews
  npm run install:all
  ```

- Start frontend dev server:
  ```bash
  cd 02-online-coding-interviews/frontend
  npm run dev -- --host 0.0.0.0
  ```

- Start backend server:
  ```bash
  cd 02-online-coding-interviews/backend
  npm run dev
  ```

- Run both frontend and backend together:
  ```bash
  cd 02-online-coding-interviews
  npm run dev
  ```

- Run backend integration tests:
  ```bash
  cd 02-online-coding-interviews/backend
  npm test
  ```

Features

- **Real-time Collaborative Editing**: WebSocket-based live code sync across all connected users.
- **Multiple Languages**: JavaScript and Python syntax highlighting via CodeMirror.
- **Safe Code Execution**:
  - **JavaScript**: Executed in sandboxed iframe (no network access, no file system).
  - **Python**: Compiled to WebAssembly via [Pyodide](https://pyodide.org/) and executed in browser (no server involvement).
- **Session Management**: Create unique interview sessions via REST API.

Architecture

- Frontend connects via WebSocket at `ws://localhost:3000/ws?sessionId={id}`.
- Code execution happens entirely in the browser (Pyodide for Python, iframe sandbox for JavaScript).
- Backend stores session state and broadcasts code patches to all connected clients.

Notes

- Pyodide loads from CDN (`https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js`).
- Code execution output is captured and displayed in the preview pane.
- All execution is sandboxed—no direct server-side code evaluation.
End-to-End Application for online coding interviews