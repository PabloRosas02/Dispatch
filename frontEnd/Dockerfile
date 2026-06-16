
ARG NODE_VERSION=20

# BUILD
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development

ENV NODE_ENV=development

RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS build
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN npm install --package-lock-only && \
  npm ci

COPY . .

RUN npm run build

RUN chown -R nodejs:nodejs /app && \
  chown -R 755 /app

USER nodejs

FROM node:${NODE_VERSION}-alpine AS production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g serve

COPY --from=build --chown=nodejs:nodejs /app/dist ./dist

RUN mkdir -p /app/dist && \
  chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
