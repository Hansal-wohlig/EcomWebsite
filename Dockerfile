# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy source code
COPY src ./src
COPY public ./public
COPY .env ./

# Expose the port (default 4000)
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
