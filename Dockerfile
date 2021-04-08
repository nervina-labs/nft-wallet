FROM node:12

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

EXPOSE 5000

ENV NODE_ENV production
CMD [ "npm", "start" ]
