FROM node:22-alpine3.19

ENV TZ=America/Mexico_City
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/local/apps/myapp

COPY package.json ./
RUN npm install && npm cache clean --force
ENV PATH=/usr/local/myapp/node_modules/.bin:$PATH


WORKDIR /usr/local/apps/myapp/dev
COPY ./src ./src

ENV NODE_OPTIONS="--max_old_space_size=4096"

CMD ["npm","run","start"]  