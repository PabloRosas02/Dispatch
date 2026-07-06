
ARG NODE_VERSION=20

# BASE
FROM node:${NODE_VERSION}-slim AS backend-build
WORKDIR /app
COPY package*.json ./

RUN npm install --package-lock-only && \
  npm ci

COPY . .

RUN npm run build

# PRODUCTION
FROM node:${NODE_VERSION}-slim AS backend-production

# Variables de entorno
ENV NODE_ENV=production

WORKDIR /app

RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

COPY --from=backend-build /app/node_modules ./node_modules
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/db ./db

# Crear usuario no root
RUN chown -R nodejs:nodejs /app /app/db /app/dist

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]
