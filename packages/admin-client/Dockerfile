FROM node:18-alpine as builder
ENV NODE_ENV=production
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

# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
COPY ./.npmrc.dist ./.npmrc
RUN npm install
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginxinc/nginx-unprivileged:1.23-alpine as production
ENV NODE_ENV production
# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 8080
# Start nginx
CMD ["nginx", "-g", "daemon off;"]