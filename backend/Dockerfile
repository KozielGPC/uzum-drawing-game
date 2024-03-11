# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the Prisma schema and generate the Prisma client
COPY prisma ./prisma/
RUN yarn prisma generate

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Run the application
FROM node:18-alpine

# Set the working directory
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
RUN apt-get install -y build-essential libpq-dev

# Copy node_modules, package.json, prisma generated files and the build output from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/@generated ./prisma/@generated

# Expose the port the application runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]
