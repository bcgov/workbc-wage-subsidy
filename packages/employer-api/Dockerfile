# dockerfile for an image with the employer api, express deployment
FROM node:lts-alpine3.16
ENV NODE_ENV production

RUN mkdir -p /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./
COPY tsconfig.json ./

# Copy all files
COPY . .

# Install dependencies
RUN npm install --omit=dev
RUN npm run build

# Expose port 8001
EXPOSE 8000

# Run app
CMD [ "node","dist/app.js" ]