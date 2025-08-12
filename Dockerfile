# 1️⃣ Base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./

# 2️⃣ Install dependencies
RUN npm install

# 3️⃣ Copy all files
COPY . .

# 4️⃣ Expose port
EXPOSE 3000

# 5️⃣ Start development server
CMD ["npm", "run", "dev"]
