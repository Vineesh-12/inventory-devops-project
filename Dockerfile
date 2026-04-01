FROM node:20

WORKDIR /app

# Install curl (for healthcheck)
RUN apt-get update && apt-get install -y curl

# Copy package files first (better caching)
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install --prefix backend

# Copy remaining code
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

# Start app
CMD ["node", "backend/server.js"]