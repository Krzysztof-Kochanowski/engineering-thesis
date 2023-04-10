FROM node:16-alpine as build

WORKDIR /app

COPY package.json /app
COPY . /app

RUN npm install
RUN npm run build -- --configuration development

FROM nginx:1-alpine
COPY --from=build /app/dist/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
