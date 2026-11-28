# Debian (glibc) rather than Alpine so node_modules installed on a Linux host also run in this
# container: docker-compose.development.yml mounts ./web over /usr/src/web, node_modules included.
FROM node:24.22.2-bookworm-slim

RUN mkdir -p /usr/src/web
WORKDIR /usr/src/web

COPY package*.json ./

RUN npm clean-install

COPY . .

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
