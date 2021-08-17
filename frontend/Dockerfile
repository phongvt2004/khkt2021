FROM node:14-alpine

WORKDIR /project/src/app

COPY package.json /project/src/app/package.json

RUN yarn --silent
RUN yarn add react-scripts
RUN yarn upgrade

COPY . /project/src/app

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]