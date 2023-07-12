# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the NestJS application will listen on
EXPOSE 4000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
