FROM node:14-alpine

WORKDIR /app/service/auth

COPY . .

RUN yarn install

EXPOSE 3001

CMD ["yarn", "start"]