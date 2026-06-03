
ARG NODE_VERSION=20
ARG NODE_ENV=production

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
RUN npm ci
COPY . .
RUN npm run build

FROM build AS production
ENV NODE_ENV=production
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "preview"]
