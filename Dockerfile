FROM node:latest

WORKDIR /usr/src/app

COPY ./backend .

RUN npm install

RUN echo "$PWD"

RUN npm run-script build

EXPOSE 3000

CMD ["npm", "start"]
