FROM node:20.9.0 AS build
WORKDIR /usr/src/app
COPY find-my-rock/package.json find-my-rock/package-lock.json ./
RUN npm install
COPY find-my-rock ./
RUN npm run build

FROM nginx:1.17.1-alpine AS frontend
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/find-my-rock/browser /usr/share/nginx/html
