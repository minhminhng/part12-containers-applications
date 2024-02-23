FROM node:16 as base-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

FROM base-stage as test-stage
RUN CI=TRUE npm test

FROM test-stage as build-stage
RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html