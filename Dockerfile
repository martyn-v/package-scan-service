FROM node:25-slim AS build

WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN corepack enable && yarn install --immutable
COPY tsconfig.json ./
COPY src ./src
RUN yarn build

FROM node:25-slim

WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN corepack enable && yarn workspaces focus --production
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["yarn", "start"]
