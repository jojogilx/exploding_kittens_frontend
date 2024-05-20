FROM node:20-alpine

WORKDIR /app

COPY package*.json .

COPY tsconfig.json .

RUN npm install

COPY . .

COPY ./assets ./assets

EXPOSE 3000

CMD [ "npm", "start" ]