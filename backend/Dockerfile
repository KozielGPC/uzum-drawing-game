FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN yarn

RUN yarn prisma generate

COPY . . 

RUN yarn build

FROM node:alpine as production

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/


RUN yarn --only=prod

RUN yarn prisma generate

COPY . .

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/package.json .

CMD ["node", "dist/main"]