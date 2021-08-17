FROM node:14-alpine

WORKDIR /project/src/app

COPY package.json /project/src/app/package.json

RUN yarn install
RUN yarn upgrade

COPY src/* /project/src/app/

EXPOSE 8080

CMD ["yarn", "start"]