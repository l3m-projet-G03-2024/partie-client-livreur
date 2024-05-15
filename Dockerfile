FROM node:latest as build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install -g @angular/cli

COPY . .

RUN npm run build --configuration=production

FROM nginx:latest as deploy

COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/client-livreur/browser /usr/share/nginx/html

EXPOSE 80
