
ARG NODE_VERSION=20

# BASE
FROM node:${NODE_VERSION}-alpine AS backend-build
WORKDIR /app
COPY package*.json ./

RUN npm install --package-lock-only && \
  npm ci

COPY . .

RUN npm run build

# PRODUCTION
FROM node:${NODE_VERSION}-alpine AS backend-production

# Variables de entorno
ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

COPY --from=backend-build /app/node_modules ./node_modules
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/db ./db

# Crear usuario no root
RUN chown -R nodejs:nodejs /app /app/db /app/dist

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]
