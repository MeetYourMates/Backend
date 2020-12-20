FROM node:latest

WORKDIR /usr/src/app

COPY ./backend .

RUN npm install

RUN echo "$PWD"

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
