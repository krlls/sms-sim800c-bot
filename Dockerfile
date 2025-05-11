FROM node:22.14

RUN apt-get update && apt-get install -y udev

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install --frozen-lockfile

ENV NODE_ENV=production
CMD ["yarn", "start"]
