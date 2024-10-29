# Use Node.js as the base image
FROM node:22-alpine AS base

# Create a non-root user
RUN addgroup -S waitlis && adduser -S waitlis -G waitlis

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY --chown=waitlis:waitlis package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY --chown=waitlis:waitlis . .

# Build the Next.js application
RUN npm run build

# Change ownership of the /app directory to the non-root user
RUN chown waitlis:waitlis /app

# Switch to the non-root user
USER waitlis

# Expose port 3000
EXPOSE 3000

# Define the command to run the app
ENTRYPOINT [ "sh" ]
CMD ["-c", "npm run migrate:deploy && npm run start"]
