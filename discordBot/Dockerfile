
ARG NODE_VERSION=26.5.0

# BASE
FROM node:${NODE_VERSION}-alpine AS discord-build
WORKDIR /app
COPY package*.json ./

RUN npm install  && \
  npm ci

COPY . .

RUN npm run build

# PRODUCTION
FROM node:${NODE_VERSION}-slim AS discord-production

# Variables de entorno
ENV NODE_ENV=production

WORKDIR /app

RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

COPY --from=discord-build /app/node_modules ./node_modules
COPY --from=discord-build /app/dist ./dist
COPY --from=discord-build /app/package*.json ./

# Crear usuario no root
RUN chown -R nodejs:nodejs /app /app/dist

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
