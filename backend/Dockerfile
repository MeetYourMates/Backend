FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN echo "$PWD"

RUN npm run-script build

EXPOSE 3000

CMD ["npm", "start"]
