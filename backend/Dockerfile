FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3 make g++

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src/generated ./src/generated

COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]