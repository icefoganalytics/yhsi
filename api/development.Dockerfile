# Debian (glibc) rather than Alpine so node_modules installed on a Linux host also run in this
# container: docker-compose.development.yml mounts ./api over /usr/src/api, node_modules included.
FROM node:24.22.2-bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium fonts-freefont-ttf && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package*.json ./

RUN npm clean-install

COPY . .

RUN chmod +x ./bin/boot-app.sh

CMD ["/usr/src/api/bin/boot-app.sh"]
