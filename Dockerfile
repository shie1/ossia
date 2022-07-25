FROM node:18-alpine3.15
ENV NODE_ENV=production
EXPOSE 3000/tcp
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build
ARG BUILD_DATE
ENV BUILD_DATE=${BUILD_DATE}
ENTRYPOINT ["yarn", "start"]