FROM node:20-alpine

# Cache-bust comment — forces a full rebuild when Railway's Docker layer
# caching gets stale (2026-07-17)
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
