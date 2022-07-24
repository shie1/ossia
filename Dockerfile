FROM alpine:latest
EXPOSE 3000/tcp
RUN apk add --no-cache yarn
WORKDIR /app
COPY . /app
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn start"]
