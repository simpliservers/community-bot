FROM node:alpine

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN apk add --update --no-cache make

COPY package*.json .

RUN npm i

COPY * *

CMD [ "npm", "run", "deploy" ]