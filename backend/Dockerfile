FROM node:latest

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN echo "$PWD"

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "./dist/index.js"]
