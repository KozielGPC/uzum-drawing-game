FROM node:18-alpine
RUN mkdir -p /svr/app
WORKDIR /svr/app
RUN npm i -g @nestjs/cli --silent
COPY package.json .
RUN npm install --silent
RUN npx prisma generate
COPY . .

EXPOSE $BACKEND_PORT
CMD ["npm", "run", "start:dev"]