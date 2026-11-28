FROM node:24.22.2-alpine3.23

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package*.json ./

RUN npm clean-install

COPY . .

RUN chmod +x ./bin/boot-app.sh

CMD ["/usr/src/api/bin/boot-app.sh"]
