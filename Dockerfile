# Use official Node.js LTS image (20.x)
FROM node:20-alpine

# Install bash and other useful tools (optional, for shell scripts)
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy application code
COPY src ./src
COPY public ./public
COPY .env ./

# Expose the port (default 4000)
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
