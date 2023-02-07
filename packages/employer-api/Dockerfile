# dockerfile for an image with the form api, express deployment
FROM node:16

RUN mkdir -p /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./
COPY tsconfig.json ./

# Copy all files
COPY . .

# Install dependencies
RUN npm install
RUN npm run build

# Expose port 8001
EXPOSE 8000

# Run app
CMD [ "node","dist/app.js" ]