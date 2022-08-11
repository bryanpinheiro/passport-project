FROM node:14.20.0-alpine

EXPOSE 3000

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package.json

COPY yarn.lock yarn.lock

RUN yarn install; yarn cache clean

COPY . .

CMD ["yarn", "run", "dev"]