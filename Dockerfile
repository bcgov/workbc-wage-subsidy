# dockerfile for an image with the admin api, express deployment
FROM node:lts-alpine3.16
FROM node:18-alpine as builder
ENV NODE_ENV production
ARG REACT_APP_KEYCLOAK_REALM
ENV REACT_APP_KEYCLOAK_REALM=$REACT_APP_KEYCLOAK_REALM
# repeat the above 2 lines of code for .env.sample all the environments
ARG REACT_APP_KEYCLOAK_URL
ENV REACT_APP_KEYCLOAK_URL=$REACT_APP_KEYCLOAK_URL
ARG REACT_APP_KEYCLOAK_CLIENT_ID
ENV REACT_APP_KEYCLOAK_CLIENT_ID=$REACT_APP_KEYCLOAK_CLIENT_ID
ARG REACT_APP_ADMIN_API_URL
ENV REACT_APP_ADMIN_API_URL=$REACT_APP_ADMIN_API_URL
ARG REACT_APP_VIEW_URL
ENV REACT_APP_VIEW_URL=$REACT_APP_VIEW_URL
ARG REACT_APP_MINISTRY_VIEW_URL
ENV REACT_APP_MINISTRY_VIEW_URL=$REACT_APP_MINISTRY_VIEW_URL
ARG REACT_APP_DRAFT_URL
ENV REACT_APP_DRAFT_URL=$REACT_APP_DRAFT_URL
ARG REACT_APP_ENVIRONMENT
ENV REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT
ARG REACT_ADMIN_TOKEN
ENV REACT_ADMIN_TOKEN=$REACT_ADMIN_TOKEN
ARG FONT_AWESOME_TOKEN
ENV FONT_AWESOME_TOKEN=$FONT_AWESOME_TOKEN


RUN mkdir -p /app1

# Create app directory
WORKDIR /app1

# Copy package.json
COPY package*.json ./
COPY tsconfig.json ./

# Copy all files
COPY . .

# Install dependencies
RUN npm install --omit=dev --workspace=packages/admin-api
RUN npm run build --workspace=packages/admin-api

# Expose port 8002
EXPOSE 8002

# Run app
CMD [ "node","dist/app.js" ]





RUN mkdir -p /app2

# Set the working directory to /app inside the container
WORKDIR /app2
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
COPY ./.npmrc.dist ./.npmrc
RUN npm install --omit=dev --workspace=packages/admin-client
# Build the app
RUN npm run build --workspace=packages/admin-client

# Bundle static assets with nginx
FROM nginxinc/nginx-unprivileged:1.23-alpine as production
ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app2/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 8080
# Start nginx
CMD ["nginx", "-g", "daemon off;"]