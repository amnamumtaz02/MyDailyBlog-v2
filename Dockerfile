FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]