
FROM node:19-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]

