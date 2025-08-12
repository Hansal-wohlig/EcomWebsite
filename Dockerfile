# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the app
COPY . .

# Copy env file (only if using build-time env)
# For CI/CD we inject at runtime via docker run or Kubernetes secrets
COPY .env .env

# Expose port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
