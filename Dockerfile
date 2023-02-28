FROM node:10.15.3-alpine as builder

ENV NODE_ENV="development"
COPY ./package.json /app/package.json
WORKDIR /app
RUN npm install
COPY . /app
RUN npm run build:prod

# Only copy the required distribution code to the runner
FROM node:10.15.3-alpine as runner

ENV NODE_ENV="production"

COPY --from=builder app/dist app/dist
COPY --from=builder app/node_modules app/node_modules

ARG PORT=5000
ENV PORT=${PORT}

EXPOSE ${PORT}
WORKDIR /app
CMD node dist/server/server.js