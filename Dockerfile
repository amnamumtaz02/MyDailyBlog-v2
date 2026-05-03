FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]