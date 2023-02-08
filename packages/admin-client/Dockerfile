FROM node:18-alpine as builder
ENV NODE_ENV production
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install
# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginxinc/nginx-unprivileged:1.22-alpine as production
# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 85
# Start nginx
CMD ["nginx", "-g", "daemon off;"]