FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache chromium

ENV CHROME_PATH=/usr/bin/chromium-browser

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs
    
USER nextjs

EXPOSE 3000

CMD ["yarn", "start:prod"]
