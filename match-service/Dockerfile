FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

ENV PORT=443

RUN yarn

RUN yarn add fs-extra

COPY . .

EXPOSE 80

EXPOSE 443

CMD ["node", "index.js"]
