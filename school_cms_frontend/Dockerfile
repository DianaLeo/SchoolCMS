# syntax=docker/dockerfile:1

FROM node:18.16.0
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["npm", "start"]
EXPOSE 3000