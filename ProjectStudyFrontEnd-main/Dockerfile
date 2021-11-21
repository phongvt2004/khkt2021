# build stage
FROM node:lts-alpine as build-stage
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app
COPY ./package*.json ./
RUN yarn
RUN yarn upgrade
COPY . .
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY default.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]