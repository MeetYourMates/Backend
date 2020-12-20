FROM node:latest

WORKDIR /usr/src/app

COPY ./backend .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
