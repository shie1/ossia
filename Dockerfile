FROM node:18-alpine3.15
EXPOSE 3000/tcp
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build
ENTRYPOINT ["yarn", "start"]