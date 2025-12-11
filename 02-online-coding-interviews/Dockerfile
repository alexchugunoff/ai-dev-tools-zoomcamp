# Multi-stage build: compile frontend, serve both frontend and backend from single container
FROM node:18-alpine AS builder

WORKDIR /app

# Copy entire project structure
COPY . .

# Install frontend dependencies
RUN cd frontend && npm ci

# Install backend dependencies
RUN cd backend && npm ci

# Build frontend
RUN cd frontend && npm run build

# Final stage: serve both frontend and backend
FROM node:18-alpine

WORKDIR /app

# Copy backend with node_modules from builder
COPY --from=builder /app/backend ./backend

# Copy built frontend dist folder
COPY --from=builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

# Expose port for backend API and frontend
EXPOSE 3000

# Start backend (which serves both API and static frontend files)
CMD ["node", "server.js"]
