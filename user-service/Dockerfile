FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

ENV PORT=443

RUN yarn

RUN yarn add js-extra

COPY . .

EXPOSE 3006
EXPOSE 443

CMD ["node", "index.js"]
