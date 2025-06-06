# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
FROM deps as build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

################################################################################
FROM base as final

ENV NODE_ENV=production

# Создаём .next и назначаем владельца node
RUN mkdir -p .next && chown -R node:node .next

# Копируем зависимости и сборку
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY package.json .


# Меняем пользователя на node
USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
