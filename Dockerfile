FROM node:14.4.0-alpine

ENV MONGODB_URI mongodb://localhost:27017/

ENV MONGODB_DB shortenlink

ENV NODE_ENV production

ENV APP_URL https://example.com

ENV API_KEY secret

WORKDIR /app

COPY package.* .

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
