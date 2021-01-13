FROM node:latest

WORKDIR /usr/src/app

COPY ./backend .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
