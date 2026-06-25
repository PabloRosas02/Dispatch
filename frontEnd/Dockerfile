
ARG NODE_VERSION=20

# BASE
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
COPY package*.json ./


# DEVELOPMENT
FROM base AS development

ENV NODE_ENV=development

RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]


# BUILD
FROM base AS build
RUN npm install --package-lock-only && \
  npm ci

COPY . .

RUN npm run build


# PRODUCTION
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html && \
  chmod -R 755 /usr/share/nginx/html && \
  chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
